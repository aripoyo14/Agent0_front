"use client";

import { useEffect, useState } from "react";

const WIDTH_MAX_PX = 1100; // min(90vw, 1100px)
const WIDTH_VW_RATIO = 0.9;
const HEIGHT_RATIO = 643.24109 / 1790.8717; // preserves original aspect

type Props = {
  scale?: number; // 0.5 ~ 1.0 などで全体縮小
  vwRatio?: number; // デフォルト 0.9
  maxWidthPx?: number; // デフォルト 1100
};

export default function BackgroundEllipses({
  scale = 1,
  vwRatio = WIDTH_VW_RATIO,
  maxWidthPx = WIDTH_MAX_PX,
}: Props) {
  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
    top1: 0,
    top2: 0,
    top3: 0,
  });

  useEffect(() => {
    const update = () => {
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const width = Math.min(viewportW * vwRatio, maxWidthPx) * scale;
      const height = width * HEIGHT_RATIO;

      const top1 = 0; // starts at very top
      const top2 = top1 + height; // connect to the bottom of the first
      const top3 = Math.max(0, viewportH - height); // bottom aligned

      setLayout({ width, height, top1, top2, top3 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [maxWidthPx, scale, vwRatio]);

  const commonStyle: React.CSSProperties = {
    left: "50%",
    transform: "translateX(-50%)",
    width: layout.width,
    height: layout.height,
    borderRadius: 706.9231,
  };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute"
        style={{
          ...commonStyle,
          top: layout.top1,
          background: "linear-gradient(90deg, rgba(135,196,247,0.4) 0%, rgba(160,199,217,0) 79%)",
        }}
      />
      <div
        className="absolute"
        style={{
          ...commonStyle,
          top: layout.top2,
          background: "linear-gradient(270deg, rgba(143,184,234,0.4) 0%, rgba(160,199,217,0) 78%)",
        }}
      />
      <div
        className="absolute"
        style={{
          ...commonStyle,
          top: layout.top3,
          background: "linear-gradient(90deg, rgba(142,184,216,0.3) 0%, rgba(160,199,217,0) 79%)",
        }}
      />
    </div>
  );
}


