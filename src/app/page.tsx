import LoginForm from "@/components/blocks/LoginForm";
import BackgroundEllipses from "@/components/blocks/BackgroundEllipses";

export const metadata = {
  title: "METI Picks - Login",
};

export default function HomePage() {
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
      
      <BackgroundEllipses scale={0.8} />
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <LoginForm />
      </div>
    </main>
  );
}
