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

export default function RecoveryForm({ step, onBackToLogin }: RecoveryFormProps) {
  const [errorUpdatePasswordForm, setUpdatePasswordFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sent, setSent] = useState(false);

  const step1RegisteredForm = useForm<RecoveryRegisteredEmailFormData>({
    defaultValues: {
      email: "",
    },
  });

  const step2NewPasswordForm = useForm<RecoveryNewPasswordFormData>();

  const handleStep1 = async (data: RecoveryRegisteredEmailFormData) => {
    await fetch("/api/auth/reset/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    // Always show success (don’t reveal if email exists)
    setSent(true);
  };

  const handleStep2 = async (values: RecoveryNewPasswordFormData) => {
    setUpdatePasswordFormError(null);

    const r = await fetch("/api/auth/reset/confirm", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
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
  };

  return (
    <div className="form-panel space-y-4 rounded-2xl bg-white/80 px-8 py-12 shadow-lg backdrop-blur-sm transition-colors duration-300 dark:bg-slate-900/80 dark:shadow-black/40">
      <Header
        label="- Recovery"
        title="Reset access"
        subtitle="Enter your email to receive a reset link"
      />

      <div className="mb-6 flex gap-1.5">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-0.5 flex-1 rounded-full transition-colors ${
              step >= s
                ? "bg-blue-600 dark:bg-blue-400"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>

      {step === 1 &&
        (sent ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-700 dark:text-slate-200">
              If an account exists for that email, you’ll receive a password reset
              link shortly.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check your spam/junk folder too.
            </p>
          </div>
        ) : (
          <RegisteredEmail
            form={step1RegisteredForm}
            onNext={handleStep1}
            onBackToLogin={onBackToLogin}
          />
        ))}

      {step === 2 && !success && (
        <>
          <RecoveryNewPassword form={step2NewPasswordForm} onNext={handleStep2} />
          {errorUpdatePasswordForm && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errorUpdatePasswordForm}
            </p>
          )}
        </>
      )}

      {success && <RecoverySuccess goToApp={onBackToLogin} />}
    </div>
  );
}