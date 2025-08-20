"use client";

import { useState, useEffect } from 'react';
import { PolicySubmission } from '@/types';
import { fetchMyPolicySubmissions } from '@/lib/policy-api';
import { fetchCommentsByPolicyId, Comment } from '@/lib/comments-api';
import { Card } from '@/components/ui/card';
import { CommentCount } from '@/components/ui/comment-count';
import { CommentSkeletonList } from '@/components/ui/skeleton';
import BackgroundEllipses from '@/components/blocks/BackgroundEllipses';
import { Header } from '@/components/ui/header';

// ステータスに応じた色とラベルを取得（現在は使用していないが将来の拡張用）
const _getStatusInfo = (status: PolicySubmission['status']) => {
  switch (status) {
    case 'draft':
      return { label: '下書き', color: 'bg-gray-500' };
    case 'submitted':
      return { label: '投稿済み', color: 'bg-blue-500' };
    case 'under_review':
      return { label: '審査中', color: 'bg-yellow-500' };
    case 'approved':
      return { label: '承認済み', color: 'bg-green-500' };
    case 'rejected':
      return { label: '却下', color: 'bg-red-500' };
    default:
      return { label: '不明', color: 'bg-gray-500' };
  }
};

// フィルタタブコンポーネント
const tabs = [
  { id: "all", label: "すべて" },
  { id: "unfb", label: "未FBのみ" },
  { id: "fb", label: "FB済みのみ" },
];

const SimpleTabs = ({ activeTab, onChange, counts }: {
  activeTab: string;
  onChange: (id: string) => void;
  counts: { all: number; unfb: number; fb: number; };
}) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => {
        const count = counts[tab.id as keyof typeof counts];
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? "border-b-2 border-[#4AA0E9] text-[#4AA0E9]" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {count > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// 評価ボタンコンポーネント
const RatingButtons = ({ 
  value, 
  onChange, 
  label,
  description,
  leftLabel,
  rightLabel
}: { 
  value: number; 
  onChange: (value: number) => void; 
  label: string;
  description?: string;
  leftLabel?: string;
  rightLabel?: string;
}) => {
  return (
    <div className="space-y-2">
              <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700 min-w-[80px]">{label}:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <div key={rating} className="flex flex-col items-center">
                <button
                  onClick={() => onChange(rating)}
                  className={`w-6 h-6 rounded border transition-all hover:scale-105 ${
                    value >= rating
                      ? 'bg-[#4AA0E9] border-[#4AA0E9] text-white shadow-sm'
                      : 'bg-white border-gray-300 text-gray-400 hover:border-[#4AA0E9] hover:text-[#4AA0E9]'
                  } flex items-center justify-center text-xs font-bold`}
                >
                  {rating}
                </button>
                                 {rating === 1 && leftLabel && (
                   <span className="text-[8px] text-gray-500 mt-1 font-bold">{leftLabel}</span>
                 )}
                 {rating === 5 && rightLabel && (
                   <span className="text-[8px] text-gray-500 mt-1 font-bold">{rightLabel}</span>
                 )}
              </div>
            ))}
          </div>

        </div>
      
      {description && (
        <p className="text-xs text-gray-600 leading-tight">{description}</p>
      )}
      

    </div>
  );
};

