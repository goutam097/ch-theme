import {
  LayoutDashboard,
  LayoutTemplate,
  Home,
  User,
  Briefcase,
  Images,
  Phone,
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
 * The shared dashboard navigation. Note the content items map to the five
 * sections of the master model — users edit content, never structure, so there
 * is no "add section" or "choose variant" entry anywhere.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate, group: "Overview" },

  { href: "/dashboard/header", label: "Header", icon: Home, group: "Content" },
  { href: "/dashboard/home", label: "Home", icon: Home, group: "Content" },
  { href: "/dashboard/about", label: "About", icon: User, group: "Content" },
  { href: "/dashboard/services", label: "Services", icon: Briefcase, group: "Content" },
  { href: "/dashboard/gallery", label: "Gallery", icon: Images, group: "Content" },
  { href: "/dashboard/contact", label: "Contact", icon: Phone, group: "Content" },

  { href: "/dashboard/preview", label: "Preview", icon: Eye, group: "Publish" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, group: "Publish" },
];

export const NAV_GROUPS: NavItem["group"][] = ["Overview", "Content", "Publish"];
