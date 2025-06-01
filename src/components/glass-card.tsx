import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glassmorphic-card p-6", // Defined in globals.css
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
