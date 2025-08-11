"use client";

import { useEffect, useState } from "react";
import TopPage from "@/components/blocks/figma/TopPage";

// Frame size inferred from Figma export: 2832x1947
const FRAME_WIDTH = 2832;
const FRAME_HEIGHT = 1947;

export default function TopPageFitted() {
  const [scale, setScale] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      const base = Math.min(
        window.innerWidth / FRAME_WIDTH,
        window.innerHeight / FRAME_HEIGHT
      );
      // 端の薄い縦線対策としてごく僅かにオーバースケールさせる
      const overscan = 1.004;
      const s = base > 0 ? base * overscan : 1;
      setScale(Number(s.toFixed(4)));
      setIsReady(true);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  if (!isReady) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-t from-[#b4d9d6] to-[#58aadb]">
        {/* Loading state - 背景のみ表示 */}
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-t from-[#b4d9d6] to-[#58aadb]">
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale}) translateY(-1px)`,
          willChange: "transform",
        }}
      >
        <div className="size-full">
          <TopPage />
        </div>
      </div>
    </div>
  );
}
