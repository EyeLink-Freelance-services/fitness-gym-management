"use client";

import { useForm } from "react-hook-form";
import type { LoginFormData, LoginFormProps } from "@/types/forms";
import { Button } from "../ui-elements/button";
import InputGroup from "../FormElements/InputGroup";
import Header from "../FormElements/common/header";
import { useState } from "react";
import { LOGIN_ENDPOINT } from "@/constants/urls";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { validateEmail } from "@/lib/forms/formValidation";

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || ROUTES.HOME;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);

    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.message);
      } else {
        router.push(next);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="form-panel space-y-4 rounded-2xl bg-white/80 px-8 py-12 shadow-lg backdrop-blur-sm transition-colors duration-300 dark:bg-slate-900/80 dark:shadow-black/40">
      <Header
        label="- Authentication"
        title="Welcome back"
        subtitle="Sign in to your gym management dashboard"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <InputGroup
          type="email"
          label="Email Address"
          placeholder="coach@apexgym.com"
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
          })}
        />

        {errorMsg && (
          <div className="mb-2 text-sm text-red-600 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        <div className="-mt-2 text-right">
          <Button
            type="button"
            label="Forgot password?"
            variant="outlineDark"
            size="small"
            className="w-auto border-0 bg-transparent !px-0 !py-0 text-primary hover:bg-transparent hover:underline dark:text-blue-400"
            onClick={onForgotPassword}
          />
        </div>

        <Button type="submit" label="Sign In" className="w-full" />
      </form>
    </div>
  );
}