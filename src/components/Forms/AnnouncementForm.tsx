"use client";

import InputGroup from "../FormElements/InputGroup";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import Header from "../FormElements/common/header";
import Label from "../FormElements/common/label";
import { Button } from "@/components/ui-elements/button";
import { RadioInput } from "../FormElements/radio";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnnouncementCreateInput,
  AnnouncementCreateSchema,
} from "@/lib/validation/schemas/announcement";
import { useTransition } from "react";
import { SearchableSelect } from "../FormElements/SearchableSelect";
import { COMPANY_ANNOUNCEMENT_FILTERS } from "@/data/company-announcement";
import type { AnnouncementFilters } from "@/types/dashboard/announcement";

type AudienceOption = { value: AnnouncementFilters["audiences"][number]; label: string };

type Props = {
  onSuccess?: () => void;
};

export default function AnnouncementForm({ onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<AnnouncementCreateInput>({
    mode: "onChange",
    resolver: zodResolver(AnnouncementCreateSchema),
    defaultValues: {
      audience: "",
      sendType: "now",
      scheduledDate: null,
    },
  });

  const sendType = watch("sendType");

  const onSubmit = (values: AnnouncementCreateInput) => {
    startTransition(async () => {
      // TODO: Connect to announcement create action when backend is ready
      console.log("Announcement form submitted:", values);
      onSuccess?.();
    });
  };

  return (
    <div className="form-panel space-y-4 bg-white py-10 dark:bg-transparent">
      <Header
        label="- Announcements"
        title="New announcement"
        subtitle="Create and send an announcement to your audience"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Announcement Details
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <InputGroup
          type="text"
          label="Title"
          placeholder="e.g. Gym closure notice"
          required
          inputProps={register("title")}
          error={errors?.title?.message}
        />

        <TextAreaGroup
          label="Message"
          placeholder="Write your announcement message here..."
          required
          textareaProps={register("message")}
          error={errors?.message?.message}
        />

        <Controller
          name="audience"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Audience"
              options={
                COMPANY_ANNOUNCEMENT_FILTERS.audiences.map(
                  (a): AudienceOption => ({ value: a, label: a })
                )
              }
              placeholder="Search audience..."
              required
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors?.audience?.message}
            />
          )}
        />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Delivery
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <div className="mb-5 space-y-2">
          <Label value="When to send" required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RadioInput
              label="Send now"
              name="sendType"
              value="now"
              inputProps={register("sendType")}
              minimal
            />
            <RadioInput
              label="Schedule"
              name="sendType"
              value="schedule"
              inputProps={register("sendType")}
              minimal
            />
          </div>
        </div>

        {sendType === "schedule" && (
          <InputGroup
            type="date"
            label="Scheduled date"
            placeholder="Select date"
            required
            inputProps={{
              ...register("scheduledDate"),
              min: (() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow.toISOString().split("T")[0];
              })(),
            }}
            error={errors?.scheduledDate?.message}
          />
        )}

        <Button
          type="submit"
          disabled={isPending}
          variant="primary"
          label={isPending ? "Submitting..." : "Submit"}
          className="w-full"
        />
      </form>
    </div>
  );
}
