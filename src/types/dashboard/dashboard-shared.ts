import type { JSX, SVGProps } from "react";

export type SubItem = {
  title: string;
  url: string;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  permission?: string;
  disabled?: boolean;
};

export type NavItem = {
  title: string;
  url?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  items: SubItem[];
  permission?: string;
  disabled?: boolean;
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
    growthRate?: number;
    arrow?: "up" | "down";
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
