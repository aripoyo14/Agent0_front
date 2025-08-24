import { Metadata } from 'next';
import { fetchSearchData } from '@/lib/searchData';
import { SearchPageClient } from '@/components/blocks/SearchPageClient';

export const metadata: Metadata = {
  title: '検索 - 人脈マップ',
  description: '政策テーマやキーワードで専門家を検索し、人脈マップを表示します。',
  keywords: '検索, 専門家, 人脈マップ, 政策テーマ, ネットワーク',
};

export default async function SearchPage() {
  try {
    // サーバーサイドでデータを取得
    console.log('Fetching search data...');
    const searchData = await fetchSearchData();
    console.log('Search data fetched:', searchData);

    return (
      <SearchPageClient 
        initialData={searchData}
      />
    );
  } catch (error) {
    console.error('Error in SearchPage:', error);
    
    // エラーが発生した場合は、既存のSearchPageを使用
    const { SearchPage } = await import('@/components/blocks/SearchPage');
    return <SearchPage />;
  }
}
