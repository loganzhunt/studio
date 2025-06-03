// Glass Components for the Meta-Prism application
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AccordionItem } from "@/components/ui/accordion";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "subtle" | "large";
  animated?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = "default",
  animated = true, // Changed default to true for consistency
  ...props
}) => {
  const variants = {
    default: "bg-white/10 backdrop-blur-sm border border-white/20",
    elevated: "bg-white/20 backdrop-blur-md border border-white/30 shadow-xl",
    subtle: "bg-white/5 backdrop-blur-sm border border-white/10",
    large: "bg-white/15 backdrop-blur-md border border-white/25 shadow-lg p-6",
  };

  return (
    <Card
      className={cn(
        variants[variant],
        animated &&
          "transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-white/30 hover:bg-white/15",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

interface PrismButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg" | "small" | "large";
  asChild?: boolean;
}

export const PrismButton: React.FC<PrismButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  asChild = false,
  className,
  ...props
}) => {
  const variants = {
    primary: "bg-purple-500 text-white hover:bg-purple-600 relative overflow-hidden",
    secondary:
      "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 relative overflow-hidden",
    ghost: "bg-transparent text-white hover:bg-white/10 relative overflow-hidden",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    small: "px-3 py-1.5 text-sm", // Alias for sm
    large: "px-6 py-3 text-lg", // Alias for lg
  };

  const buttonClasses = cn(
    "prism-button btn-prism transition-all duration-200 transform hover:translate-y-[-2px] hover:scale-[1.02] active:translate-y-[0px] active:scale-[0.98]",
    "shadow-sm hover:shadow-[0_5px_15px_rgba(139,92,246,0.15)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-opacity-50",
    variants[variant],
    sizes[size],
    className
  );

  // If asChild is true, render as a span that can wrap other elements
  if (asChild) {
    return (
      <span
        className={cn(
          buttonClasses,
          "inline-flex items-center justify-center"
        )}
        {...(props as any)}
      >
        {children}
      </span>
    );
  }

  return (
    <Button
      className={buttonClasses}
      {...props}
    >
      <>
        {children}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-animation" />
      </>
    </Button>
  );
};

interface PrismSelectorProps {
  options: string[];
  selectedIndices: number[];
  onSelectionChange: (indices: number[]) => void;
  multiple?: boolean;
  className?: string;
}

export const PrismSelector: React.FC<PrismSelectorProps> = ({
  options,
  selectedIndices,
  onSelectionChange,
  multiple = false,
  className,
}) => {
  const handleOptionClick = (index: number) => {
    if (multiple) {
      const newSelection = selectedIndices.includes(index)
        ? selectedIndices.filter((i) => i !== index)
        : [...selectedIndices, index];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([index]);
    }
  };

  return (
    <div className={cn("prism-selector flex flex-wrap gap-2", className)}>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(index)}
          className={cn(
            "px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
            selectedIndices.includes(index)
              ? "bg-purple-500 text-white"
              : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

interface SpectrumBarProps {
  value?: number;
  max?: number;
  colors?: string[];
  className?: string;
  facet?: string;
  animated?: boolean;
}

export const SpectrumBar: React.FC<SpectrumBarProps> = ({
  value = 0,
  max = 100,
  colors = [
    "#ff0045",
    "#ff9315",
    "#f1e800",
    "#2df36c",
    "#00b8ff",
    "#0082ff",
    "#8e6bf7",
  ],
  className,
  facet,
  animated = true,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      className={cn(
        "spectrum-progress relative w-full h-2 rounded-full overflow-hidden",
        className
      )}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(to right, ${colors.join(", ")})`,
        }}
      />
      <div
        className="absolute top-0 left-0 h-full bg-white/30 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "subtle";
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  const variants = {
    default: "bg-white/10 backdrop-blur-sm border border-white/20",
    elevated: "bg-white/20 backdrop-blur-md border border-white/30 shadow-xl",
    subtle: "bg-white/5 backdrop-blur-sm border border-white/10",
  };

  return (
    <div
      className={cn(
        "glass-panel-container rounded-lg p-4",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface HeroShimmerProps {
  className?: string;
}

export const HeroShimmer: React.FC<HeroShimmerProps> = ({ className }) => {
  return (
    <div
      className={cn("hero-shimmer-effect relative overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      <div className="relative z-10 p-8 text-center">
        <div className="h-8 bg-white/20 rounded mb-4 animate-pulse" />
        <div className="h-4 bg-white/10 rounded mb-2 animate-pulse" />
        <div className="h-4 bg-white/10 rounded w-3/4 mx-auto animate-pulse" />
      </div>
    </div>
  );
};

// Additional missing components for glass-showcase

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <div className="glass-input-container space-y-2">
      {label && (
        <label className="text-sm font-medium text-white/80">{label}</label>
      )}
      <input
        className={cn(
          "w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg",
          "text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50",
          className
        )}
        {...props}
      />
    </div>
  );
};

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 max-w-lg w-full">
        {title && (
          <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
};

interface SpectrumIconProps {
  className?: string;
}

export const SpectrumIcon: React.FC<SpectrumIconProps> = ({ className }) => {
  return (
    <div className={cn("spectrum-icon relative w-8 h-8", className)}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-purple-500" />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  return (
    <GlassCard className={cn("p-6 text-center", className)}>
      <div className="flex justify-center mb-4 text-purple-400">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </GlassCard>
  );
};

interface GlassAccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionItem> {
  animated?: boolean;
}

export const GlassAccordionItem: React.FC<GlassAccordionItemProps> = ({
  children,
  className,
  animated = true, // Changed default to true for consistency
  ...props
}) => {
  return (
    <AccordionItem
      className={cn(
        "glassmorphic-card bg-white/10 backdrop-blur-sm border border-white/20 mb-3 last:mb-0 overflow-hidden rounded-lg",
        animated &&
          "transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-white/30 hover:bg-white/15",
        className
      )}
      {...props}
    >
      {children}
    </AccordionItem>
  );
};
