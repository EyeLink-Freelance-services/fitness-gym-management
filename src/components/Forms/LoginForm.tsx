"use client";

import { useForm } from "react-hook-form";
import type { LoginFormData, LoginFormProps } from "@/types/forms";
import { Button } from "../ui-elements/button";
import InputGroup from "../FormElements/InputGroup";
import Header from "../FormElements/common/header";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { redirectToRoleDashboard } = useRoleRedirect();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        contextType: data.contextType ?? "",
        businessId: data.businessId ?? "",
        redirect: false,
      });

      if (result?.error) {
        setErrorMsg(result.error);
        return;
      }

      await redirectToRoleDashboard();
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
          type="text"
          label="Username"
          placeholder="coach@apexgym.com"
          required
          error={errors.username?.message}
          inputProps={register("username", {
            required: "Username is required",
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
