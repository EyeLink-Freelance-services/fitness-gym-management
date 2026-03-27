"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import { Checkbox } from "@/components/FormElements/checkbox";
import Header from "@/components/FormElements/common/header";
import Label from "@/components/FormElements/common/label";
import { Select } from "@/components/FormElements/select";
import { Button } from "@/components/ui-elements/button";
import { addWeeksToIsoDate } from "@/services/session-scheduling/date-utils";
import type { BookSessionInput } from "@/services/session-scheduling/validation";
import type { SessionClientOption } from "@/types/session-scheduling";
import { useEffect, useState } from "react";

const MAX_WEEKLY_OCCURRENCES = 52;
const DEFAULT_WEEKLY_OCCURRENCES = 8;

type SessionFormProps = {
  dateIso: string;
  coachId: string;
  clientOptions: SessionClientOption[];
  onCancel: () => void;
  onSave: (
    inputs: BookSessionInput[],
  ) => { ok: true } | { ok: false; error: string };
};

export function SessionForm({
  dateIso,
  coachId,
  clientOptions,
  onCancel,
  onSave,
}: SessionFormProps) {
  const [assignment, setAssignment] = useState<"general" | "client">(
    clientOptions.length > 0 ? "client" : "general",
  );
  const [clientId, setClientId] = useState<string>(clientOptions[0]?.id ?? "");
  const [time, setTime] = useState("10:00");
  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [weeklyOccurrences, setWeeklyOccurrences] = useState(
    String(DEFAULT_WEEKLY_OCCURRENCES),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setTime("10:00");
    setTitle("");
    setDurationMinutes("60");
    setRepeatWeekly(false);
    setWeeklyOccurrences(String(DEFAULT_WEEKLY_OCCURRENCES));
    setAssignment(clientOptions.length > 0 ? "client" : "general");
    setClientId(clientOptions[0]?.id ?? "");
  }, [clientOptions, dateIso]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const base: Omit<BookSessionInput, "date"> = {
      coachId,
      clientId: assignment === "general" ? null : clientId,
      time,
      title,
      durationMinutes: Number(durationMinutes),
    };

    const safeWeeks = Number.isFinite(Number(weeklyOccurrences))
      ? Math.round(Number(weeklyOccurrences))
      : DEFAULT_WEEKLY_OCCURRENCES;
    const count = repeatWeekly
      ? Math.min(MAX_WEEKLY_OCCURRENCES, Math.max(2, safeWeeks))
      : 1;

    const inputs: BookSessionInput[] = [];
    for (let w = 0; w < count; w++) {
      inputs.push({
        ...base,
        date: addWeeksToIsoDate(dateIso, w),
      });
    }

    const result = onSave(inputs);
    if (result.ok) {
      onCancel();
      return;
    }
    setError(result.error);
  };

  return (
    <div className="form-panel space-y-4 rounded-[10px] bg-white px-6 py-7 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <Header
        label="- Sessions"
        title="Create session"
        subtitle="Use the same scheduling form pattern as the other dashboard forms."
      />

      <form onSubmit={submit} className="space-y-7">
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Session Details
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <InputGroup
          type="text"
          label="Date"
          placeholder="Session date"
          value={dateIso}
          inputProps={{ readOnly: true }}
        />

        <InputGroup
          type="text"
          label="Session title"
          placeholder="e.g. Lower body & mobility"
          value={title}
          handleChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="number"
            label="Duration (minutes)"
            placeholder="60"
            value={durationMinutes}
            handleChange={(e) => setDurationMinutes(e.target.value)}
            inputProps={{ min: 5, max: 720, step: 5 }}
            required
          />
          <InputGroup
            type="time"
            label="Time"
            placeholder="10:00"
            value={time}
            handleChange={(e) => setTime(e.target.value)}
            inputProps={{ step: 300 }}
            required
          />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Repeat
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <Checkbox
          label="Repeat weekly"
          minimal
          inputProps={{
            checked: repeatWeekly,
            onChange: (e) => setRepeatWeekly(e.target.checked),
          }}
        />

        {repeatWeekly && (
          <InputGroup
            type="number"
            label="Number of weeks"
            placeholder="8"
            value={weeklyOccurrences}
            handleChange={(e) => setWeeklyOccurrences(e.target.value)}
            inputProps={{ min: 2, max: MAX_WEEKLY_OCCURRENCES }}
            required
          />
        )}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Assignment
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <Select
          label={<Label value="Session type" required />}
          placeholder="Select session type"
          items={[
            { value: "client", label: "Specific client" },
            { value: "general", label: "General (open)" },
          ]}
          selectProps={{
            value: assignment,
            onChange: (e) =>
              setAssignment(e.target.value as "general" | "client"),
          }}
        />

        {assignment === "client" && (
          <Select
            label={<Label value="Client" required />}
            placeholder={
              clientOptions.length > 0
                ? "Select client"
                : "No client options available"
            }
            items={clientOptions.map((client) => ({
              value: client.id,
              label: client.label,
            }))}
            selectProps={{
              value: clientId,
              onChange: (e) => setClientId(e.target.value),
              disabled: clientOptions.length === 0,
            }}
            error={
              clientOptions.length === 0
                ? "No client options provided yet. Only general sessions can be created."
                : undefined
            }
          />
        )}

        {error && (
          <p className="rounded-lg bg-red/10 px-3 py-2 text-sm text-red dark:text-red-200">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            label="Cancel"
            variant="outlineDark"
            onClick={onCancel}
            className="w-full sm:w-auto"
          />
          <Button
            type="submit"
            label="Save session"
            className="w-full sm:w-auto"
          />
        </div>
      </form>
    </div>
  );
}
