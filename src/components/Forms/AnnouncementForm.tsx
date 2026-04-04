"use client";

import InputGroup from "../FormElements/InputGroup";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import Header from "../FormElements/common/header";
import { Button } from "@/components/ui-elements/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnnouncementCreateInput,
  AnnouncementCreateSchema,
} from "@/lib/validation/schemas/announcement";
import { useTransition } from "react";

type Props = {
  onSuccess?: () => void;
};

export default function AnnouncementForm({ onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementCreateInput>({
    mode: "onChange",
    resolver: zodResolver(AnnouncementCreateSchema),
    defaultValues: {
      title: "",
      message: "",
    },
  });

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
        subtitle="Create and send an announcement to everyone"
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

        {/* Audience targeting is intentionally disabled for now.
            New announcements target everyone until segmented delivery is re-enabled. */}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Delivery
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <div className="rounded-xl border border-stroke bg-gray-1 px-4 py-3 text-sm text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
          Announcements are sent immediately in the current dashboard flow.
        </div>

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
