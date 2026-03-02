import type { NewPasswordProps } from "@/types/forms";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import {
  getPasswordStrength,
  validatePassword,
  validatePasswordMatches,
  PASSWORD_MIN_LENGTH,
} from "@/lib/forms/formValidation";

export default function RecoveryNewPassword({
  form,
  onNext,
}: NewPasswordProps) {
  const strength = form.watch("newPassword");
  const strengthScore = strength ? getPasswordStrength(strength) : 0;

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
      <InputGroup
        type="password"
        label="New Password"
        placeholder={`Min. ${PASSWORD_MIN_LENGTH} characters`}
        required
        error={form.formState.errors.newPassword?.message}
        inputProps={form.register("newPassword", {
          required: "New password is required",
          validate: (v) =>
            validatePassword(v, { minLength: PASSWORD_MIN_LENGTH }),
        })}
      />

      <div className="mt-2 flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full bg-stroke transition-colors ${
              i < strengthScore ? "!bg-primary" : ""
            }`}
          />
        ))}
      </div>

      <InputGroup
        type="password"
        label="Confirm Password"
        placeholder="Repeat your new password"
        required
        error={form.formState.errors.confirmPassword?.message}
        inputProps={form.register("confirmPassword", {
          required: "Please confirm your password",
          validate: (v) =>
            validatePasswordMatches(v, form.getValues("newPassword")),
        })}
      />

      <Button type="submit" label="Update Password" className="w-full" />
    </form>
  );
}
