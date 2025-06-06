"use client";

import React from "react";
import ParallaxGradient, {
  HeroParallaxGradient,
  ParallaxGradientText,
} from "@/components/ParallaxGradient";

/**
 * Test component to showcase all parallax effects in one place
 * This helps with visual debugging and performance testing
 */
export const ParallaxTester: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto my-12 p-6">
      <h1 className="text-3xl font-bold text-center">Parallax Effect Tester</h1>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Standard ParallaxGradient</h2>
        <ParallaxGradient
          height="8rem"
          speed={0.5}
          opacity={0.8}
          className="rounded-2xl shadow-md"
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Hero ParallaxGradient</h2>
        <HeroParallaxGradient className="rounded-2xl shadow-lg" />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">ParallaxGradient Text</h2>
        <div className="bg-black/20 p-8 rounded-2xl">
          <ParallaxGradientText
            fontSize="text-2xl md:text-3xl"
            fontWeight="font-bold"
            speed={0.8}
            className="mx-auto text-center"
          >
            This text uses the parallax gradient effect for a dynamic appearance
            that responds to scrolling
          </ParallaxGradientText>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Different Speed Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-center mb-2">Slow (0.3)</p>
            <ParallaxGradient
              height="5rem"
              speed={0.3}
              opacity={0.8}
              className="rounded-2xl"
            />
          </div>
          <div>
            <p className="text-center mb-2">Medium (0.8)</p>
            <ParallaxGradient
              height="5rem"
              speed={0.8}
              opacity={0.8}
              className="rounded-2xl"
            />
          </div>
          <div>
            <p className="text-center mb-2">Fast (1.5)</p>
            <ParallaxGradient
              height="5rem"
              speed={1.5}
              opacity={0.8}
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>

      <div className="h-[1000px] flex items-center justify-center">
        <p className="text-lg text-center">
          Scroll down more to see how the parallax effects respond to extended
          scrolling
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Final Test</h2>
        <div className="bg-black/20 p-8 rounded-2xl">
          <ParallaxGradientText
            fontSize="text-3xl md:text-4xl"
            fontWeight="font-bold"
            speed={1.2}
            className="mx-auto text-center"
          >
            The Meta-Prism: Dynamic Parallax
          </ParallaxGradientText>
        </div>
      </div>
    </div>
  );
};

export default ParallaxTester;
