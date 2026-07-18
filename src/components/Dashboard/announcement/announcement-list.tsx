"use client";

import { FormModalShell } from "@/components/Dashboard/form-modal-shell";
import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import AnnouncementForm from "@/components/Forms/AnnouncementForm";
import { deleteNoticeAction } from "@/app/(app)/dashboard/company/announcement/actions";
import { useMounted } from "@/hooks/use-mounted";
import type {
  AnnouncementCardItem,
  AnnouncementListProps,
} from "@/types/dashboard/announcement";
import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnnouncementCard } from "./announcement-card";
import { Button } from "@/components/ui-elements/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

export function AnnouncementList({
  announcements,
  showCreate = true,
  showEdit = false,
  showDelete = false,
}: AnnouncementListProps) {
  const router = useRouter();
  const mounted = useMounted();
  const titleId = useId();
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingNotice, setEditingNotice] =
    useState<AnnouncementCardItem | null>(null);

  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE) || 1;
  const paginatedAnnouncements = useMemo(
    () =>
      announcements.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [announcements, currentPage],
  );

  useEffect(() => {
    if (!editingNotice) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditingNotice(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [editingNotice]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this notice? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteNoticeAction(id);
      toast.success("Notice deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete notice. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = async () => {
    setEditingNotice(null);
    router.refresh();
  };

  return (
    <section className="mb-8 rounded-[10px] bg-white px-7.5 py-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Announcement
          </h2>
          <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
            Company announcements and events.
          </p>
        </div>

        {showCreate ? (
          <div className="flex items-center gap-3">
            <FormModalTrigger
              buttonLabel="+ New Notice"
              formType="announcement"
              size="small"
              onSuccess={async () => {
                router.refresh();
              }}
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          <>
            {paginatedAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onEdit={showEdit ? setEditingNotice : undefined}
                onDelete={showDelete ? handleDelete : undefined}
                isDeleting={deletingId === announcement.id}
              />
            ))}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-stroke pt-4 dark:border-dark-3">
                <Button
                  label="Previous"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="transition disabled:cursor-not-allowed disabled:opacity-50"
                />

                <span className="text-sm text-dark-6 dark:text-dark-6">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  label="Next"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="transition disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[14px] border border-dashed border-stroke px-6 py-10 text-center text-sm text-dark-6 dark:border-dark-3 dark:text-dark-6">
            No notices yet.
          </div>
        )}
      </div>

      {editingNotice &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setEditingNotice(null);
            }}
          >
            <FormModalShell onClose={() => setEditingNotice(null)}>
              <AnnouncementForm
                mode="edit"
                noticeId={editingNotice.id}
                initialData={{
                  title: editingNotice.title,
                  content: editingNotice.description,
                  noticeType: editingNotice.noticeType,
                  eventDateTime: editingNotice.eventDateTime,
                  expiresAt: editingNotice.expiresAt,
                }}
                onSuccess={handleEditSuccess}
              />
            </FormModalShell>
          </div>,
          document.body,
        )}
    </section>
  );
}
