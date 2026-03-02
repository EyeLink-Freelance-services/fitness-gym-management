import type { RecoveryCodeProps } from "@/types/forms";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import { validateOtpCode } from "@/lib/forms/formValidation";

export default function RecoveryCode({
  form,
  recoverEmail,
  onNext,
  onResend,
}: RecoveryCodeProps) {
  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
      <div className="py-4 text-center">
        <p className="mb-4 text-body-sm text-dark-5">
          Check your inbox. We&apos;ve sent a 6-digit code to{" "}
          <strong className="text-dark">{recoverEmail || "your email"}</strong>
        </p>
      </div>

      <InputGroup
        type="text"
        label="Verification Code"
        placeholder="000000"
        required
        error={form.formState.errors.code?.message}
        inputProps={{
          ...form.register("code", {
            required: "Code is required",
            validate: (v) => validateOtpCode(v, 6),
          }),
          maxLength: 6,
          className: "text-center tracking-[0.25em]",
        }}
      />

      <Button type="submit" label="Verify Code" className="w-full" />

      <div className="mt-4 text-center text-body-sm text-dark-5">
        <Button
          type="button"
          label="Resend code"
          variant="outlineDark"
          size="small"
          className="w-auto border-0 bg-transparent !px-0 !py-0 text-primary hover:bg-transparent hover:underline"
          onClick={onResend}
        />
      </div>
    </form>
  );
}
