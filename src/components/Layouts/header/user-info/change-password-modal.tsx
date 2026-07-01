"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { changePasswordAction } from "@/app/actions/change-password-actions";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import { Modal } from "@/components/ui/modal";
import {
  getPasswordStrength,
  validatePassword,
  validatePasswordMatches,
} from "@/lib/forms/formValidation";
import type { ChangePasswordFormData } from "@/types/forms";

const NEW_PASSWORD_MIN_LENGTH = 8;

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = form.watch("newPassword");
  const strengthScore = newPassword ? getPasswordStrength(newPassword) : 0;

  useEffect(() => {
    if (!open) return;

    setError(null);
    form.reset();
  }, [open, form]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const onSubmit = async (values: ChangePasswordFormData) => {
    setError(null);
    setIsSubmitting(true);

    const result = await changePasswordAction({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    toast.success("Password updated successfully.");
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Reset password"
      description="Enter your current password, then choose a new one."
      onClose={handleClose}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup
          type="password"
          label="Current password"
          placeholder="Enter your current password"
          required
          error={form.formState.errors.currentPassword?.message}
          inputProps={form.register("currentPassword", {
            required: "Current password is required",
          })}
        />

        <InputGroup
          type="password"
          label="New password"
          placeholder={`Min. ${NEW_PASSWORD_MIN_LENGTH} characters`}
          required
          error={form.formState.errors.newPassword?.message}
          inputProps={form.register("newPassword", {
            required: "New password is required",
            validate: (value) =>
              validatePassword(value, { minLength: NEW_PASSWORD_MIN_LENGTH }),
          })}
        />

        <div className="mt-2 flex gap-1">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-0.5 flex-1 rounded-full bg-stroke transition-colors ${
                index < strengthScore ? "!bg-primary" : ""
              }`}
            />
          ))}
        </div>

        <InputGroup
          type="password"
          label="Confirm new password"
          placeholder="Repeat your new password"
          required
          error={form.formState.errors.confirmPassword?.message}
          inputProps={form.register("confirmPassword", {
            required: "Please confirm your new password",
            validate: (value) =>
              validatePasswordMatches(value, form.getValues("newPassword")),
          })}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            label="Cancel"
            variant="outlineDark"
            size="small"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            label={isSubmitting ? "Updating..." : "Update password"}
            size="small"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  );
}
