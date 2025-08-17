"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExpertArticle, ExpertComment, CommentSortOption } from "@/types";
import { getArticleById, getArticleComments, sortComments } from "@/data/expert-articles-data";
import BackgroundEllipses from "@/components/blocks/BackgroundEllipses";

// 画像アセット（現在未使用）
// const imgUserIcon = "http://localhost:3845/assets/0046f2f481d47419a2b5046e941c98fae542e480.svg";

// コメントバッジコンポーネント
const CommentBadge = ({ badge }: { badge: { label: string; color: string; description: string } }) => {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
      style={{ backgroundColor: badge.color + '20', color: badge.color, border: `1px solid ${badge.color}40` }}
      title={badge.description}
    >
      {badge.label}
    </span>
  );
};

// 並び替えセレクターコンポーネント
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

// コメントカードコンポーネント
const CommentCard = ({ comment }: { comment: ExpertComment }) => {
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
          {comment.author.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{comment.author.name}</span>
              <span className="text-xs text-gray-500">{comment.author.role}</span>
            </div>
            {/* バッジの表示（右端） */}
            <div className="flex gap-1">
              {comment.author.badges.map((badge, index) => (
                <CommentBadge key={index} badge={badge} />
              ))}
            </div>
          </div>
          <span className="text-xs text-gray-500">{comment.createdAt}</span>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed ml-11">
        {comment.content}
      </p>
      <div className="flex items-center gap-2 mt-3 ml-11">
        <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-xs">{comment.likeCount}</span>
        </button>
      </div>
    </div>
  );
};

