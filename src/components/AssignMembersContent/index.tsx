"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/FormElements/Input/input";
import { Button } from "@/components/ui-elements/button";
import DatePickerField from "../FormElements/DatePicker/DatePickerField";
import { getMembersByAssignCoachId } from "@/app/(app)/members/actions";
import { MemberCreateInput } from "@/lib/validation/schemas/member";
import { Member } from "@/types/member";

type Props = {
  onClose: () => void;
  assignedCoachId: string;
  companyId: string;
  onAssign?: (payload: { memberIds: string[]; startDate: string }) => Promise<void>;
}

function getTodayYmd() {
  return new Date().toISOString().split("T")[0];
}

export default function AssignMembersContent({onAssign, companyId, assignedCoachId, onClose}: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [startDate, setStartDate] = useState<string>(getTodayYmd());

  useEffect(() => {
    let ignore = false;

    async function fetchMembers() {
      setLoadingMembers(true);

      const res = await getMembersByAssignCoachId(
        assignedCoachId,
        companyId,
        search.trim() || undefined
      );

      if (ignore) return;

      if (res.ok) {
        setMembers(res.data ?? []);
      } else {
        setMembers([]);
      }

      setLoadingMembers(false);
    }

    fetchMembers();

    return () => {
      ignore = true;
    };
  }, [search]);

  function toggleMember(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  }

  async function handleAssign() {
    if (!startDate || selected.length === 0 || !onAssign) return;

    try {
      setLoading(true);
      await onAssign({
        memberIds: selected,
        startDate,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <DatePickerField
        label="Start date"
        placeholder="Select assignment date"
        value={startDate}
        onChange={setStartDate}
        minDate={getTodayYmd()}
      />
    
      <div className="rounded-2xl border border-stroke/70 bg-white/70 p-3 dark:border-dark-3 dark:bg-dark">
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
        {loadingMembers ? (
          <div className="rounded-2xl border border-dashed border-stroke p-6 text-center text-sm text-dark-5 dark:border-dark-3 dark:text-dark-6">
            Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stroke p-6 text-center text-sm text-dark-5 dark:border-dark-3 dark:text-dark-6">
            No members found
          </div>
        ) : (
          members.map((member) => {
            const isSelected = selected.includes(member.id);
            const fullName =
              `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() ||
              "Unnamed member";

            return (
              <div
                key={member.id}
                onClick={() => toggleMember(member.id)}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-stroke bg-white hover:border-primary/40 dark:border-dark-3 dark:bg-dark dark:hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-dark dark:text-white">
                      {fullName}
                    </p>
                    <p className="truncate text-xs text-dark-5 dark:text-dark-6">
                      {member.email || "No email"}
                    </p>
                  </div>

                  <div
                    className={`h-5 w-5 rounded-md border ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-stroke dark:border-dark-3"
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="danger"
          label="Cancel"
          onClick={onClose}
        />

        <Button
          type="button"
          label={loading ? "Assigning..." : `Assign (${selected.length})`}
          disabled={selected.length === 0}
          onClick={handleAssign}
        />
      </div>
    </div>
  );
}