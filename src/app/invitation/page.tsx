import InvitationCodeForm from "@/components/blocks/InvitationCodeForm";
import BackgroundEllipses from "@/components/blocks/BackgroundEllipses";

export const metadata = {
  title: "招待コード発行",
};

export default function InvitationPage() {
  // クライアントサイドでの認証チェックは各コンポーネントで行う
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-t from-[#b4d9d6] to-[#58aadb] overflow-hidden">
      <BackgroundEllipses scale={0.8} />
      <div className="relative min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">招待コード管理</h1>
            <p className="text-white/80">
              新しいユーザーやエキスパートを招待するためのQRコードを発行・管理できます
            </p>
          </div>
          
          <InvitationCodeForm />
        </div>
      </div>
    </main>
  );
}
