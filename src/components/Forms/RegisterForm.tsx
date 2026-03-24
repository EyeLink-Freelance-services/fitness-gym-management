"use client";

import { useForm } from "react-hook-form";
import Header from "../FormElements/common/header";
import InputGroup from "../FormElements/InputGroup";
import { Button } from "../ui-elements/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { validateEmail } from "@/lib/forms/formValidation";
import { REGISTER_ENDPOINT } from "@/constants/urls";
import { ROUTES } from "@/constants/route";

type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const next = searchParams.get("next") || ROUTES.HOME;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(
        `${REGISTER_ENDPOINT}?next=${encodeURIComponent(next)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.message ?? "Failed to create account");
        return;
      }

      const hasSession =
        json?.data?.session ||
        json?.data?.user?.identities?.length === 0;

      if (!hasSession) {
        setSuccessMsg(
          json.message ??
            "Account created. Please check your email to confirm your account."
        );
        return;
      }

      router.push(next);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message ?? "Failed to create account");
    }
  };

  return (
    <div className="form-panel space-y-4 rounded-2xl bg-white/80 px-8 py-12 shadow-lg backdrop-blur-sm transition-colors duration-300 dark:bg-slate-900/80 dark:shadow-black/40">
      <Header
        label="- Authentication"
        title="Create your account"
        subtitle="Sign up to continue to your onboarding"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <InputGroup
          type="email"
          label="Email Address"
          placeholder="owner@fitzone.com"
          required
          error={errors.email?.message}
          inputProps={register("email", {
            required: "Email is required",
            validate: (v) => validateEmail(v),
          })}
        />

        <InputGroup
          type="password"
          label="Password"
          placeholder="•••••••"
          required
          error={errors.password?.message}
          inputProps={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <InputGroup
          type="password"
          label="Confirm Password"
          placeholder="•••••••"
          required
          error={errors.confirmPassword?.message}
          inputProps={register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
        />

        {errorMsg && (
          <div className="mb-2 text-sm text-red-600 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-2 text-sm text-green-600 dark:text-green-400">
            {successMsg}
          </div>
        )}

        <Button
          type="submit"
          label={isSubmitting ? "Creating account..." : "Sign Up"}
          className="w-full"
        />
      </form>
    </div>
  );
}