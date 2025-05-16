"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavSection, NavItem } from "@/types";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavProps {
  sections: NavSection[];
}

export function SidebarNav({ sections }: SidebarNavProps) {
  const pathname = usePathname();
  const { setOpenMobile, open: sidebarOpen } = useSidebar(); // 'open' refers to desktop sidebar state

  return (
    <SidebarMenu>
      {sections.map((section, sectionIndex) => (
        <SidebarGroup key={sectionIndex}>
          {section.title && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            
            const buttonContent = (
              <>
                {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                <span className="truncate">{item.title}</span>
              </>
            );

            return (
              <SidebarMenuItem key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        onClick={() => setOpenMobile(false)}
                        className={cn(
                          "w-full justify-start",
                          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <a>{buttonContent}</a>
                      </SidebarMenuButton>
                    </Link>
                  </TooltipTrigger>
                  {!sidebarOpen && ( // Show tooltip only when sidebar is collapsed
                    <TooltipContent side="right" className="capitalize">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>
            );
          })}
        </SidebarGroup>
      ))}
    </SidebarMenu>
  );
}
