import { Header } from '@/components/ui/header';
import DashboardMainContent from '@/components/blocks/DashboardMainContent';

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9] relative overflow-hidden">
      {/* 背景のテクスチャ効果を追加 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>
      
      {/* 既存のヘッダー */}
      <Header />
      
      {/* メインコンテンツ */}
      <DashboardMainContent />
    </div>
  );
}
