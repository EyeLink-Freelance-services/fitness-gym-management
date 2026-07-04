import { FormHeader } from "@/types/forms";

export const Header = ({ label, title, subtitle }: FormHeader) => {
  return (
    <div className="panel-header">
      <p className="panel-label">{label}</p>
      <h2 className="panel-title">{title}</h2>
      <p className="panel-sub">{subtitle}</p>
    </div>
  );
};

export const HeaderTitle = ({ title }: { title: string }) => {
  return (
    <div className="my-4 flex items-center gap-2 sm:my-6 sm:gap-3">
      <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
      <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6 sm:text-body-xs">
        {title}
      </span>
      <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
    </div>
  );
};
