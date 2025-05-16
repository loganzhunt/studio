import { Icons } from '@/components/icons';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2">
      <Icons.logo className={cn("h-8 w-8 text-primary", className)} {...props} />
      <span className="text-xl font-bold text-foreground">Meta-Prism</span>
    </div>
  );
}

// Minimal logo for tight spaces
export function MinimalLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
     <Icons.logo className={cn("h-8 w-8 text-primary", className)} {...props} />
  );
}

// Helper to avoid undefined cn
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