// コメント評価・返信フォームコンポーネント（詳細ビュー）
const CommentFeedbackForm = ({ 
  commentId, 
  onSubmit,
  onClose
}: { 
  commentId: string; 
  onSubmit: (feedback: {
    commentId: string;
    overallRating: number;
    empathyRating: number;
    aiResponse: string;
  }) => void;
  onClose: () => void;
}) => {
  const [overallRating, setOverallRating] = useState(0);
  const [empathyRating, setEmpathyRating] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [evaluationSaved, setEvaluationSaved] = useState(false);
  const [_feedbackSaved, setFeedbackSaved] = useState(false);

  const handleGenerateAIResponse = async () => {
    setIsGenerating(true);
    // TODO: 実際のAI API呼び出しを実装
    setTimeout(() => {
      setAiResponse('このコメントに対して建設的なフィードバックを提供いたします。提案された内容は非常に興味深く、特に実装可能性について詳細な検討が必要です。');
      setIsGenerating(false);
    }, 2000);
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    // TODO: 実際のAI API呼び出しを実装（別案生成）
    setTimeout(() => {
      setAiResponse('別の視点からのフィードバックを提供いたします。ご提案の背景と実現可能性について、さらに詳しく検討する必要があります。');
      setIsGenerating(false);
    }, 2000);
  };

  const handleSaveEvaluation = () => {
    if (overallRating > 0 && empathyRating > 0) {
      // TODO: 評価データを内部DBに保存
      console.log('評価保存:', { overallRating, empathyRating });
      setEvaluationSaved(true);
    }
  };

  const _handleSaveFeedback = () => {
    if (aiResponse.trim()) {
      // TODO: AI返信をコメントとして投稿
      console.log('フィードバック保存:', { aiResponse });
      setFeedbackSaved(true);
    }
  };

  const handleSubmit = () => {
    if (overallRating > 0 && empathyRating > 0 && aiResponse.trim()) {
      onSubmit({
        commentId,
        overallRating,
        empathyRating,
        aiResponse
      });
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">意見の評価・返信</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 評価セクション */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">内部評価（非公開）</h4>
        <div className="grid grid-cols-3 gap-4 items-start">
          <RatingButtons 
            value={overallRating} 
            onChange={setOverallRating} 
            label="意見の総合評価"
            leftLabel="低い"
            rightLabel="高い"
          />
          <RatingButtons 
            value={empathyRating} 
            onChange={setEmpathyRating} 
            label="政策への共感度"
            leftLabel="否定的"
            rightLabel="肯定的"
          />
          <div className="flex justify-end items-end h-full">
            <button
              onClick={handleSaveEvaluation}
              disabled={overallRating === 0 || empathyRating === 0}
              className="px-3 py-1.5 bg-[#4AA0E9] text-white text-xs rounded hover:bg-[#3a8fd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {evaluationSaved ? '• 評価保存済み' : '評価のみ保存'}
            </button>
          </div>
        </div>
      </div>

      {/* AI返信セクション */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-900">フィードバック返信（公開）</h4>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateAIResponse}
              disabled={isGenerating}
              className="px-3 py-1.5 border border-[#4AA0E9] text-[#4AA0E9] text-xs rounded hover:bg-[#4AA0E9]/10 transition-colors disabled:opacity-50"
            >
              {isGenerating ? '生成中...' : 'AIフィードバックを生成'}
            </button>
            {aiResponse && (
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {isGenerating ? '生成中...' : '再生成'}
              </button>
            )}
          </div>
        </div>
        
        <textarea
          value={aiResponse}
          onChange={(e) => setAiResponse(e.target.value)}
          placeholder="AIによって生成されたフィードバックが表示されます。編集してから投稿してください。"
          className="w-full h-24 p-3 border border-[#4AA0E9]/30 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#4AA0E9]/20"
        />
      </div>

      {/* アクションボタン */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors text-xs"
        >
          キャンセル
        </button>

        <button
          onClick={handleSubmit}
          disabled={overallRating === 0 || empathyRating === 0 || !aiResponse.trim()}
          className="px-2 py-1 bg-[#4AA0E9] text-white text-xs rounded hover:bg-[#3a8fd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          投稿
        </button>
      </div>
    </div>
  );
};

// 政策投稿カードコンポーネント
const PolicySubmissionCard = ({ 
  policy, 
  onViewComments,
  isSelected = false
}: { 
  policy: PolicySubmission;
  onViewComments: (policyId: string) => void;
  isSelected?: boolean;
}) => {
  return (
    <div 
      className={`p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'bg-[#4AA0E9]/10 border-l-4 border-[#4AA0E9]' 
          : 'hover:bg-gray-50'
      }`}
      onClick={() => onViewComments(policy.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-sm font-medium ${isSelected ? 'text-[#4AA0E9]' : 'text-gray-700'} line-clamp-2`}>
          {policy.title}
        </h3>
      </div>
      
      <div className="text-sm text-gray-500 mb-2">
        {policy.submittedAt}
      </div>
      
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <span>
          コメント: <CommentCount 
            policyProposalId={policy.id}
            className="text-gray-500"
            showIcon={false}
          />
        </span>
        {policy.attachedFiles && policy.attachedFiles.length > 0 && (
          <span>添付ファイル: {policy.attachedFiles.length}件</span>
        )}
      </div>
    </div>
  );
};

// コメント表示コンポーネント（一覧ビュー）
const CommentItem = ({ 
  comment, 
  onFeedbackSubmit,
  isFeedbackSubmitted = false
}: { 
  comment: Comment; 
  onFeedbackSubmit: (feedback: {
    commentId: string;
    overallRating: number;
    empathyRating: number;
    aiResponse: string;
  }) => void;
  isFeedbackSubmitted?: boolean;
}) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  return (
    <div className="bg-white p-4 mb-4 relative rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-gray-200">
      {/* ステータス表示 */}
      {isFeedbackSubmitted && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center justify-center rounded-md bg-[#4AA0E9] text-white text-xs px-2 py-0.5 font-medium">
            • 評価保存済み
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-base text-gray-900 leading-tight mb-1">{comment.author_name}</div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 leading-tight">{comment.author_type}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 leading-tight">{new Date(comment.posted_at).toLocaleDateString('ja-JP')}</span>
          </div>
        </div>
        {!isFeedbackSubmitted && (
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="px-3 py-1 bg-[#4AA0E9] text-white text-xs rounded hover:bg-[#3a8fd9] transition-colors"
          >
            フィードバックを追加
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{comment.comment_text}</p>
      


      {/* フィードバックフォーム（展開形式） */}
      {showFeedbackForm && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <CommentFeedbackForm 
            commentId={comment.id} 
            onSubmit={(feedback) => {
              onFeedbackSubmit(feedback);
              setShowFeedbackForm(false);
            }}
            onClose={() => setShowFeedbackForm(false)}
          />
        </div>
      )}
    </div>
  );
};

// メインページコンポーネント
export const PolicyCommentsPage = () => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("");
  const [policies, setPolicies] = useState<PolicySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<Set<string>>(new Set());
  
  // 政策投稿履歴を取得
  useEffect(() => {
    const loadPolicySubmissions = async () => {
      try {
        setLoading(true);
        const data = await fetchMyPolicySubmissions();
        setPolicies(data);
        
        // 最初の政策を選択
        if (data.length > 0 && !selectedPolicyId) {
          setSelectedPolicyId(data[0].id);
        }
      } catch (err) {
        console.error('政策投稿履歴取得エラー:', err);
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadPolicySubmissions();
  }, []);


  
  const handleViewComments = (policyId: string) => {
    setSelectedPolicyId(policyId);
  };

  const handleFeedbackSubmit = (feedback: {
    commentId: string;
    overallRating: number;
    empathyRating: number;
    aiResponse: string;
  }) => {
    // TODO: 実際のAPI呼び出しを実装
    console.log('フィードバック送信:', feedback);
    
    // 評価データを内部DBに保存
    // AI返信をコメントとして投稿
    
    // ステータスを更新
    setFeedbackSubmitted(prev => new Set(prev).add(feedback.commentId));
  };
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  
  const selectedPolicy = policies.find(p => p.id === selectedPolicyId);
  
  // コメントを取得
  useEffect(() => {
    if (selectedPolicyId) {
      const loadComments = async () => {
        setCommentsLoading(true);
        setComments([]); // 新しい政策を選択したら一旦クリア
        try {
          // 少し遅延を入れてローディング状態を見せる
          await new Promise(resolve => setTimeout(resolve, 300));
          const fetchedComments = await fetchCommentsByPolicyId(selectedPolicyId);
          setComments(fetchedComments);
        } catch (error) {
          console.error('コメント取得エラー:', error);
          setComments([]);
        } finally {
          setCommentsLoading(false);
        }
      };
      
      loadComments();
    }
  }, [selectedPolicyId]);
  
  // フィルタリング
  const filteredComments = comments.filter(comment => {
    const isSubmitted = feedbackSubmitted.has(comment.id);
    switch (activeTab) {
      case "unfb":
        return !isSubmitted;
      case "fb":
        return isSubmitted;
      default:
        return true;
    }
  });

  // 件数計算
  const counts = {
    all: comments.length,
    unfb: comments.filter(c => !feedbackSubmitted.has(c.id)).length,
    fb: comments.filter(c => feedbackSubmitted.has(c.id)).length,
  };
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9]" />
      
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

      {/* 背景装飾 */}
      <BackgroundEllipses scale={0.8} />

      {/* 統一されたヘッダー */}
      <Header />
      
      {/* メインコンテンツエリア */}
      <div className="relative z-10 flex-1 px-6 lg:px-12 pb-6 pt-32">
        <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 gap-4 lg:gap-8">
          {/* 左側: 投稿履歴 */}
          <div className="xl:col-span-1 lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-8">
              <Card className="p-4 lg:p-6 bg-white border-0">
                <div className="flex justify-between items-center mb-4 lg:mb-6">
                  <h2 className="text-sm lg:text-base font-bold text-gray-400 tracking-[2px]">
                    投稿履歴一覧
                  </h2>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center space-x-1 text-[#4AA0E9] text-xs hover:text-[#3a8fd9] transition-colors"
                  >
                    <span>↑</span>
                    <span>TOPに戻る</span>
                  </button>
                </div>
                
                {loading ? (
                  <div className="animate-fade-in-up">
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2 animate-pulse-slow" style={{ width: '60%' }} />
                              <div className="flex items-center space-x-2">
                                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse-slow" style={{ width: '40%' }} />
                                <div className="h-3 w-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse-slow" />
                                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse-slow" style={{ width: '30%' }} />
                              </div>
                            </div>
                            <div className="h-8 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse-slow" />
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse-slow" />
                            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse-slow" style={{ width: '95%' }} />
                            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse-slow" style={{ width: '85%' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-2 px-3 py-1 bg-[#4AA0E9] text-white text-xs rounded hover:bg-[#3a8fd9] transition-colors"
                    >
                      再試行
                    </button>
                  </div>
                ) : policies.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">投稿履歴がありません</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {policies.map((policy) => (
                      <PolicySubmissionCard 
                        key={policy.id} 
                        policy={policy} 
                        onViewComments={handleViewComments}
                        isSelected={policy.id === selectedPolicyId}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
          
          {/* 右側: コメントエリア */}
          <div className="xl:col-span-3 lg:col-span-2 order-1 lg:order-2">
            <Card className="p-6 bg-white border-0">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">読み込み中...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : selectedPolicy ? (
                <>
                  <div className="mb-8">
                    {/* 政策タイトル */}
                    <h1 className="text-2xl font-bold text-[#4AA0E9] mb-3 leading-tight">
                      {selectedPolicy.title}
                    </h1>
                    
                    {/* メタ情報 */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                      <span className="font-medium">中小企業庁 産業事業支援課</span>
                      <span className="text-gray-400">•</span>
                      <span>{selectedPolicy.submittedAt}</span>
                    </div>
                    
                    {/* 政策概要 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">概要</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedPolicy.content}</p>
                    </div>
                  </div>
                  
                  {/* フィルタタブ */}
                  <SimpleTabs 
                    activeTab={activeTab} 
                    onChange={setActiveTab}
                    counts={counts}
                  />
                  
                  <div className="space-y-2">
                    {commentsLoading ? (
                      <div className="animate-fade-in-up">
                        <CommentSkeletonList count={3} />
                      </div>
                    ) : filteredComments.length > 0 ? (
                      <div className="space-y-4">
                        {filteredComments.map((comment, index) => (
                          <div 
                            key={comment.id} 
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <CommentItem 
                              comment={comment} 
                              onFeedbackSubmit={handleFeedbackSubmit}
                              isFeedbackSubmitted={feedbackSubmitted.has(comment.id)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 animate-fade-in-up">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {activeTab === "all" 
                                ? "まだコメントがありません" 
                                : activeTab === "unfb" 
                                ? "未対応のコメントはありません"
                                : "対応済みのコメントはありません"
                              }
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {activeTab === "all" 
                                ? "この政策に対するコメントがまだ投稿されていません。"
                                : activeTab === "unfb" 
                                ? "すべてのコメントが対応済みです。"
                                : "まだ対応していないコメントはありません。"
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">政策を選択してください</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
