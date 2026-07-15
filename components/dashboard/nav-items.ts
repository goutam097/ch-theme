import {
  LayoutDashboard,
  LayoutTemplate,
  PanelTop,
  Files,
  Eye,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Grouping for the sidebar. */
  group: "Overview" | "Content" | "Publish";
}

/**
 * The STATIC part of the dashboard navigation.
 *
 * Note what's missing: there are no per-section entries (Home, About, Services…)
 * any more. Those were hard-coded back when a site was one fixed page. Pages are
 * now user-created, so the sidebar lists them dynamically from the store — see
 * `Sidebar.tsx`, which renders these items plus one link per page.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate, group: "Overview" },

  { href: "/dashboard/pages", label: "Pages & menu", icon: Files, group: "Content" },
  { href: "/dashboard/header", label: "Header & logo", icon: PanelTop, group: "Content" },

  { href: "/dashboard/preview", label: "Preview", icon: Eye, group: "Publish" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, group: "Publish" },
];

export const NAV_GROUPS: NavItem["group"][] = ["Overview", "Content", "Publish"];
