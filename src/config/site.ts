import type { NavItem, NavSection } from "@/types";
import { Icons } from "@/components/icons";

export const SITE_TITLE = "Meta-Prism";
export const SITE_DESCRIPTION = "A symbolic self-assessment tool for exploring how you construct reality.";

export const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Icons.dashboard },
  { title: "Assessment", href: "/assessment", icon: Icons.assessment },
  { title: "Results", href: "/results", icon: Icons.results },
  { title: "Codex", href: "/codex", icon: Icons.codex },
  { title: "Builder", href: "/builder", icon: Icons.builder },
  { title: "Archetypes", href: "/archetypes", icon: Icons.archetypes },
  { title: "Saved", href: "/saved-worldviews", icon: Icons.saved },
];

export const secondaryNavItems: NavItem[] = [
   { title: "About", href: "/about", icon: Icons.about },
  // { title: "Settings", href: "/settings", icon: Icons.settings },
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

export const mobileNavItems: NavItem[] = [
  ...mainNavItems,
  ...secondaryNavItems,
];
