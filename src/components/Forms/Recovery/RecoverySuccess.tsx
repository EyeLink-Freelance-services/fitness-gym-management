import { Button } from "@/components/ui-elements/button";
import { PasswordRecoverySuccess } from "@/types/forms";

export default function RecoverySuccess({
  goToApp,
}: PasswordRecoverySuccess) {
  return (
    <div className="space-y-4 py-4 text-center">
      <p className="text-lg font-semibold text-dark">Password updated</p>
      <p className="text-body-sm text-dark-5">
        Your password has been changed successfully.
      </p>
      <Button
        type="button"
        label="Get in the application"
        className="w-full"
        onClick={goToApp}
      />
    </div>
  );
}
