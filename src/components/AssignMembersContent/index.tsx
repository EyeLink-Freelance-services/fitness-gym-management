"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/FormElements/Input/input";
import { Button } from "@/components/ui-elements/button";
import DatePickerField from "../FormElements/DatePicker/DatePickerField";
import { Member } from "@/types/member";
import { getMembersForPlanAssignmentAction } from "@/app/(app)/members/actions";
import { AssignmentType } from "@/lib/db/queries/assign-members-coach";

type AssignableMember = Member & {
  isAlreadyAssigned?: boolean;
  assignedAt?: string | null;
};

type Props = {
  onClose: () => void;
  type: AssignmentType;
  assignedCoachId: string;
  companyId: string;
  planId: string;
  onAssign?: (payload: {
    memberIds: string[];
    startDate: string;
  }) => Promise<void>;
};

function getTodayYmd() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(date?: string | null) {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(parsed);
}

export default function AssignMembersContent({
  onAssign,
  type,
  companyId,
  assignedCoachId,
  planId,
  onClose,
}: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [members, setMembers] = useState<AssignableMember[]>([]);
  const [startDate, setStartDate] = useState<string>(getTodayYmd());
  const [showAvailable, setShowAvailable] = useState(true);
  const [showAssigned, setShowAssigned] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchMembers() {
      try {
        setLoadingMembers(true);

        const res = await getMembersForPlanAssignmentAction(type,
          assignedCoachId,
          companyId,
          planId,
          search.trim() || undefined
        );

        if (ignore) return;

        if (res.ok) {
          console.log(res.data)
          setMembers((res.data ?? []) as AssignableMember[]);
        } else {
          setMembers([]);
        }
      } finally {
        if (!ignore) {
          setLoadingMembers(false);
        }
      }
    }

    fetchMembers();

    return () => {
      ignore = true;
    };
  }, [search, assignedCoachId, companyId]);

  const availableMembers = useMemo(
    () => members.filter((member) => !member.isAlreadyAssigned),
    [members]
  );

  const alreadyAssignedMembers = useMemo(
    () => members.filter((member) => member.isAlreadyAssigned),
    [members]
  );

  function toggleMember(id: string) {
    const member = members.find((m) => m.id === id);

    if (!member || member.isAlreadyAssigned) return;

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
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

  function renderMemberCard(member: AssignableMember, disabled = false) {
    const isSelected = selected.includes(member.id);
    const fullName =
      `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() ||
      "Unnamed member";

    return (
      <div
        key={member.id}
        onClick={() => !disabled && toggleMember(member.id)}
        className={`rounded-2xl border p-4 transition ${
          disabled
            ? "cursor-not-allowed border-stroke/70 bg-gray-50 opacity-80 dark:border-dark-3 dark:bg-dark-2"
            : isSelected
            ? "cursor-pointer border-primary bg-primary/5"
            : "cursor-pointer border-stroke bg-white hover:border-primary/40 dark:border-dark-3 dark:bg-dark dark:hover:border-primary/40"
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

            {disabled && (
              <p className="mt-1 text-xs font-medium text-primary">
                Already assigned
                {member.assignedAt ? ` • ${formatDate(member.assignedAt)}` : ""}
              </p>
            )}
          </div>

          {disabled ? (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
              Assigned
            </span>
          ) : (
            <div
              className={`h-5 w-5 rounded-md border ${
                isSelected
                  ? "border-primary bg-primary"
                  : "border-stroke dark:border-dark-3"
              }`}
            />
          )}
        </div>
      </div>
    );
  }

  return (
  <div className="flex h-full min-h-0 flex-col gap-4">
    <DatePickerField
      label="Start date"
      placeholder="Select assignment date"
      value={startDate}
      onChange={setStartDate}
      minDate={getTodayYmd()}
    />

    <div className="shrink-0 rounded-2xl border border-stroke/70 bg-white/70 p-3 dark:border-dark-3 dark:bg-dark">
      <Input
        placeholder="Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <div className="min-h-0 flex-1 overflow-y-auto pr-1 custom-scrollbar">
      <div className="space-y-4 pb-24">
        {loadingMembers ? (
          <div className="rounded-2xl border border-dashed border-stroke p-6 text-center text-sm text-dark-5 dark:border-dark-3 dark:text-dark-6">
            Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stroke p-6 text-center text-sm text-dark-5 dark:border-dark-3 dark:text-dark-6">
            No members found
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-stroke dark:border-dark-3">
              <button
                type="button"
                onClick={() => setShowAvailable((prev) => !prev)}
                className="flex w-full items-center justify-between bg-white px-4 py-3 text-left dark:bg-dark"
              >
                <div>
                  <h3 className="text-sm font-semibold text-dark dark:text-white">
                    Available members
                  </h3>
                  <p className="text-xs text-dark-5 dark:text-dark-6">
                    {availableMembers.length} member
                    {availableMembers.length > 1 ? "s" : ""}
                  </p>
                </div>

                <span className="text-lg text-dark dark:text-white">
                  {showAvailable ? "−" : "+"}
                </span>
              </button>

              {showAvailable && (
                <div className="space-y-2 border-t border-stroke bg-gray-1 p-3 dark:border-dark-3 dark:bg-dark-2">
                  {availableMembers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-stroke p-4 text-center text-sm text-dark-5 dark:border-dark-3 dark:text-dark-6">
                      No available members
                    </div>
                  ) : (
                    availableMembers.map((member) => renderMemberCard(member))
                  )}
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-stroke dark:border-dark-3">
              <button
                type="button"
                onClick={() => setShowAssigned((prev) => !prev)}
                className="flex w-full items-center justify-between bg-white px-4 py-3 text-left dark:bg-dark"
              >
                <div>
                  <h3 className="text-sm font-semibold text-dark dark:text-white">
                    Already assigned
                  </h3>
                  <p className="text-xs text-dark-5 dark:text-dark-6">
                    {alreadyAssignedMembers.length} member
                    {alreadyAssignedMembers.length > 1 ? "s" : ""}
                  </p>
                </div>

                <span className="text-lg text-dark dark:text-white">
                  {showAssigned ? "−" : "+"}
                </span>
              </button>

              {showAssigned && (
                <div className="space-y-2 border-t border-stroke bg-gray-1 p-3 dark:border-dark-3 dark:bg-dark-2">
                  {alreadyAssignedMembers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-stroke p-4 text-center text-sm text-dark-5 dark:border-dark-3 dark:text-dark-6">
                      No assigned members
                    </div>
                  ) : (
                    alreadyAssignedMembers.map((member) =>
                      renderMemberCard(member, true)
                    )
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>

    <div className="sticky bottom-0 z-20 -mx-5 mt-2 border-t border-stroke/70 bg-white px-5 py-4 dark:border-dark-3 dark:bg-dark-2">
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="danger"
          label="Cancel"
          onClick={onClose}
        />

        <Button
          type="button"
          label={loading ? "Assigning..." : `Assign (${selected.length})`}
          disabled={selected.length === 0 || loading}
          onClick={handleAssign}
        />
      </div>
    </div>
  </div>
);
}