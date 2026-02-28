import type { RegisteredEmailConfirmations } from "@/types/forms";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import { validateEmail } from "@/lib/forms/formValidation";

export default function RegisteredEmail({
  form,
  onNext,
  onBackToLogin,
}: RegisteredEmailConfirmations) {
  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
      <InputGroup
        type="email"
        label="Registered Email"
        placeholder="your@email.com"
        required
        error={form.formState.errors.email?.message}
        inputProps={form.register("email", {
          required: "Email is required",
          validate: (v) => validateEmail(v),
        })}
      />

      <Button type="submit" label="Send Reset Link" className="w-full" />

      <div className="mt-4 text-center text-body-sm text-dark-5">
        <Button
          type="button"
          label="← Back to login"
          variant="outlineDark"
          size="small"
          className="w-auto border-0 bg-transparent !px-0 !py-0 text-primary hover:bg-transparent hover:underline"
          onClick={onBackToLogin}
        />
      </div>
    </form>
  );
}
