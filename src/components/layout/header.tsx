import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Placeholder for future actions like ThemeToggle or UserProfile */}
          {/* <ThemeToggle /> */}
          {/* <UserAccountNav /> */}
        </div>
      </div>
    </header>
  );
}
