"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxGradientProps {
  className?: string;
  colors?: string[];
  height?: string;
  opacity?: number;
  speed?: number;
}

/**
 * A component that creates a vertical gradient with a parallax effect on scroll.
 * The gradient shifts position as the user scrolls to create a dynamic visual effect.
 */
export const ParallaxGradient: React.FC<ParallaxGradientProps> = ({
  className,
  colors = [
    "#ff0045", // Red
    "#ff9315", // Orange
    "#f1e800", // Yellow
    "#2df36c", // Green
    "#00b8ff", // Light Blue
    "#0082ff", // Blue
    "#8e6bf7", // Purple
  ],
  height = "12rem",
  opacity = 0.7,
  speed = 0.5,
}) => {
  const gradientRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const lastScrollTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Create the gradient string from the provided colors
  const gradientString = `linear-gradient(to bottom, ${colors.join(", ")})`;

  // Update the position of the gradient based on scroll position with throttling and RAF
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current > 16) {
        // Approximately 60fps
        lastScrollTimeRef.current = now;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          setScrollPosition(window.scrollY);
        });
      }
    };

    // Add scroll event listener with passive flag for performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial position
    setScrollPosition(window.scrollY);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Calculate background position with improved easing
  const backgroundPosition = `center ${50 + scrollPosition * speed * 0.1}%`;

  return (
    <div
      ref={gradientRef}
      className={cn(
        "w-full parallax-gradient transition-opacity duration-700 rounded-2xl overflow-hidden",
        className
      )}
      style={{
        height,
        willChange: "transform",
      }}
    >
      <div
        className="absolute inset-0 w-full h-full rounded-2xl will-change-transform"
        style={{
          background: gradientString,
          backgroundSize: "100% 1000%", // Make the gradient very tall
          backgroundPosition,
          opacity,
          transition: "background-position 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Light shine effect that moves with scrolling - optimized with will-change */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-screen will-change-transform rounded-2xl"
        style={{
          background: `linear-gradient(to bottom, transparent, rgba(255,255,255,0.05) ${
            50 + ((scrollPosition * speed * 0.05) % 50)
          }%, transparent)`,
          transform: `translateY(${scrollPosition * speed * 0.02}px)`,
          transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
};

/**
 * A special version of the ParallaxGradient designed for hero sections.
 * Features a larger height and more pronounced parallax effect.
 */
export const HeroParallaxGradient: React.FC<ParallaxGradientProps> = (
  props
) => {
  return (
    <ParallaxGradient
      height="16rem"
      speed={1.2}
      opacity={0.9}
      colors={[
        "#ff0045", // Red
        "#ff9315", // Orange
        "#f1e800", // Yellow
        "#2df36c", // Green
        "#00b8ff", // Light Blue
        "#0082ff", // Blue
        "#8e6bf7", // Purple
        "#ff0045", // Red (repeated to create smooth loop)
      ]}
      className="rounded-2xl shadow-lg"
      {...props}
    />
  );
};

/**
 * A component that applies a parallax gradient effect directly to text.
 * The gradient shifts with scrolling to create a vibrant animated text effect.
 */
export const ParallaxGradientText: React.FC<
  ParallaxGradientProps & {
    children: React.ReactNode;
    fontSize?: string;
    fontWeight?: string;
    textClassName?: string;
  }
> = ({
  className,
  children,
  colors = [
    "#ff0045", // Red
    "#ff9315", // Orange
    "#f1e800", // Yellow
    "#2df36c", // Green
    "#00b8ff", // Light Blue
    "#0082ff", // Blue
    "#8e6bf7", // Purple
  ],
  speed = 0.5,
  fontSize = "text-xl",
  fontWeight = "font-bold",
  textClassName,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const lastScrollTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Create the gradient string from the provided colors
  const gradientString = `linear-gradient(to bottom, ${colors.join(", ")})`;

  // Update the position of the gradient based on scroll position with throttling and RAF
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current > 16) {
        // Approximately 60fps
        lastScrollTimeRef.current = now;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          setScrollPosition(window.scrollY);
        });
      }
    };

    // Add scroll event listener with passive flag for performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial position
    setScrollPosition(window.scrollY);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Calculate background position with improved easing
  const backgroundPosition = `center ${50 + scrollPosition * speed * 0.1}%`;

  return (
    <div
      className={cn(
        "relative inline-block text-transparent bg-clip-text leading-relaxed tracking-wide",
        fontSize,
        fontWeight,
        textClassName,
        className
      )}
      style={{
        backgroundImage: gradientString,
        backgroundSize: "100% 1000%", // Make the gradient very tall
        backgroundPosition,
        transition: "background-position 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "background-position, transform",
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxGradient;
