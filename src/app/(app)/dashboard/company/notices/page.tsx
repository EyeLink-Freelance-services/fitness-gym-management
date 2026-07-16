import { AnnouncementList } from "@/components/Dashboard/announcement/announcement-list";
import { searchNotices } from "@/services/company/notice.service";
import { mapNoticeToCardItem } from "@/types/dashboard/announcement";

export default async function CompanyNoticesPage() {
  const { notices } = await searchNotices({ pageNumber: 0, pageSize: 50 });
  const announcements = notices.map(mapNoticeToCardItem);

  return (
    <div>
      <AnnouncementList announcements={announcements} showCreate={false} />
    </div>
  );
}
