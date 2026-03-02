"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type {
  RecoveryStep1FormData,
  RecoveryStep2FormData,
  RecoveryStep3FormData,
  RecoveryFormProps,
} from "@/types/forms";
import Header from "../FormElements/common/header";
import RecoveryCode from "./Recovery/RecoveryCode";
import RecoveryNewPassword from "./Recovery/RecoveryNewPassword";
import RecoverySuccess from "./Recovery/RecoverySuccess";
import RegisteredEmail from "./Recovery/RegisteredEmail";

export default function RecoveryForm({ onBackToLogin }: RecoveryFormProps) {
  const [step, setStep] = useState(1);
  const [recoverEmail, setRecoverEmail] = useState("");

  const step1Form = useForm<RecoveryStep1FormData>();
  const step2Form = useForm<RecoveryStep2FormData>();
  const step3Form = useForm<RecoveryStep3FormData>();

  const handleStep1 = (data: RecoveryStep1FormData) => {
    setRecoverEmail(data.email);
    setStep(2);
  };

  const handleStep2 = () => setStep(3);
  const handleStep3 = () => setStep(4);

  return (
    <div className="form-panel space-y-4 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
      <Header
        label="- Recovery"
        title="Reset access"
        subtitle="Enter your email to receive a reset link"
      />

      <div className="mb-6 flex gap-1.5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-0.5 flex-1 rounded-full bg-stroke transition-colors ${
              step >= s ? "bg-blue-600" : ""
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <RegisteredEmail
          form={step1Form}
          onNext={handleStep1}
          onBackToLogin={onBackToLogin}
        />
      )}

      {step === 2 && (
        <RecoveryCode
          form={step2Form}
          recoverEmail={recoverEmail}
          onNext={handleStep2}
          onResend={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <RecoveryNewPassword form={step3Form} onNext={handleStep3} />
      )}

      {step === 4 && <RecoverySuccess onBackToLogin={onBackToLogin} />}
    </div>
  );
}
