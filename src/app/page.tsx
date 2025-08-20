import LoginForm from "@/components/blocks/LoginForm";
import BackgroundEllipses from "@/components/blocks/BackgroundEllipses";

export const metadata = {
  title: "Login",
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-t from-[#b4d9d6] to-[#58aadb] overflow-hidden">
      <BackgroundEllipses scale={0.8} />
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <LoginForm />
      </div>
    </main>
  );
}
