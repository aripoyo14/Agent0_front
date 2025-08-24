import { getUserNameServerSide } from '@/lib/auth-server';

export default async function TestPage() {
  const userName = await getUserNameServerSide();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">SSR動作確認ページ</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p><strong>サーバーサイドで取得したユーザー名:</strong> {userName}</p>
        <p><strong>取得時刻:</strong> {new Date().toLocaleString('ja-JP')}</p>
        <p><strong>環境:</strong> {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
}
