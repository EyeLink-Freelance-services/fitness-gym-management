import type { AuditableApiBean, GetPageParams } from "./shared";

export type NoticeType = "ANNOUNCEMENT" | "EVENT";

export type NoticeSearchSortField =
  | "TITLE"
  | "NOTICE_TYPE"
  | "EVENT_DATE_TIME"
  | "EXPIRES_AT"
  | "CREATION_DATE";

export interface NoticeRequestApiBean {
  title: string;
  content?: string;
  noticeType: NoticeType;
  eventDateTime?: string | null;
  expiresAt?: string | null;
}

export interface NoticeResponseApiBean {
  id: string;
  companyId?: string;
  postedByUserId?: string;
  title: string;
  content?: string;
  noticeType: NoticeType;
  eventDateTime?: string | null;
  expiresAt?: string | null;
  isRead?: boolean;
  auditData?: AuditableApiBean;
  version?: number;
}

export interface SearchNoticesApiBean {
  notices?: NoticeResponseApiBean[];
  pageSize?: number;
  pageNumber?: number;
  totalElements?: number;
  totalPages?: number;
}

export type SearchNoticesParams = GetPageParams & {
  title?: string;
  noticeType?: NoticeType;
  eventDateTimeFrom?: string;
  eventDateTimeTo?: string;
  expiresAt?: string;
  sort?: NoticeSearchSortField;
  descendingSort?: boolean;
};

export interface NoticeListItem {
  id: string;
  title: string;
  content: string;
  noticeType: NoticeType;
  eventDateTime?: string | null;
  expiresAt?: string | null;
  postedAt?: string | null;
  version?: number;
}
