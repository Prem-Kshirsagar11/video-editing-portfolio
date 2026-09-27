"use client";

import React from "react";

/**
 * ProgressiveBlur renders a multi-layer progressive blur effect
 * at the bottom of the viewport, mimicking Framer's optical lens blur
 * with zero dark vignette or color tinting.
 */
export default function ProgressiveBlur() {
  const layers = [
    { blur: "0.25px", mask: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)", z: 1 },
    { blur: "0.5px", mask: "linear-gradient(to bottom, rgba(0,0,0,0) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 37.5%, rgba(0,0,0,0) 50%)", z: 2 },
    { blur: "1px", mask: "linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,1) 37.5%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 62.5%)", z: 3 },
    { blur: "2px", mask: "linear-gradient(to bottom, rgba(0,0,0,0) 37.5%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 62.5%, rgba(0,0,0,0) 75%)", z: 4 },
    { blur: "4px", mask: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 62.5%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 87.5%)", z: 5 },
    { blur: "8px", mask: "linear-gradient(to bottom, rgba(0,0,0,0) 62.5%, rgba(0,0,0,1) 75%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%)", z: 6 },
    { blur: "12px", mask: "linear-gradient(to bottom, rgba(0,0,0,0) 75%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,1) 100%)", z: 7 },
    { blur: "16px", mask: "linear-gradient(to bottom, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)", z: 8 },
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-0 left-0 right-0 w-full h-28 sm:h-36 pointer-events-none z-30 overflow-hidden"
    >
      {layers.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            zIndex: layer.z,
            backdropFilter: `blur(${layer.blur})`,
            WebkitBackdropFilter: `blur(${layer.blur})`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        />
      ))}
    </div>
  );
}
