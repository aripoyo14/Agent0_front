import { useRouter } from "next/navigation";

/**
 * TopPageのナビゲーション機能を提供するカスタムフック
 * 各主要機能への遷移ロジックを集約
 */
export const useTopPageNavigation = () => {
  const router = useRouter();

  /**
   * ログアウト処理
   * セッションクリア + ログインページへ遷移
   */
  const handleLogout = () => {
    // TODO: 将来的にはセッション削除等の処理を追加
    router.push("/login");
  };

  /**
   * 人脈検索ページへ遷移
   */
  const handleSearchPeople = () => {
    router.push("/search");
  };

  /**
   * 政策案投稿ページへ遷移
   */
  const handleSubmitPolicy = () => {
    router.push("/policy");
  };

  /**
   * 意見確認ページへ遷移
   */
  const handleCheckOpinions = () => {
    router.push("/comments");
  };

  return {
    handleLogout,
    handleSearchPeople,
    handleSubmitPolicy,
    handleCheckOpinions,
  };
};

export type TopPageNavigation = ReturnType<typeof useTopPageNavigation>;
