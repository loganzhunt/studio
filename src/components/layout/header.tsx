
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DynamicLogo, MinimalDynamicLogo } from '@/components/DynamicLogo';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { mainNavItems, allNavItemsForMobile } from '@/config/site';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWorldview } from "@/hooks/use-worldview";
import * as React from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const {
    currentUser,
    signOutUser,
    openAuthModal,
  } = useWorldview();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1 && names[0].length > 0) return names[0][0].toUpperCase();
    if (names.length > 1 && names[0].length > 0 && names[names.length - 1].length > 0) {
      return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
    }
    if (name.length > 0) return name[0].toUpperCase();
    return "?";
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-16 py-3"> {/* Increased px from 12 to 16 */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <DynamicLogo showText={true} size="md" />
          </Link>

          <nav className="hidden md:flex flex-1 justify-start items-center gap-2 ml-6"> {/* Decreased gap from 4 to 2 */}
            {mainNavItems.map((item) => {
              if (item.hideOnDesktop) return null;

              const IconComponent = item.icon ? Icons[item.icon] : null;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  asChild
                  className={cn(
                    "text-sm font-medium px-3 py-2",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-1.5">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-14 w-14 rounded-full p-0 shadow-md">
                    <Avatar className="h-14 w-14 border-2 border-primary/50">
                       <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">
                        {getInitials(currentUser.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 glassmorphic-card mt-2 p-4" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal px-0 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-lg font-bold leading-none tracking-tighter text-foreground">
                        {currentUser.displayName}
                      </p>
                      {currentUser.email && (
                        <p className="text-sm leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="mx-0 my-2 bg-border/50" />
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 p-2.5">
                    <Link href="/dashboard" className="flex items-center text-sm">
                      <Icons.dashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 p-2.5">
                    <Link href="/results" className="flex items-center text-sm">
                      <Icons.results className="mr-2.5 h-4 w-4 text-muted-foreground" />
                       Results
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 p-2.5">
                    <Link href="/saved-worldviews" className="flex items-center text-sm">
                      <Icons.saved className="mr-2.5 h-4 w-4 text-muted-foreground" />
                       My Saved Profiles
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 p-2.5">
                    <Link href="/about" className="flex items-center text-sm">
                      <Icons.about className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      About Meta-Prism
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={signOutUser}
                    className="cursor-pointer !text-red-100 !bg-red-600/80 hover:!bg-red-600/90 focus:!bg-red-700/90 p-2.5 flex items-center text-sm font-medium rounded-md mt-2"
                  >
                    <Icons.logout className="mr-2.5 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={openAuthModal}
                className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary px-3 py-1.5 h-9 font-medium text-xs sm:text-sm"
              >
                <Icons.user className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                Sign In
              </Button>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Icons.menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[320px] bg-background/95 backdrop-blur-md p-0">
                <ScrollArea className="h-full">
                  <div className="p-6 pt-8">
                  <Link href="/" className="flex items-center space-x-2 mb-6" onClick={() => setIsMobileMenuOpen(false)}>
                    <MinimalDynamicLogo />
                     <span className="text-xl font-bold text-foreground">Meta-Prism</span>
                  </Link>
                    <nav className="flex flex-col space-y-2">
                      {allNavItemsForMobile.map((item) => {
                        const IconComponent = item.icon ? Icons[item.icon] : null;
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                          <SheetClose asChild key={item.title}>
                            <Link
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center rounded-md py-2.5 px-3 text-base font-medium transition-colors",
                                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                              )}
                            >
                              {IconComponent && <IconComponent className="mr-3 h-5 w-5" />}
                              {item.title}
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </nav>
                  </div>
                </ScrollArea>
                 <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary md:hidden">
                  <Icons.close className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <AuthForm />
    </>
  );
}
