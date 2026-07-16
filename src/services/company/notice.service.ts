import {
  backendDelete,
  backendGet,
  backendPost,
  backendPut,
} from "@/lib/api/backend-client";
import type {
  NoticeListItem,
  NoticeRequestApiBean,
  NoticeResponseApiBean,
  SearchNoticesApiBean,
  SearchNoticesParams,
} from "@/types/dashboard/notice";

const COMPANY_API_BASE = "/api/companies";

async function requireCompanyId(): Promise<string> {
  const { getAuthContext } = await import("@/lib/auth/get-auth-context");
  const auth = await getAuthContext();
  const companyId = auth?.companyId;

  if (!companyId) {
    throw new Error(
      "No active company in session (missing businessId/companyId).",
    );
  }

  return companyId;
}

function noticesBase(companyId: string) {
  return `${COMPANY_API_BASE}/${companyId}/notices`;
}

function mapNoticeToListItem(notice: NoticeResponseApiBean): NoticeListItem {
  return {
    id: notice.id,
    title: notice.title,
    content: notice.content ?? "",
    noticeType: notice.noticeType,
    eventDateTime: notice.eventDateTime,
    expiresAt: notice.expiresAt,
    postedAt: notice.auditData?.createdDate ?? null,
    version: notice.version,
  };
}

export async function searchNotices({
  pageNumber = 0,
  pageSize = 10,
  title,
  noticeType,
  eventDateTimeFrom,
  eventDateTimeTo,
  expiresAt,
  sort = "CREATION_DATE",
  descendingSort = true,
}: SearchNoticesParams = {}) {
  const companyId = await requireCompanyId();
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
    descendingSort: String(descendingSort),
    sort,
  });

  if (title?.trim()) params.set("title", title.trim());
  if (noticeType) params.set("noticeType", noticeType);
  if (eventDateTimeFrom) params.set("eventDateTimeFrom", eventDateTimeFrom);
  if (eventDateTimeTo) params.set("eventDateTimeTo", eventDateTimeTo);
  if (expiresAt) params.set("expiresAt", expiresAt);

  const data = await backendGet<SearchNoticesApiBean>(
    `${noticesBase(companyId)}?${params.toString()}`,
  );

  const notices = data.notices ?? [];

  return {
    notices: notices.map(mapNoticeToListItem),
    totalCount: data.totalElements ?? notices.length,
    pageNumber: data.pageNumber ?? pageNumber,
    totalPages: data.totalPages ?? 1,
  };
}

export async function getRecentNotices(limit = 5) {
  const { notices } = await searchNotices({ pageSize: limit, pageNumber: 0 });
  return notices;
}

export async function getNoticeById(
  noticeId: string,
): Promise<NoticeListItem | null> {
  try {
    const companyId = await requireCompanyId();
    const data = await backendGet<NoticeResponseApiBean>(
      `${noticesBase(companyId)}/${noticeId}`,
    );
    return mapNoticeToListItem(data);
  } catch {
    return null;
  }
}

export async function createNotice(body: NoticeRequestApiBean) {
  const companyId = await requireCompanyId();
  return backendPost(`${noticesBase(companyId)}`, body);
}

export async function updateNotice(
  noticeId: string,
  body: NoticeRequestApiBean,
) {
  const companyId = await requireCompanyId();
  return backendPut(`${noticesBase(companyId)}/${noticeId}`, body);
}

export async function deleteNotice(noticeId: string) {
  const companyId = await requireCompanyId();
  await backendDelete(`${noticesBase(companyId)}/${noticeId}`);
}
