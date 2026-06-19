import { DashboardSectionProps } from "@/types/dashboard";

const CardTitle = ({ title, subtitle, className }: DashboardSectionProps) => {
  return (
    <div>
      <h2
        className={`${!subtitle && "mb-4"} ml-1 text-body-2xlg font-bold text-dark dark:text-white ${className}`}
      >
        {title}
      </h2>

      <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">{subtitle}</p>
    </div>
  );
};

export default CardTitle;
