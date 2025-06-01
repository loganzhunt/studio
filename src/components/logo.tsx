
import { Icons } from '@/components/icons';
import { cn } from "@/lib/utils"; // Ensure cn is imported

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <Icons.logo className={cn("h-8 w-8 md:h-10 md:w-10 text-primary", className)} {...props} />
      <span className="text-xl font-bold text-foreground hidden sm:block">Meta-Prism</span>
    </div>
  );
}

// Minimal logo for tight spaces
export function MinimalLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
     <Icons.logo className={cn("h-8 w-8 text-primary", className)} {...props} />
  );
}
