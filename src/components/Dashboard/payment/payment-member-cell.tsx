import { cn } from "@/lib/utils";
import type { PaymentMemberCellProps, PaymentMemberSummary } from "@/types/dashboard/payment";

const avatarToneClasses: Record<PaymentMemberSummary["avatarTone"], string> = {
  emerald: "bg-green/15 text-green",
  rose: "bg-red/15 text-red",
  amber: "bg-[#FFA70B]/10 text-[#FFA70B]",
  violet: "bg-[#8155FF]/10 text-[#8155FF]",
  sky: "bg-[#0ABEF9]/10 text-[#0ABEF9]",
};

export function PaymentMemberCell({ member }: PaymentMemberCellProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "grid size-10 place-items-center rounded-full text-xs font-semibold",
          avatarToneClasses[member.avatarTone],
        )}
      >
        {member.initials}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-dark dark:text-white">
          {member.name}
        </p>
        <p className="truncate text-xs text-dark-6 dark:text-dark-6">
          {member.email}
        </p>
      </div>
    </div>
  );
}