// 意見投稿フォームコンポーネント
const OpinionForm = ({ onSubmit, attachedFile }: { onSubmit: (content: string) => void; attachedFile: File | null }) => {
  const [content, setContent] = useState("");
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      setShowConfirmOverlay(true);
    }
  };

  const handleConfirmSubmit = () => {
    onSubmit(content);
    setContent("");
    setShowConfirmOverlay(false);
  };

  const handleCancelSubmit = () => {
    setShowConfirmOverlay(false);
  };

  return (
    <div>
      {/* 確認オーバーレイ */}
      {showConfirmOverlay && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-xl max-w-lg mx-4 overflow-hidden">
          {/* コンテンツ */}
          <div className="px-6 py-6">
              <p className="text-gray-600 mb-4 text-center font-bold text-sm">この内容で意見を投稿しますか？</p>
              
              {/* 意見内容 */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">意見内容</h4>
                <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
                </div>
              </div>
              
              {/* 添付資料 */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">添付資料</h4>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  {attachedFile ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700">{attachedFile.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">添付なし</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* ボタン */}
            <div className="px-6 py-3 bg-gray-50 flex gap-3">
              <button
                onClick={handleCancelSubmit}
                className="flex-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 px-3 py-1.5 bg-[#58aadb] text-white rounded-lg hover:bg-[#4a9bcc] transition-colors font-medium text-sm"
              >
                投稿する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#58aadb] rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-700">意見を投稿する</h3>
        </div>
      </div>
      
      {/* コンテンツエリア */}
      <div>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="あなたの意見を入力してください..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none bg-white text-sm"
            required
          />
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-white border border-[#58aadb] text-[#58aadb] px-6 py-2 rounded-lg hover:bg-[#58aadb]/10 transition-colors text-sm font-medium flex items-center gap-2"
            >
              投稿する
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 資料投稿フォームコンポーネント
const DocumentUploadForm = ({ onSubmit }: { onSubmit: (file: File) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputId = 'document-upload-input';

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      
      // ファイルサイズチェック（5MB制限）
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        alert('ファイルサイズが5MBを超えています');
        return;
      }
      
      // ファイル形式チェック
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('対応していないファイル形式です');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSubmit(file);
      setFile(null);
    }
  };

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#58aadb] rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-700">資料を添付する</h3>
        </div>
      </div>
      
      {/* コンテンツエリア */}
      <div>
        <div className="relative">
          <button
            type="button"
            onClick={() => document.getElementById(fileInputId)?.click()}
            className="relative block w-full h-48 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* ファイルアイコン */}
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-bold text-sm mb-1">資料選択</p>
              <p className="text-xs opacity-75">（1ファイル5MB以内）</p>
            </div>
          </button>
          
          <input
            id={fileInputId}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          
          {/* 選択済みファイルの表示 */}
          {file && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="ファイルを削除"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {file && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              className="bg-white border border-blue-400 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              アップロード
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 添付資料表示コンポーネント
const AttachedDocuments = ({ documents }: { documents: Array<{ name: string; url: string }> }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string } | null>(null);

  const handleDocumentClick = (doc: { name: string; url: string }) => {
    setSelectedDocument(doc);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedDocument(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">添付資料</h3>
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <button
              key={index}
              onClick={() => handleDocumentClick(doc)}
              className="block text-blue-600 hover:text-blue-800 underline text-sm text-left w-full"
            >
              {doc.name}
            </button>
          ))}
        </div>
      </div>

      {/* 添付資料オーバーレイ */}
      {isOverlayOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl relative">
            {/* 閉じるボタン - 右上に配置 */}
            <button
              onClick={closeOverlay}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 transition-colors bg-white rounded-full shadow-md"
              aria-label="オーバーレイを閉じる"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* コンテンツ */}
            <div className="p-6 overflow-y-auto max-h-[80vh] relative">
              <div className="bg-gray-100 rounded-lg p-8 text-center h-full">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 mb-4">PDFプレビュー</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// メインコンポーネント
export default function ExpertPostDetailPage({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [article, setArticle] = useState<ExpertArticle | null>(null);
  const [sortOption, setSortOption] = useState<CommentSortOption>('relevance');
  const [comments, setComments] = useState<ExpertComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // サンプル添付資料
  const attachedDocuments = [
    { name: "スタートアップ・中小企業支援PDF", url: "#" },
    { name: "支援制度詳細資料", url: "#" }
  ];

  // 記事データの取得
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleData = getArticleById(articleId);
        setArticle(articleData);
        
        const commentsData = getArticleComments(articleId);
        setComments(commentsData);
      } catch (error) {
        console.error("記事の取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  // コメントの並び替え
  const sortedComments = sortComments(comments, sortOption);

  // 意見投稿処理
  const handleOpinionSubmit = (content: string) => {
    // TODO: 実際のAPI呼び出しを実装
    console.log("意見投稿:", content);
    // 新しいコメントを追加
    const newComment: ExpertComment = {
      id: `comment-${Date.now()}`,
      author: {
        id: "current-user",
        name: "テックゼロ太郎",
        role: "エキスパート",
        company: "株式会社テックゼロ",
        badges: [
          {
            type: "expert",
            label: "認定エキスパート",
            color: "#4AA0E9",
            description: "認定されたエキスパート"
          }
        ],
        expertiseLevel: "expert"
      },
      content,
      createdAt: new Date().toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      likeCount: 0,
      viewCount: 0,
      isLiked: false
    };
    setComments(prev => [newComment, ...prev]);
  };

  // 資料投稿処理
  const handleDocumentSubmit = (file: File) => {
    // TODO: 実際のファイルアップロードAPIを実装
    console.log("資料投稿:", { file });
    setAttachedFile(file);
    alert("資料のアップロードが完了しました");
  };

  // ログアウト処理
  const handleLogout = () => {
    router.push("/login");
  };

  // ドロップダウンメニューを閉じる処理
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('.user-menu-container')) {
      setShowUserMenu(false);
    }
  };

  // クリックイベントリスナーの追加
  useEffect(() => {
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  if (isLoading) {
    return (
      <div className="bg-[#939393] relative size-full h-screen overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-[#939393] relative size-full h-screen overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg">記事が見つかりません</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#939393] relative size-full h-screen overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute bg-gradient-to-t from-[#b4d9d6] h-[400px] left-1/2 to-[#58aadb] top-0 translate-x-[-50%] w-[1440px]" />
      
      {/* 背景装飾 */}
      <BackgroundEllipses scale={0.8} />
      
      {/* ヘッダー */}
      <div className="absolute h-[29.446px] left-[68px] top-4 w-[1306.73px] z-10">
        
        <div className="absolute right-0 top-0 flex items-center gap-3 user-menu-container">
          <div className="font-['Montserrat:SemiBold',_'Noto_Sans_JP:Bold',_sans-serif] font-semibold text-[#ffffff] text-[12.62px] text-right text-nowrap tracking-[1.5144px]">
            <p className="adjustLetterSpacing block leading-[1.4] whitespace-pre">テックゼロ太郎さん</p>
          </div>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          
          {/* ユーザーメニュードロップダウン */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[400px] z-20">
              {/* 矢印 */}
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
              
              {/* メニュー項目 */}
              <div className="py-2">
                <div className="px-4 py-2">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l-1.5 1.5H6l-1.5-1.5V9.75a6 6 0 0 1 6-6z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">新着通知</span>
                  </div>
                  
                  {/* 通知リスト */}
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    <div className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#58aadb] rounded-full mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-900 mb-1">新しい政策案が投稿されました</p>
                          <p className="text-xs text-gray-600">「スタートアップ向け税制優遇措置の拡充」について新しい意見が投稿されました</p>
                          <p className="text-xs text-gray-500 mt-1">2時間前</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#58aadb] rounded-full mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-900 mb-1">コメントが追加されました</p>
                          <p className="text-xs text-gray-600">「地方スタートアップ育成ファンドの創設」に新しいコメントが追加されました</p>
                          <p className="text-xs text-gray-500 mt-1">5時間前</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-900 mb-1">新しい政策テーマが追加されました</p>
                          <p className="text-xs text-gray-600">「DX-デジタル変革」テーマに新しい記事が追加されました</p>
                          <p className="text-xs text-gray-500 mt-1">1日前</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    // TODO: プロフィール画面への遷移
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  プロフィール
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  ログアウト
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={() => router.push('/expert/articles')}
          className="absolute bottom-[-5.28%] font-['Montserrat:SemiBold',_sans-serif] font-semibold leading-[0] left-0 right-[90.82%] text-[#ffffff] text-[18.029px] text-left text-nowrap top-[20.38%] tracking-[2.1635px] hover:text-blue-200 transition-colors cursor-pointer"
        >
          <p className="adjustLetterSpacing block leading-[1.4] whitespace-pre">METI Picks</p>
        </button>
        

      </div>
      


      {/* メインコンテンツエリア - 2カラムレイアウト */}
      <div className="absolute left-0 top-[60px] right-0 bottom-0 bg-white">
        <div className="grid grid-cols-3 gap-8 h-full p-8 relative">
          {/* 左側: 記事詳細とコメント (2/3) */}
          <div className="col-span-2 space-y-6 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {/* 記事詳細 */}
            <div className="bg-white rounded-lg p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <span>{article.department}</span>
                <span>{article.publishedAt}</span>
                <span>コメント: {article.commentCount}件</span>
              </div>
              
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {article.content}
                </p>
              </div>

              {/* 添付資料 */}
              <AttachedDocuments documents={attachedDocuments} />
            </div>

            {/* コメントセクション */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900">注目のコメント</h3>
                </div>
                <CommentSortSelector 
                  currentSort={sortOption} 
                  onSortChange={setSortOption} 
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                {sortedComments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">まだ意見が投稿されていません</p>
                  </div>
                ) : (
                  <div>
                    {sortedComments.map((comment) => (
                      <CommentCard key={comment.id} comment={comment} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 区切り線 */}
          <div className="absolute left-[calc(66.666667%-1rem)] top-8 bottom-8 w-px bg-gray-200"></div>

          {/* 右側: 投稿フォーム (1/3) */}
          <div className="col-span-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="sticky top-8 space-y-6">
              <OpinionForm onSubmit={handleOpinionSubmit} attachedFile={attachedFile} />
              <DocumentUploadForm onSubmit={handleDocumentSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
