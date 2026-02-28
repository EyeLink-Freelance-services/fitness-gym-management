"use client";

import { useForm } from "react-hook-form";
import type { LoginFormData, LoginFormProps } from "@/types/forms";
import { Button } from "../ui-elements/button";
import InputGroup from "../FormElements/InputGroup";
import { GoogleIcon } from "@/assets/icons";
import { validateEmail } from "@/lib/forms/formValidation";
import Header from "../FormElements/common/header";

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <div className="form-panel space-y-4 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
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

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-stroke" />
          <span className="text-body-xs text-dark-5">or continue with</span>
          <span className="h-px flex-1 bg-stroke" />
        </div>

        <Button
          type="button"
          label="Continue with Google"
          variant="outlineDark"
          className="w-full"
          icon={<GoogleIcon width={18} height={18} className="shrink-0" />}
        />
      </form>
    </div>
  );
}
