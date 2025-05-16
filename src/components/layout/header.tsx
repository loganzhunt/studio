"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { mainNavItems } from '@/config/site';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile menu
import * as React from 'react';

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/70 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {mainNavItems.map((item) => {
            const IconComponent = item.icon ? Icons[item.icon] : null;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Link href={item.href}>
                  {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2">
          {/* Placeholder for future actions like ThemeToggle or UserProfile */}
          {/* <ThemeToggle /> */}
          {/* <UserAccountNav /> */}

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Icons.menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-md">
              <div className="p-4">
                <nav className="flex flex-col space-y-3">
                  {mainNavItems.map((item) => {
                    const IconComponent = item.icon ? Icons[item.icon] : null;
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center rounded-md p-2 text-base font-medium",
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {IconComponent && <IconComponent className="mr-3 h-5 w-5" />}
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
