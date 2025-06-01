
"use client";

import React from "react";
import { motion } from "framer-motion";
import { LCH_DOMAIN_COLORS_HEX } from "@/lib/colors"; // Use centralized ROYGBIV colors

interface FractalTriangleLogoProps {
  size?: number; // Optional size prop, defines intrinsic detail and aspect ratio
  className?: string;
}

export const FractalTriangleLogo: React.FC<FractalTriangleLogoProps> = ({
  size = 160, // Default intrinsic size for viewBox calculation
  className,
}) => {
  const numBands = LCH_DOMAIN_COLORS_HEX.length;
  // Calculate height of an equilateral triangle based on its side length (intrinsic size)
  const totalHeight = (Math.sqrt(3) / 2) * size;
  const bandHeight = totalHeight / numBands;

  // Apex-up triangle points for each band
  // y is measured from the top (apex is at y=0)
  const getBandPath = (index: number) => {
    const y1 = index * bandHeight;
    const y2 = (index + 1) * bandHeight;

    // Half-width of the main triangle at a given y
    const halfWidthAtY1 = (y1 / totalHeight) * (size / 2);
    const halfWidthAtY2 = (y2 / totalHeight) * (size / 2);

    const p1x = size / 2 - halfWidthAtY1; // Top-left X
    const p2x = size / 2 + halfWidthAtY1; // Top-right X
    const p3x = size / 2 + halfWidthAtY2; // Bottom-right X
    const p4x = size / 2 - halfWidthAtY2; // Bottom-left X

    return `M ${p1x},${y1} L ${p2x},${y1} L ${p3x},${y2} L ${p4x},${y2} Z`;
  };

  return (
    <svg
      width="100%" // Make SVG fill its container width
      height="100%" // Make SVG fill its container height
      viewBox={`0 0 ${size} ${totalHeight}`} // Define intrinsic coordinate system and aspect ratio
      className={className}
      aria-label="Meta-Prism Fractal Logo"
      preserveAspectRatio="xMidYMid meet" // Ensures aspect ratio is maintained
    >
      {LCH_DOMAIN_COLORS_HEX.map((color, i) => {
        return (
          <motion.path
            key={i}
            d={getBandPath(i)}
            fill={color}
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{
              opacity: 1,
              pathLength: 1,
              transition: {
                opacity: { duration: 0.4, delay: 0.3 + i * 0.12 },
                pathLength: { duration: 0.6, delay: 0.3 + i * 0.12, ease: "easeOut" },
              },
            }}
            whileHover={{
              scale: 1.03, // Simplified hover effect
              transition: { duration: 0.2 },
            }}
            // Optional continuous subtle ripple animation (currently commented out)
            // custom={i}
            // variants={{
            //   animate: (custom) => ({
            //     scale: [1, 1.005, 1],
            //     opacity: [0.9, 1, 0.9],
            //     transition: {
            //       repeat: Infinity,
            //       duration: 3 + custom * 0.2,
            //       delay: custom * 0.25,
            //       ease: "easeInOut",
            //     },
            //   }),
            // }}
            // animate="animate"
          />
        );
      })}
    </svg>
  );
};

export default FractalTriangleLogo;
