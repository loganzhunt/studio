
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { mainNavItems, allNavItemsForMobile, secondaryNavItems } from '@/config/site';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWorldview } from "@/hooks/use-worldview"; // Import the hook
import * as React from 'react';
import { AuthForm } from '@/components/auth/auth-form'; // Import AuthForm

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { 
    currentUser, 
    signInWithGoogle, 
    signOutUser,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal 
  } = useWorldview(); // Use the context

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => {
              if (item.hideOnDesktop) return null; // Hide if hideOnDesktop is true
              const IconComponent = item.icon ? Icons[item.icon] : null;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  asChild
                  className={cn(
                    "text-sm font-medium px-3 py-2", // Adjusted padding
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
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
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-primary/50 shadow-sm">
                      <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || "User"} />
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {getInitials(currentUser.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 glassmorphic-card mt-2 p-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none tracking-tight text-foreground">
                        {currentUser.displayName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="mx-1 my-1 bg-border/50" />
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 p-2">
                    <Link href="/dashboard" className="flex items-center">
                      <Icons.dashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 p-2">
                    <Link href="/results" className="flex items-center">
                      <Icons.results className="mr-2 h-4 w-4 text-muted-foreground" />
                       Results
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 p-2">
                    <Link href="/saved-worldviews" className="flex items-center">
                      <Icons.saved className="mr-2 h-4 w-4 text-muted-foreground" />
                       My Saved Profiles
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 p-2">
                    <Link href="/settings" className="flex items-center">
                      <Icons.settings className="mr-2 h-4 w-4 text-muted-foreground" />
                      Settings
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator className="mx-1 my-1 bg-border/50" />
                  <DropdownMenuItem
                    onClick={signOutUser}
                    className="cursor-pointer text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10 focus:!text-red-500 p-2"
                  >
                    <Icons.logout className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={openAuthModal}
                className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary px-4 py-2"
              >
                <Icons.user className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}

            {/* Mobile Menu Trigger */}
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
                    <MinimalLogo />
                  </Link>
                    <nav className="flex flex-col space-y-2">
                      {allNavItemsForMobile.map((item) => {
                        const IconComponent = item.icon ? Icons[item.icon] : null;
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center rounded-md py-2 px-3 text-base font-medium transition-colors",
                              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                          >
                            {IconComponent && <IconComponent className="mr-3 h-5 w-5" />}
                            {item.title}
                          </Link>
                        );
                      })}
                      {secondaryNavItems.length > 0 && <DropdownMenuSeparator className="my-3 bg-border/50" />}
                       {secondaryNavItems.map((item) => {
                        const IconComponent = item.icon ? Icons[item.icon] : null;
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center rounded-md py-2 px-3 text-base font-medium transition-colors",
                              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                          >
                            {IconComponent && <IconComponent className="mr-3 h-5 w-5" />}
                            {item.title}
                          </Link>
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
      <AuthForm /> {/* AuthForm is rendered here, its visibility controlled by context */}
    </>
  );
}

// Minimal logo for tight spaces if needed in mobile drawer
function MinimalLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
     <Icons.logo className={cn("h-7 w-7 text-primary", className)} {...props} />
  );
}

// Dummy ScrollArea for the example, replace with actual import
const ScrollArea = ({children, className}: {children: React.ReactNode, className?:string}) => <div className={className}>{children}</div>;

// Dummy Icons.user for the example, ensure it's defined in your Icons object
if (!Icons.user) {
  Icons.user = Icons.home; // Placeholder if user icon is missing
}
if (!Icons.logout) {
  Icons.logout = Icons.close; // Placeholder if logout icon is missing
}
