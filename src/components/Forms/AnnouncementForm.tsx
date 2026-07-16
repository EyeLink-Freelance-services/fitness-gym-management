"use client";

import InputGroup from "../FormElements/InputGroup";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Select } from "../FormElements/select";
import { Button } from "@/components/ui-elements/button";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnnouncementCreateInput,
  AnnouncementCreateSchema,
} from "@/lib/validation/schemas/announcement";
import { Header } from "../FormElements/common";
import type { FormSuccessCallback } from "@/types/forms";
import type { NoticeType } from "@/types/dashboard/notice";
import {
  createNoticeAction,
  updateNoticeAction,
} from "@/app/(app)/dashboard/company/announcement/actions";
import { toast } from "sonner";
import { useEffect } from "react";

const NOTICE_TYPE_OPTIONS = [
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "EVENT", label: "Event" },
];

export type AnnouncementFormInitialData = {
  title: string;
  content?: string;
  noticeType: NoticeType;
  eventDateTime?: string | null;
  expiresAt?: string | null;
};

type Props = {
  mode?: "create" | "edit";
  noticeId?: string;
  initialData?: AnnouncementFormInitialData;
  onSuccess?: FormSuccessCallback;
};

/** Convert datetime-local value to ISO string for the API. */
function toApiDateTime(value?: string) {
  if (!value?.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

/** Convert ISO date-time to datetime-local input value. */
function toDatetimeLocalValue(iso?: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toFormValues(
  data?: AnnouncementFormInitialData,
): AnnouncementCreateInput {
  return {
    title: data?.title ?? "",
    content: data?.content ?? "",
    noticeType: data?.noticeType ?? "ANNOUNCEMENT",
    eventDateTime: toDatetimeLocalValue(data?.eventDateTime),
    expiresAt: data?.expiresAt ?? "",
  };
}

export default function AnnouncementForm({
  mode = "create",
  noticeId,
  initialData,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementCreateInput>({
    mode: "onChange",
    resolver: zodResolver(AnnouncementCreateSchema),
    defaultValues: toFormValues(initialData),
  });

  useEffect(() => {
    reset(toFormValues(initialData));
  }, [initialData, reset]);

  const noticeType = useWatch({ control, name: "noticeType" });
  const isEdit = mode === "edit";

  const onSubmit = async (values: AnnouncementCreateInput) => {
    const payload = {
      title: values.title,
      content: values.content?.trim() || undefined,
      noticeType: values.noticeType,
      eventDateTime:
        values.noticeType === "EVENT"
          ? toApiDateTime(values.eventDateTime)
          : null,
      expiresAt: values.expiresAt?.trim() || null,
    };

    try {
      if (isEdit) {
        if (!noticeId) throw new Error("Missing noticeId for edit mode");
        await updateNoticeAction(noticeId, payload);
        toast.success("Notice updated successfully");
      } else {
        await createNoticeAction(payload);
        toast.success("Notice created successfully");
      }
      await onSuccess?.();
    } catch {
      toast.error(
        isEdit
          ? "Failed to update notice. Please try again."
          : "Failed to create notice. Please try again.",
      );
    }
  };

  return (
    <div className="form-panel space-y-4 bg-white py-10 dark:bg-transparent">
      <Header
        label="- Notices"
        title={isEdit ? "Edit announcement" : "Create announcement"}
        subtitle={
          isEdit
            ? "Update this announcement or event"
            : "Share an announcement or event with your company"
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <InputGroup
          type="text"
          label="Title"
          placeholder="e.g. Gym closure notice"
          required
          inputProps={register("title")}
          error={errors?.title?.message}
        />

        <div>
          <TextAreaGroup
            label="Content"
            placeholder="Write your notice message here..."
            textareaProps={{ ...register("content"), maxLength: 2000 }}
            error={errors?.content?.message}
          />
          {!errors?.content?.message ? (
            <p className="mt-1 text-body-sm text-dark-5 dark:text-dark-6">
              Maximum 2000 characters
            </p>
          ) : null}
        </div>

        <Controller
          name="noticeType"
          control={control}
          render={({ field }) => (
            <Select
              label="Type"
              required
              items={NOTICE_TYPE_OPTIONS}
              placeholder="Select type"
              defaultValue={field.value}
              selectProps={{
                value: field.value,
                onChange: field.onChange,
                onBlur: field.onBlur,
                name: field.name,
                ref: field.ref,
              }}
              error={errors?.noticeType?.message}
            />
          )}
        />

        {noticeType === "EVENT" && (
          <InputGroup
            type="datetime-local"
            label="Event Date & Time"
            placeholder=""
            required
            inputProps={register("eventDateTime")}
            error={errors?.eventDateTime?.message}
          />
        )}

        <InputGroup
          type="date"
          label="Expires At (optional)"
          placeholder=""
          inputProps={register("expiresAt")}
          error={errors?.expiresAt?.message}
        />

        <Button
          type="submit"
          variant="primary"
          label={isEdit ? "Save Changes" : "Create Notice"}
          loadingLabel={isEdit ? "Saving..." : "Creating..."}
          loading={isSubmitting}
          className="w-full"
        />
      </form>
    </div>
  );
}
