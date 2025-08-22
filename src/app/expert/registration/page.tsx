import { Suspense } from "react";
import ExpertRegistrationForm from "@/components/blocks/ExpertRegistrationForm";
import BackgroundEllipses from "@/components/blocks/BackgroundEllipses";

export const metadata = {
  title: "Expert-Registration",
};

// ローディング用のフォールバックコンポーネント
function RegistrationFormFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-white tracking-[0.25em] mb-2">
          METI Picks
        </h1>
        <h2 className="text-base font-bold text-white/90 tracking-[0.15em]">
          エントリーフォーム
        </h2>
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9] overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                 backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
             <filter id="noiseFilter">
                               <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="4" stitchTiles="stitch"/>
             </filter>
             <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
           </svg>
         `)}")`
      }}></div>
      <BackgroundEllipses scale={0.8} />
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <Suspense fallback={<RegistrationFormFallback />}>
          <ExpertRegistrationForm />
        </Suspense>
      </div>
    </main>
  );
}