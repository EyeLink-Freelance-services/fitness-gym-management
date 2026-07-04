"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import { Header } from "@/components/FormElements/common";
import Label from "@/components/FormElements/common/label";
import { Select } from "@/components/FormElements/select";
import { Button } from "@/components/ui-elements/button";
import type { BookSessionInput } from "@/services/session-scheduling/validation";
import type { SessionClientOption } from "@/types/session-scheduling";
import { useState } from "react";

type SessionFormProps = {
  dateIso: string;
  clientOptions: SessionClientOption[];
  onCancel: () => void;
  onSave: (
    inputs: BookSessionInput[],
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
};

export function SessionForm({
  dateIso,
  clientOptions,
  onCancel,
  onSave,
}: SessionFormProps) {
  const [clientId, setClientId] = useState<string>(clientOptions[0]?.id ?? "");
  const [timeFrom, setTimeFrom] = useState("10:00");
  const [timeTo, setTimeTo] = useState("11:00");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await onSave([
      {
        clientId,
        date: dateIso,
        timeFrom,
        timeTo,
        title,
      },
    ]);

    setSaving(false);

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
        subtitle="Schedule a training session with a client."
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
            type="time"
            label="Time from"
            placeholder="10:00"
            value={timeFrom}
            handleChange={(e) => setTimeFrom(e.target.value)}
            inputProps={{ step: 300 }}
            required
          />
          <InputGroup
            type="time"
            label="Time to"
            placeholder="11:00"
            value={timeTo}
            handleChange={(e) => setTimeTo(e.target.value)}
            inputProps={{ step: 300 }}
            required
          />
        </div>

        <Select
          label={<Label value="Client" required />}
          placeholder={
            clientOptions.length > 0 ? "Select client" : "No clients available"
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
              ? "No clients available for this coach."
              : undefined
          }
        />

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
            loadingLabel="Saving..."
            loading={saving}
            className="w-full sm:w-auto"
            disabled={clientOptions.length === 0}
          />
        </div>
      </form>
    </div>
  );
}
