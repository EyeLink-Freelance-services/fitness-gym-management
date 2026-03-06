import type { JSX, SVGProps } from "react";

export type SubItem = {
  title: string;
  url: string;
  icon?: React.FC<SVGProps<SVGSVGElement>>;
};

export type NavItem = {
  title: string;
  url?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  items: SubItem[];
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
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};
