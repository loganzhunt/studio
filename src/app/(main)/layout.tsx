import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { navSections } from "@/config/site";
import { Logo } from "@/components/logo";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import Link from "next/link";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link href="/" className="block group-data-[collapsible=icon]:hidden">
            <Logo />
          </Link>
           <Link href="/" className="hidden group-data-[collapsible=icon]:block mx-auto">
            <Logo className="h-6 w-6"/>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav sections={navSections} />
        </SidebarContent>
        <SidebarFooter>
          {/* Optional: Footer content like user profile, settings */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
