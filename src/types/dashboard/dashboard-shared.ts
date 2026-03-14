import type { JSX, SVGProps } from "react";

export type SubItem = {
  title: string;
  url: string;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  permission?: string;
};

export type NavItem = {
  title: string;
  url?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  items: SubItem[];
  permission?: string;
};
export type NavSection = { label: string; items: NavItem[] };

export type SearchType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export type OverviewCardProps = {
  label: string;
  data: {
    value: number | string;
    growthRate: number;
  };
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

export type DashboardSectionProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  buttonLabel?: string;
  buttonPath?: string;
  buttonToast?: string;
  children?: React.ReactNode;
};
