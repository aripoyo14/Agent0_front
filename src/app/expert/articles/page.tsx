import ExpertArticleListPage from "@/components/blocks/ExpertArticleListPage";
import { getServerPolicyProposals } from "@/lib/server-api";
import { PolicyProposal } from "@/types";

export const metadata = {
  title: "Expert-Articles",
  description: "外部有識者向け政策記事一覧ページ",
};

// サーバーサイドでデータを取得
async function getInitialArticles(): Promise<PolicyProposal[]> {
  try {
    const articles = await getServerPolicyProposals({
      status: "published" as const,
      limit: 50
    });
    return articles;
  } catch (error) {
    console.error("初期記事取得エラー:", error);
    return [];
  }
}

export default async function Page() {
  // サーバーサイドで初期データを取得
  const initialArticles = await getInitialArticles();
  
  return <ExpertArticleListPage initialArticles={initialArticles} />;
}
