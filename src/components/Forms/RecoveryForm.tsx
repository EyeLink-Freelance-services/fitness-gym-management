"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type {
  RecoveryFormProps,
  RecoveryNewPasswordFormData,
  RecoveryRegisteredEmailFormData,
} from "@/types/forms";
import Header from "../FormElements/common/header";
import RecoveryNewPassword from "./Recovery/RecoveryNewPassword";
import RecoverySuccess from "./Recovery/RecoverySuccess";
import RegisteredEmail from "./Recovery/RegisteredEmail";

export default function RecoveryForm({ step, onBackToLogin, resetToken }: RecoveryFormProps) {
  const [errorUpdatePasswordForm, setUpdatePasswordFormError] = useState<string | null>(null);
  const [errorRegisteredEmailForm, setRegisteredEmailFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sent, setSent] = useState(false);

  const step1RegisteredForm = useForm<RecoveryRegisteredEmailFormData>({
    defaultValues: {
      email: ''
    }
  });
  const step2NewPasswordForm = useForm<RecoveryNewPasswordFormData>();

  const handleStep1 = async (data: RecoveryRegisteredEmailFormData) => {
    setRegisteredEmailFormError(null);

    const response = await fetch("/api/auth/reset/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setRegisteredEmailFormError(body?.message ?? "Could not start password reset");
      return;
    }

    // Always show success (don’t reveal if email exists)
    setSent(true);
  };

  const handleStep2 = async (values: RecoveryNewPasswordFormData) => {
    setUpdatePasswordFormError(null);

    if (!resetToken) {
      setUpdatePasswordFormError("Password reset link is missing or invalid.");
      return;
    }

    const r = await fetch("/api/auth/reset/confirm", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        token: resetToken,
        password: values.newPassword,
        confirmPassword: values.confirmPassword,
      }),
    });

    const data = await r.json().catch(() => null);

    if (!r.ok || !data?.ok) {
      setUpdatePasswordFormError(data?.message ?? "Could not reset password");
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="form-panel space-y-4 bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:bg-dark-2">
      <Header
        label="- Recovery"
        title="Reset access"
        subtitle="Enter your email to receive a reset link"
      />

      <div className="mb-6 flex gap-1.5">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-0.5 flex-1 rounded-full bg-stroke transition-colors ${
              step >= s ? "bg-blue-600" : ""
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        sent ? (
          <div className="space-y-2">
            <p className="text-sm">
              If an account exists for that email, you’ll receive a password reset link shortly.
            </p>
            <p className="text-xs opacity-70">
              Check your spam/junk folder too.
            </p>
          </div>
        ) : (
          <RegisteredEmail
            form={step1RegisteredForm}
            onNext={handleStep1}
            onBackToLogin={onBackToLogin}
          />
        )
      )}
      {errorRegisteredEmailForm && <p className="text-sm text-red-600">{errorRegisteredEmailForm}</p>}

      {step === 2 && !success && (
        <>
          <RecoveryNewPassword form={step2NewPasswordForm} onNext={handleStep2} />
          {errorUpdatePasswordForm && <p className="text-sm text-red-600">{errorUpdatePasswordForm}</p>}
        </>
      )}

      {success && <RecoverySuccess goToApp={onBackToLogin} />}
    </div>
  );
}
