
import type { NavItem, NavSection } from "@/types";
import type { Icons } from '@/components/icons'; 

export const SITE_TITLE = "Meta-Prism";
export const SITE_DESCRIPTION = "A symbolic self-assessment tool for exploring how you construct reality.";

// Nav items for the main horizontal navigation (desktop)
// Items with hideOnDesktop: true will not appear here but will be in allNavItemsForMobile
export const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { title: "Assessment", href: "/assessment", icon: "assessment" },
  { title: "Results", href: "/results", icon: "results", hideOnDesktop: true },
  { title: "Codex", href: "/codex", icon: "codex" },
  { title: "Builder", href: "/builder", icon: "builder" },
  { title: "Archetypes", href: "/archetypes", icon: "archetypes" },
  { title: "Saved", href: "/saved-worldviews", icon: "saved", hideOnDesktop: true },
];

// Nav items for secondary navigation sections or footers
export const secondaryNavItems: NavItem[] = [
   { title: "About", href: "/about", icon: "about" },
  // { title: "Settings", href: "/settings", icon: "settings" },
];

// Combined list for mobile navigation drawer
export const allNavItemsForMobile: NavItem[] = [...mainNavItems, ...secondaryNavItems];

// Configuration for sidebar navigation sections (if a sidebar layout is used)
// This is kept for potential future use or alternative layouts.
export const navSections: NavSection[] = [
  {
    items: mainNavItems.filter(item => !item.hideOnDesktop), // For a potential desktop sidebar that respects hideOnDesktop
  },
  {
    title: "Resources",
    items: secondaryNavItems,
  }
];
