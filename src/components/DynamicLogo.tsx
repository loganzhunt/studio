"use client";

import React from "react";
import { FractalTriangleLogo } from "@/components/FractalTriangleLogo";
import TriangleChart from "@/components/visualization/TriangleChart";
import { useWorldview } from "@/hooks/use-worldview";
import { cn } from "@/lib/utils";

interface DynamicLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const DynamicLogo: React.FC<DynamicLogoProps> = ({
  className,
  showText = false,
  size = "md",
}) => {
  const { hasAssessmentBeenRun, domainScores, activeProfile } = useWorldview();

  // Determine if we should show the user's personalized triangle
  const showUserTriangle = hasAssessmentBeenRun || activeProfile;
  const scoresToDisplay = activeProfile?.domainScores || domainScores;

  // Size configurations for different contexts
  const sizeConfig = {
    sm: {
      container: "h-8 w-8",
      text: "text-lg font-bold",
      triangleSize: { width: 32, height: 28 },
      fractalSize: 32,
    },
    md: {
      container: "h-10 w-10 md:h-10 md:w-10",
      text: "text-xl font-bold",
      triangleSize: { width: 40, height: 35 },
      fractalSize: 40,
    },
    lg: {
      container: "h-12 w-12",
      text: "text-2xl font-bold",
      triangleSize: { width: 48, height: 42 },
      fractalSize: 48,
    },
  };

  const config = sizeConfig[size];

  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <div className={cn(config.container, "relative overflow-hidden", className)}>
        {showUserTriangle && scoresToDisplay && scoresToDisplay.length > 0 ? (
          // Show user's personalized triangle
          <TriangleChart
            scores={scoresToDisplay}
            worldviewName="Your Worldview"
            width={config.triangleSize.width}
            height={config.triangleSize.height}
            className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none absolute inset-0"
            interactive={false}
          />
        ) : (
          // Show default animated fractal triangle
          <FractalTriangleLogo
            size={config.fractalSize}
            className="absolute inset-0 w-full h-full text-primary"
          />
        )}
      </div>
      {showText && (
        <span className={cn(config.text, "text-foreground hidden sm:block")}>
          Meta-Prism
        </span>
      )}
    </div>
  );
};

export const MinimalDynamicLogo: React.FC<{ className?: string }> = ({
  className,
}) => {
  return <DynamicLogo className={className} showText={false} size="sm" />;
};

export default DynamicLogo;
