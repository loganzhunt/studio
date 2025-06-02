"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { useWorldview } from "@/hooks/use-worldview";
import { FractalTriangleLogo } from "@/components/FractalTriangleLogo";
import { TriangleChart } from "@/components/visualization/TriangleChart";

interface DynamicLogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface MinimalDynamicLogoProps {
  className?: string;
  size?: number;
}

// Size configurations for the logo
const LOGO_SIZES = {
  sm: { 
    triangleSize: 20, 
    textClass: "text-base font-bold", 
    containerClass: "h-6 w-6"
  },
  md: { 
    triangleSize: 28, 
    textClass: "text-xl font-bold", 
    containerClass: "h-7 w-7"
  },
  lg: { 
    triangleSize: 36, 
    textClass: "text-2xl font-bold", 
    containerClass: "h-9 w-9"
  }
};

export function DynamicLogo({ 
  showText = false, 
  size, 
  className 
}: DynamicLogoProps) {
  const { hasAssessmentBeenRun, domainScores } = useWorldview();

  // If no size is specified, fill the container like the original FractalTriangleLogo
  if (!size) {
    return (
      <div className={cn("flex items-center gap-2 whitespace-nowrap", className)}>
        <div className="relative w-full h-full">
          {hasAssessmentBeenRun && domainScores && domainScores.length > 0 ? (
            // Show user's custom signature triangle - fill container
            <TriangleChart 
              scores={domainScores}
              width={300} // Use default width, will be scaled by container
              height={260} // Use default height, will be scaled by container  
              className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none w-full h-full"
              interactive={false}
            />
          ) : (
            // Show default fractal triangle logo - fill container
            <FractalTriangleLogo 
              className="text-primary w-full h-full"
            />
          )}
        </div>
        
        {showText && (
          <span className="text-xl font-bold text-foreground hidden sm:block">
            Meta-Prism
          </span>
        )}
      </div>
    );
  }

  // Use specific size configuration for header/navigation
  const sizeConfig = LOGO_SIZES[size];
  return (
    <div className={cn("flex items-center gap-2 whitespace-nowrap", className)}>
      <div className={cn("relative", sizeConfig.containerClass)}>
        {hasAssessmentBeenRun && domainScores && domainScores.length > 0 ? (
          // Show user's custom signature triangle
          <TriangleChart 
            scores={domainScores}
            width={sizeConfig.triangleSize}
            height={Math.round(sizeConfig.triangleSize * 0.867)} // Maintain equilateral triangle ratio
            className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none"
            interactive={false}
          />
        ) : (
          // Show default fractal triangle logo
          <div className={sizeConfig.containerClass}>
            <FractalTriangleLogo 
              size={sizeConfig.triangleSize}
              className="text-primary"
            />
          </div>
        )}
      </div>
      
      {showText && (
        <span className={cn(sizeConfig.textClass, "text-foreground hidden sm:block")}>
          Meta-Prism
        </span>
      )}
    </div>
  );
}

export function MinimalDynamicLogo({ 
  className,
  size = 24
}: MinimalDynamicLogoProps) {
  const { hasAssessmentBeenRun, domainScores } = useWorldview();

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {hasAssessmentBeenRun && domainScores && domainScores.length > 0 ? (
        // Show user's custom signature triangle
        <TriangleChart 
          scores={domainScores}
          width={size}
          height={Math.round(size * 0.867)} // Maintain equilateral triangle ratio
          className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none"
          interactive={false}
        />
      ) : (
        // Show default fractal triangle logo
        <div style={{ width: size, height: size }}>
          <FractalTriangleLogo 
            size={size}
            className="text-primary"
          />
        </div>
      )}
    </div>
  );
}
