import React, { useState, useEffect, useMemo } from 'react';
import { CommentCount } from "@/components/ui/comment-count";
import { getPolicyProposalComments } from "@/lib/expert-api";

// 開発環境でのみログを表示する関数
const devLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

// 開発環境でのみエラーログを表示する関数
const devError = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};

// フラットなコメントリストを親子関係のある階層構造に変換する関数
const buildCommentTree = (comments: ExpertComment[]): ExpertComment[] => {
  const commentMap = new Map<string, ExpertComment>();
  const rootComments: ExpertComment[] = [];

  // まず全てのコメントをMapに格納し、childrenプロパティを初期化
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, children: [] });
  });

  // 親子関係を構築
  comments.forEach(comment => {
    const commentWithChildren = commentMap.get(comment.id);
    if (!commentWithChildren) return;

    if (comment.parentCommentId) {
      // 子コメントの場合、親コメントのchildrenに追加
      const parentComment = commentMap.get(comment.parentCommentId);
      if (parentComment) {
        parentComment.children = parentComment.children || [];
        parentComment.children.push(commentWithChildren);
      }
    } else {
      // 親コメントの場合、ルートコメントに追加
      rootComments.push(commentWithChildren);
    }
  });

  return rootComments;
};

export interface ExpertArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  department: string;
  publishedAt: string;
  commentCount: number;
  themeId: string;
  attachments?: Array<{
    id: string;
    policy_proposal_id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
    uploaded_by_user_id: string;
    uploaded_at: string;
  }>;
}

export interface ExpertComment {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    company: string;
    badges: Array<{
      type: "expert" | "pro" | "verified" | "official" | "influencer";
      label: string;
      color: string;
      description: string;
    }>;
    expertiseLevel: "expert" | "pro" | "verified" | "regular";
  };
  content: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
  showFullContent?: boolean;
  parentCommentId?: string | null; // 親コメントのID（null: 親コメント、string: 子コメント）
  children?: ExpertComment[]; // 子コメントの配列
}

export interface ExpertOverlayState {
  isOpen: boolean;
  selectedArticle: ExpertArticle | null;
}

export type CommentSortOption = 'relevance' | 'likes' | 'views' | 'date';

interface ArticleOverlayProps {
  article: ExpertArticle;
  isOpen: boolean;
  onClose: () => void;
}

