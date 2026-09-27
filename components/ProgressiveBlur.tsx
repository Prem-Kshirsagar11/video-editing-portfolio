"use client";

import React, { useState, useEffect } from "react";

/**
 * ProgressiveBlur renders a bottom-of-viewport gradient blur effect.
 * Fades to 0 opacity over the last 600px of scroll (FAQ → footer).
 * Uses pure inline styles to avoid any Tailwind purge issues.
 */
export default function ProgressiveBlur() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setOpacity(1);
        return;
      }
      const distanceToBottom = maxScroll - window.scrollY;
      const FADE_RANGE = 600;
      if (distanceToBottom >= FADE_RANGE) {
        setOpacity(1);
      } else if (distanceToBottom <= 0) {
        setOpacity(0);
      } else {
        setOpacity(distanceToBottom / FADE_RANGE);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const layers = [
    {
      blur: 1,
      bright: 1.01,
      mask: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 12%, rgba(0,0,0,0.8) 22%, rgba(0,0,0,1) 32%)",
    },
    {
      blur: 2,
      bright: 1.015,
      mask: "linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,0.4) 22%, rgba(0,0,0,0.8) 34%, rgba(0,0,0,1) 44%)",
    },
    {
      blur: 4,
      bright: 1.02,
      mask: "linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.4) 33%, rgba(0,0,0,0.8) 46%, rgba(0,0,0,1) 56%)",
    },
    {
      blur: 8,
      bright: 1.025,
      mask: "linear-gradient(to bottom, rgba(0,0,0,0) 32%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.8) 58%, rgba(0,0,0,1) 68%)",
    },
    {
      blur: 12,
      bright: 1.03,
      mask: "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.4) 58%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 80%)",
    },
    {
      blur: 18,
      bright: 1.035,
      mask: "linear-gradient(to bottom, rgba(0,0,0,0) 58%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 82%, rgba(0,0,0,1) 90%)",
    },
    {
      blur: 26,
      bright: 1.04,
      mask: "linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 81%, rgba(0,0,0,0.85) 92%, rgba(0,0,0,1) 100%)",
    },
    {
      blur: 36,
      bright: 1.045,
      mask: "linear-gradient(to bottom, rgba(0,0,0,0) 80%, rgba(0,0,0,0.45) 90%, rgba(0,0,0,1) 100%)",
    },
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "80px",
        pointerEvents: "none",
        zIndex: 40,
        opacity,
        transition: "opacity 0.15s ease-out",
      }}
    >
      {layers.map((layer, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: `blur(${layer.blur}px) brightness(${layer.bright}) saturate(1.15)`,
            WebkitBackdropFilter: `blur(${layer.blur}px) brightness(${layer.bright}) saturate(1.15)`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        />
      ))}
    </div>
  );
}
