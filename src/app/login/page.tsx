import LoginForm from "@/components/blocks/LoginForm";
import BackgroundEllipses from "@/components/blocks/BackgroundEllipses";

export const metadata = {
  title: "METI Picks - Login",
};

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9] overflow-hidden">
      {/* テクスチャ効果 */}
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
      
      {/* 追加のグラデーション効果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none"></div>
      
      {/* 動く光の効果 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl animate-pulse animation-reverse pointer-events-none"></div>
      
      <BackgroundEllipses scale={0.8} />
      <div className="relative flex min-h-screen items-center justify-center px-4 animate-fade-in">
        <LoginForm />
      </div>
    </main>
  );
}