// コメント並び替えセレクター
const CommentSortSelector = ({ 
  currentSort, 
  onSortChange 
}: { 
  currentSort: CommentSortOption;
  onSortChange: (sort: CommentSortOption) => void;
}) => {
  const sortOptions = [
    { value: 'relevance', label: '関連性順' },
    { value: 'likes', label: 'いいね順' },
    { value: 'views', label: '閲覧数順' },
    { value: 'date', label: '投稿日時順' }
  ] as const;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">並び替え:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as CommentSortOption)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// 親コメントまたは子コメントのカードコンポーネント
const CommentCard = ({ 
  comment, 
  onToggleFullContent,
  isChild = false,
  depth = 0
}: { 
  comment: ExpertComment;
  onToggleFullContent: (commentId: string) => void;
  isChild?: boolean;
  depth?: number;
}) => {
  const maxDepth = 3; // 最大ネスト深度
  const currentDepth = Math.min(depth, maxDepth);
  const indentClass = currentDepth > 0 ? `ml-${4 + currentDepth * 4}` : '';
  
  return (
    <div className={`${isChild ? 'border-l-2 border-gray-200 pl-4 mt-4' : 'border-b border-gray-100 pb-6 mb-6'} ${indentClass}`}>
      <div className="flex items-start gap-4 mb-4">
        {/* プロフィール画像 - 子コメントは少し小さく */}
        <div className={`${isChild ? 'w-8 h-8' : 'w-10 h-10'} bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0`}>
          {comment.author.name.charAt(0)}
        </div>
        
        {/* コメント情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-bold text-gray-900 ${isChild ? 'text-sm' : 'text-base'}`}>
                {comment.author.name}
              </span>
              <span className="text-sm text-gray-500">{comment.author.role}</span>
              {isChild && (
                <span className="text-xs text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                  返信
                </span>
              )}
            </div>
            
            {/* 認定エキスパートバッジ */}
            {comment.author.expertiseLevel === 'expert' && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700 border border-blue-200 flex-shrink-0 ${isChild ? 'text-xs' : 'text-xs'}`}>
                認定エキスパート
              </span>
            )}
          </div>
          
          {/* 投稿日時 */}
          <p className={`text-gray-600 mb-3 ${isChild ? 'text-xs' : 'text-sm'}`}>
            {new Date(comment.createdAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
      
      {/* コメント本文 */}
      <div className={`${isChild ? 'ml-12' : 'ml-14'}`}>
        <p className={`text-gray-800 leading-relaxed mb-4 ${isChild ? 'text-sm' : 'text-sm'}`}>
          {comment.content && comment.content.length > 300 && !comment.showFullContent 
            ? `${comment.content.substring(0, 300)}...` 
            : comment.content}
        </p>
        
        {comment.content && comment.content.length > 300 && (
          <button
            onClick={() => onToggleFullContent(comment.id)}
            className={`mb-4 text-blue-600 hover:text-blue-800 font-medium underline ${isChild ? 'text-xs' : 'text-sm'}`}
          >
            {comment.showFullContent ? '折りたたむ' : '続きを表示'}
          </button>
        )}
        
        {/* いいね・閲覧数 */}
        <div className={`flex items-center gap-4 text-gray-500 ${isChild ? 'text-xs' : 'text-sm'}`}>
          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <svg className={`${isChild ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m7 10a1 1 0 01-1 1H9a1 1 0 01-1-1v-3m7 10v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3" />
            </svg>
            {comment.likeCount}
          </button>
          <span className="flex items-center gap-1">
            <svg className={`${isChild ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {comment.viewCount}
          </span>
        </div>
        
        {/* 子コメント表示（再帰的に表示） */}
        {comment.children && comment.children.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.children.map((childComment) => (
              <CommentCard
                key={childComment.id}
                comment={childComment}
                onToggleFullContent={onToggleFullContent}
                isChild={true}
                depth={currentDepth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// メインのArticleOverlayコンポーネント
export const ArticleOverlay: React.FC<ArticleOverlayProps> = ({ 
  article, 
  isOpen, 
  onClose 
}) => {
  // すべてのHooksを最初に宣言（順序を固定）
  const [commentSort, setCommentSort] = useState<CommentSortOption>('relevance');
  const [comments, setComments] = useState<ExpertComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);

  // コメントの表示状態を切り替える関数
  const handleToggleCommentFullContent = (commentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, showFullContent: !comment.showFullContent }
          : comment
      )
    );
  };

  // オーバーレイが開く時のアニメーション
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      setBackgroundOpacity(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(false);
          setBackgroundOpacity(50);
        });
      });
    } else {
      setIsVisible(false);
      setIsAnimating(false);
      setBackgroundOpacity(0);
    }
  }, [isOpen]);

  // コメント取得処理を追加
  useEffect(() => {
    if (isOpen && article) {
      // コメントを取得する関数
      const fetchComments = async () => {
        if (!article) return;
        
        setIsLoadingComments(true);
        try {
          devLog('コメント取得開始:', article.id);
          
          // バックエンドAPIからコメントを取得
          const fetchedComments = await getPolicyProposalComments(article.id);
          // devLog('取得されたコメント:', fetchedComments);
          
          // コメントデータをExpertComment形式に変換
          const convertedComments: ExpertComment[] = fetchedComments.map(comment => ({
            id: comment.id,
            author: {
              id: comment.author_id || 'unknown',
              name: comment.author_name || '匿名ユーザー',
              role: comment.author_type || '一般',
              company: '', // author_companyは存在しないため空文字
              badges: [],
              expertiseLevel: 'regular'
            },
            content: comment.comment_text,
            createdAt: comment.posted_at, // created_at → posted_at
            likeCount: 0, // like_countは存在しないため0
            viewCount: 0, // view_countは存在しないため0
            isLiked: false,
            parentCommentId: comment.parent_comment_id || null // 親コメントIDを設定
          }));
          
          setComments(convertedComments);
          // devLog('変換後のコメント:', convertedComments);
          
        } catch (error) {
          devError('コメント取得エラー:', error);
          
          // エラーの場合はサンプルコメントを使用（親子関係を含む）
          const sampleComments: ExpertComment[] = [
            {
              id: 'sample-1',
              author: {
                id: 'sample-user-1',
                name: 'メティ 太郎',
                role: 'staff',
                company: '中小企業庁',
                badges: [],
                expertiseLevel: 'expert'
              },
              content: 'コメントありがとうございます。貴重なご意見を頂き、大変感謝しております。本案の骨格が明確で実装を意識したものであるとのご指摘、特に国産セキュアクラウドの奨励やISMAP準拠についてご評価いただき、励みになります。具体的なロードマップや初年度の配分方針が現場にとっての助けになるとの点にも同意し、政策の実行に向けて着実に進めていく所存です。',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2時間前
              likeCount: 5,
              viewCount: 12,
              isLiked: false,
              parentCommentId: null
            },
            {
              id: 'sample-2',
              author: {
                id: 'sample-user-2',
                name: '政策専門家A',
                role: '専門家',
                company: '政策研究所',
                badges: [],
                expertiseLevel: 'expert'
              },
              content: 'この政策案は非常に興味深いアプローチですね。特に地域格差の是正という点で、実効性が期待できます。',
              createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4時間前
              likeCount: 8,
              viewCount: 15,
              isLiked: false,
              parentCommentId: null
            },
            {
              id: 'sample-3',
              author: {
                id: 'sample-user-3',
                name: 'システム 花子',
                role: 'contributor',
                company: 'デジタル庁',
                badges: [],
                expertiseLevel: 'regular'
              },
              content: 'メティ様のご指摘について、特に成果連動枠の部分に賛同いたします。実証実験の成果を具体的な数値で評価する仕組みが重要だと思います。',
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1時間前
              likeCount: 3,
              viewCount: 8,
              isLiked: false,
              parentCommentId: 'sample-1'
            },
            {
              id: 'sample-4',
              author: {
                id: 'sample-user-4',
                name: '田中 一郎',
                role: 'viewer',
                company: '民間企業',
                badges: [],
                expertiseLevel: 'regular'
              },
              content: '政策専門家Aさんのおっしゃる通りですね。地域格差の問題は深刻なので、このような取り組みは非常に価値があると思います。',
              createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30分前
              likeCount: 2,
              viewCount: 5,
              isLiked: false,
              parentCommentId: 'sample-2'
            },
            {
              id: 'sample-5',
              author: {
                id: 'sample-user-5',
                name: '佐藤 次郎',
                role: 'contributor',
                company: '総務省',
                badges: [],
                expertiseLevel: 'expert'
              },
              content: 'システム花子さんのご意見に追加で、評価指標の透明性も重要ですね。どのような基準で成果を判断するのか、事前に明示していただけると良いと思います。',
              createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20分前
              likeCount: 4,
              viewCount: 6,
              isLiked: false,
              parentCommentId: 'sample-3'
            }
          ];
          
          setComments(sampleComments);
        } finally {
          setIsLoadingComments(false);
        }
      };
      
      fetchComments();
    }
  }, [isOpen, article]);

  // コメント並び替え処理（階層構造を考慮）
  const sortedComments = useMemo(() => {
    if (!comments.length) return [];
    
    // まず階層構造を構築
    const commentTree = buildCommentTree(comments);
    
    // 親コメントのみを並び替え（子コメントは親コメント内で時系列順に表示）
    const sortedRootComments = [...commentTree].sort((a, b) => {
      switch (commentSort) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'likes':
          return b.likeCount - a.likeCount;
        case 'views':
          return b.viewCount - a.viewCount;
        case 'relevance':
        default:
          return 0;
      }
    });

    // 各親コメントの子コメントを時系列順（古い順）にソート
    const sortCommentsRecursively = (comment: ExpertComment): ExpertComment => {
      if (comment.children && comment.children.length > 0) {
        const sortedChildren = comment.children
          .map(sortCommentsRecursively)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        return { ...comment, children: sortedChildren };
      }
      return comment;
    };

    return sortedRootComments.map(sortCommentsRecursively);
  }, [comments, commentSort]);

  // オーバーレイを閉じる処理（アニメーション付き）
  const handleClose = () => {
    setIsAnimating(true);
    setBackgroundOpacity(0);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // 早期リターン（Hooksの後に配置）
  if (!isVisible || !article) {
    return null;
  }

  return (
    <>
      {/* オーバーレイの背景 - レスポンシブ対応 */}
      <div 
        className="fixed inset-0 bg-black transition-all duration-300 ease-in-out z-50"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity / 100})`
        }}
        onClick={handleClose}
      />
      
      {/* オーバーレイのコンテンツ - レスポンシブ対応 */}
      <div 
        className="fixed inset-0 sm:right-0 sm:left-auto top-0 h-full z-50 transform transition-all duration-300 ease-in-out"
        style={{
          transform: isAnimating ? 'translateX(100%)' : 'translateX(0%)'
        }}
      >
        {/* モバイル: 全画面、デスクトップ: 右側からスライド */}
        <div className="bg-white h-full w-full sm:w-[600px] md:w-[700px] lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] shadow-xl overflow-hidden sm:top-[5vh] sm:bottom-0">
          {/* ヘッダー部分 - レスポンシブ対応 */}
          <div className="flex items-center justify-between p-2 sm:p-3 border-b border-gray-200 bg-gray-50">
            <div></div>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              aria-label="オーバーレイを閉じる"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* コンテンツ部分 - レスポンシブ対応 */}
          <div className="h-[calc(100%-4rem)] overflow-y-auto">
            {/* 記事の詳細情報 - 画像のような形式 */}
            <div className="p-3 sm:p-4 md:p-5 lg:p-6">
              {/* メインタイトル */}
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
                {article.title}
              </h1>
              
              {/* メタデータ - 横並び */}
              <div className="flex flex-row items-center gap-4 mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base text-gray-600">
                <span className="font-medium">{article.department}</span>
                <span>{article.publishedAt}</span>
                <span>コメント: {article.commentCount} コメント</span>
                {article.attachments && article.attachments.length > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {article.attachments.length}個の添付ファイル
                  </span>
                )}
              </div>
              
              {/* 背景セクション */}
              <div className="mb-6 sm:mb-8">
                <div className="prose prose-sm sm:prose-base max-w-none">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {article.content ? article.content.substring(0, 100) + "..." : ""}
                  </p>
                </div>
              </div>
              
              {/* 詳細を見るボタン */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <button 
                  onClick={() => window.open(`/expert/articles/${article.id}`, '_blank')}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-[#2d8cd9] text-white rounded-full shadow-md hover:bg-[#58aadb] hover:shadow-lg transition-all duration-200 text-sm sm:text-base font-medium"
                >
                  詳細を見る
                </button>
              </div>
            </div>
            
            {/* コメントセクション - 画像のような形式 */}
            <div className="p-3 sm:p-4 md:p-5 lg:p-6">
              {/* コメント一覧ヘッダー */}
              <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">意見一覧</h3>
                </div>
                <CommentSortSelector 
                  currentSort={commentSort} 
                  onSortChange={setCommentSort} 
                />
              </div>
              
              {/* 境界線 */}
              <div className="border-b border-gray-200 mb-4 sm:mb-5 md:mb-6"></div>
              
              {/* コメント一覧 - レスポンシブ対応 */}
              <div className="space-y-3 sm:space-y-4">
                {isLoadingComments ? (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-500 text-sm sm:text-base">コメントを読み込み中...</p>
                  </div>
                ) : sortedComments.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="mb-3 sm:mb-4">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2 text-center">まだ意見が投稿されていません</h3>
                    <p className="text-gray-500 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed text-center">
                      最初の意見を投稿してみませんか？
                    </p>
                  </div>
                ) : (
                  sortedComments.map((comment) => (
                    <CommentCard 
                      key={comment.id} 
                      comment={comment} 
                      onToggleFullContent={handleToggleCommentFullContent}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// 記事カードコンポーネント（外部から呼び出し可能）
export const ArticleCard: React.FC<{
  article: ExpertArticle;
  onArticleClick: (article: ExpertArticle) => void;
}> = ({ article, onArticleClick }) => {
  return (
    <button
      onClick={() => onArticleClick(article)}
      className="block cursor-pointer h-[90px] w-[1200px] p-0 hover:bg-gray-50 transition-colors relative mx-auto"
      aria-label={`記事「${article.title}」を開く`}
    >
      <div className="flex flex-col font-['Noto_Sans_JP:DemiLight',_sans-serif] font-[350] h-[18px] justify-center text-[rgba(34,34,34,0.7)] text-left w-[250px] absolute top-[50px] left-0">
        <p 
          className="block leading-[16px] whitespace-nowrap overflow-hidden text-[11.95px]"
          style={{
            fontFamily: 'Noto Sans JP, sans-serif'
          }}
        >
          {article.department}
        </p>
      </div>
      
      <div className="flex flex-col font-['Noto_Sans_JP:DemiLight',_sans-serif] font-[350] h-[18px] justify-center text-[11.95px] text-[rgba(34,34,34,0.7)] text-left w-[100.562px] absolute top-[50px] left-[260px]">
        <p className="block leading-[16px]">{article.publishedAt}</p>
      </div>
      
      <div className="font-['Noto_Sans_JP:DemiLight',_sans-serif] font-[350] h-[39.826px] leading-[20px] text-[13px] text-[rgba(34,34,34,0.7)] text-left tracking-[0.4779px] w-[600px] absolute top-[11.95px] left-[430.92px]">
        <p className="adjustLetterSpacing block mb-0">{article.summary}</p>
      </div>
      
      <div className="h-[52.272px] w-[450px] absolute top-0 left-0">
        <div className="flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[0] text-[#707070] text-[16px] text-left top-[25.39px] tracking-[0.9911px] translate-y-[-50%] w-full absolute">
          <p className="adjustLetterSpacing block leading-[20px]">{article.title}</p>
        </div>
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        {/* 添付ファイルアイコン */}
        {article.attachments && article.attachments.length > 0 && (
          <div className="flex items-center gap-1 text-blue-600" title={`${article.attachments.length}個の添付ファイル`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">{article.attachments.length}</span>
          </div>
        )}
        
        <CommentCount 
          policyProposalId={article.id}
          className="text-[12px] text-gray-700 font-bold"
          showIcon={true}
        />
      </div>
      
      <div className="absolute flex h-[3.983px] items-center justify-center left-0 right-0 top-[85px]">
        <div className="flex-none h-[3.983px] scale-y-[-100%] w-full">
          <div className="relative size-full">
            <div
              aria-hidden="true"
              className="absolute border-[1.958px_0px_0px] border-[rgba(34,34,34,0.12)] border-solid inset-0 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </button>
  );
};
