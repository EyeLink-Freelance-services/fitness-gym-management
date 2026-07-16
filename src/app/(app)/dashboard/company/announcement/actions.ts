"use server";

import {
  createNotice,
  deleteNotice,
  getRecentNotices,
  searchNotices,
  updateNotice,
} from "@/services/company/notice.service";
import type {
  NoticeRequestApiBean,
  SearchNoticesParams,
} from "@/types/dashboard/notice";
import { revalidatePath } from "next/cache";

function revalidateNoticePaths() {
  revalidatePath("/dashboard/company/announcement");
  revalidatePath("/dashboard/company/notices");
  revalidatePath("/dashboard/company");
}

export async function createNoticeAction(data: NoticeRequestApiBean) {
  const result = await createNotice(data);
  revalidateNoticePaths();
  return result;
}

export async function updateNoticeAction(
  noticeId: string,
  data: NoticeRequestApiBean,
) {
  const result = await updateNotice(noticeId, data);
  revalidateNoticePaths();
  return result;
}

export async function deleteNoticeAction(noticeId: string) {
  await deleteNotice(noticeId);
  revalidateNoticePaths();
}

export async function fetchNoticesPage(params: SearchNoticesParams = {}) {
  return searchNotices(params);
}

export async function fetchRecentNoticesAction(limit = 5) {
  return getRecentNotices(limit);
}
