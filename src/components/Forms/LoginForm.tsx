"use client";

import { useForm } from "react-hook-form";
import type { LoginFormData, LoginFormProps } from "@/types/forms";
import { Button } from "../ui-elements/button";
import InputGroup from "../FormElements/InputGroup";
import { validateEmail } from "@/lib/forms/formValidation";
import Header from "../FormElements/common/header";
import { useState } from "react";
import { LOGIN_ENDPOINT } from "@/constants/urls";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    console.log(data, "data");
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
        router.push(ROUTES.HOME);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="form-panel space-y-4 bg-white/80 px-8 py-12 shadow-lg backdrop-blur-sm dark:bg-dark-2">
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
          <div className="mb-2 text-sm text-red-600">{errorMsg}</div>
        )}

        <div className="-mt-2 text-right">
          <Button
            type="button"
            label="Forgot password?"
            variant="outlineDark"
            size="small"
            className="w-auto border-0 bg-transparent !px-0 !py-0 text-primary hover:bg-transparent hover:underline"
            onClick={onForgotPassword}
          />
        </div>

        <Button type="submit" label="Sign In" className="w-full" />
      </form>
    </div>
  );
}
