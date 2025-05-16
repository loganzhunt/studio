import type { NavItem, NavSection } from "@/types";
// Icons are no longer directly used here for NavItem, but keep for potential other uses or consistency
// import { Icons } from "@/components/icons"; 

export const SITE_TITLE = "Meta-Prism";
export const SITE_DESCRIPTION = "A symbolic self-assessment tool for exploring how you construct reality.";

export const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { title: "Assessment", href: "/assessment", icon: "assessment" },
  { title: "Results", href: "/results", icon: "results" },
  { title: "Codex", href: "/codex", icon: "codex" },
  { title: "Builder", href: "/builder", icon: "builder" },
  { title: "Archetypes", href: "/archetypes", icon: "archetypes" },
  { title: "Saved", href: "/saved-worldviews", icon: "saved" },
];

export const secondaryNavItems: NavItem[] = [
   { title: "About", href: "/about", icon: "about" },
  // { title: "Settings", href: "/settings", icon: "settings" },
];


export const navSections: NavSection[] = [
  {
    items: mainNavItems,
  },
  {
    title: "Resources",
    items: secondaryNavItems,
  }
];

// mobileNavItems will also use string keys for icons due to NavItem type change.
export const mobileNavItems: NavItem[] = [
  ...mainNavItems,
  ...secondaryNavItems,
];
