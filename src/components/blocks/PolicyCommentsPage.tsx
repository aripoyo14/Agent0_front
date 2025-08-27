"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PolicySubmission } from '@/types';
import { fetchMyPolicySubmissions } from '@/lib/policy-api';
import { organizeComments, isFeedbackSubmitted } from '@/lib/comments-api';
import { Card } from '@/components/ui/card';

import { CommentSkeletonList, PolicySubmissionSkeletonList } from '@/components/ui/skeleton';
import { SuccessMessage } from '@/components/ui/success-message';
import BackgroundEllipses from '@/components/blocks/BackgroundEllipses';
import { Header } from '@/components/ui/header';
import { usePolicyComments } from '@/hooks/usePolicyComments';
import { useFeedbackSubmission } from '@/hooks/useFeedbackSubmission';
import { CommentItem } from '@/components/blocks/policy-comments/CommentItem';
import { FilterTabs } from '@/components/blocks/policy-comments/FilterTabs';
import { EmptyState } from '@/components/blocks/policy-comments/EmptyState';

// 政策一覧のページネーション・フィルタリング用のカスタムフック
const usePolicyList = () => {
  const [policies, setPolicies] = useState<PolicySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  // 政策投稿履歴を取得
  useEffect(() => {
    const loadPolicySubmissions = async () => {
      try {
        setLoading(true);
        const data = await fetchMyPolicySubmissions();
        setPolicies(data);
      } catch (err) {
        console.error('政策投稿履歴取得エラー:', err);
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadPolicySubmissions();
  }, []);

  // フィルタリング・ソート・ページネーション
  const filteredPolicies = useMemo(() => {
    return policies.filter(policy =>
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [policies, searchTerm]);

  const sortedPolicies = useMemo(() => {
    return [...filteredPolicies].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, [filteredPolicies, sortBy]);

  const totalPages = Math.ceil(sortedPolicies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPolicies = sortedPolicies.slice(startIndex, endIndex);

  return {
    policies,
    loading,
    error,
    currentPolicies,
    sortedPolicies,
    currentPage,
    totalPages,
    itemsPerPage,
    searchTerm,
    sortBy,
    setCurrentPage,
    setSearchTerm,
    setSortBy,
  };
};

// メインページコンポーネント
export const PolicyCommentsPage = () => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all");
  
  // カスタムフックを使用
  const policyList = usePolicyList();
  const { comments, loading: commentsLoading, refreshComments } = usePolicyComments(selectedPolicyId);
  
  const { 
    isSubmitting, 
    submitFeedback, 
    successMessage, 
    successDescription, 
    showSuccessMessage, 
    clearSuccessMessage 
  } = useFeedbackSubmission(refreshComments);

  // 最初の政策を選択
  useEffect(() => {
    if (policyList.currentPolicies.length > 0 && !selectedPolicyId) {
      setSelectedPolicyId(policyList.currentPolicies[0].id);
    }
  }, [policyList.currentPolicies, selectedPolicyId]);

  // 検索やページ変更時に選択された政策が表示されない場合の処理
  useEffect(() => {
    if (selectedPolicyId && !policyList.currentPolicies.find(p => p.id === selectedPolicyId)) {
      if (policyList.currentPolicies.length > 0) {
        setSelectedPolicyId(policyList.currentPolicies[0].id);
      } else {
        setSelectedPolicyId("");
      }
    }
  }, [policyList.currentPolicies, selectedPolicyId, policyList]);

  // 検索時にページを1に戻す
  useEffect(() => {
    policyList.setCurrentPage(1);
  }, [policyList.searchTerm, policyList.sortBy, policyList]);

  // コメントを親コメントと返信に分類
  const { parentComments } = useMemo(() => 
    organizeComments(comments), [comments]
  );

  // フィルタリング（親コメントのみ）
  const filteredParentComments = useMemo(() => {
    return parentComments.filter(comment => {
      const isSubmitted = isFeedbackSubmitted(comment);
      switch (activeTab) {
        case "unfb":
          return !isSubmitted;
        case "fb":
          return isSubmitted;
        default:
          return true;
      }
    });
  }, [parentComments, activeTab]);

  // 件数計算（親コメントのみ）
  const counts = useMemo(() => ({
    all: parentComments.length,
    unfb: parentComments.filter(c => !isFeedbackSubmitted(c)).length,
    fb: parentComments.filter(c => isFeedbackSubmitted(c)).length,
  }), [parentComments]);

  const selectedPolicy = policyList.policies.find(p => p.id === selectedPolicyId);

  const handleViewComments = useCallback((policyId: string) => {
    setSelectedPolicyId(policyId);
  }, []);

  const handleFeedbackSubmit = useCallback(async (feedback: {
    commentId: string;
    overallRating: number;
    empathyRating: number;
    aiResponse: string;
  }) => {
    try {
      await submitFeedback(feedback);
    } catch (error) {
      console.error('フィードバック送信エラー:', error);
      alert('フィードバックの送信に失敗しました');
    }
  }, [submitFeedback]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 成功メッセージ */}
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          description={successDescription}
          onClose={clearSuccessMessage}
          autoHide={true}
          duration={4000}
        />
      )}
      
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

                {/* 検索・フィルタリング・ページネーション */}
                <PolicyListControls
                  searchTerm={policyList.searchTerm}
                  onSearchChange={policyList.setSearchTerm}
                  sortBy={policyList.sortBy}
                  onSortChange={policyList.setSortBy}
                  currentPage={policyList.currentPage}
                  totalPages={policyList.totalPages}
                  onPageChange={policyList.setCurrentPage}
                  totalItems={policyList.sortedPolicies.length}
                  itemsPerPage={policyList.itemsPerPage}
                />
                
                {policyList.loading ? (
                  <div className="animate-fade-in-up">
                    <PolicySubmissionSkeletonList count={5} />
                  </div>
                ) : policyList.error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{policyList.error}</p>
                  </div>
                ) : policyList.currentPolicies.length > 0 ? (
                  <div className="space-y-3">
                    {policyList.currentPolicies.map((policy, index) => (
                      <div 
                        key={policy.id} 
                        className={`animate-fade-in-up cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedPolicyId === policy.id 
                            ? 'bg-[#4AA0E9] text-white shadow-lg' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        } rounded-lg p-3 min-h-[80px] flex flex-col justify-between`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleViewComments(policy.id)}
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-sm font-semibold leading-tight ${
                              selectedPolicyId === policy.id ? 'text-white' : 'text-gray-900'
                            }`} style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {policy.title}
                            </h3>
                            <span className={`text-xs ml-2 flex-shrink-0 ${
                              selectedPolicyId === policy.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {policy.commentCount} コメント
                            </span>
                          </div>
                        </div>
                        <div className={`text-xs mt-auto ${
                          selectedPolicyId === policy.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {policy.submittedAt}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">政策が見つかりません</p>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* 右側: コメント一覧 */}
          <div className="xl:col-span-3 lg:col-span-2 order-1 lg:order-2">
            <Card className="p-4 lg:p-6 bg-white border-0">
              {policyList.loading ? (
                <div className="animate-fade-in-up">
                  <CommentSkeletonList count={3} />
                </div>
              ) : policyList.error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{policyList.error}</p>
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
                  <FilterTabs 
                    activeTab={activeTab} 
                    onChange={setActiveTab}
                    counts={counts}
                  />
                  
                  <div className="space-y-2">
                    {commentsLoading ? (
                      <div className="animate-fade-in-up">
                        <CommentSkeletonList count={3} />
                      </div>
                    ) : filteredParentComments.length > 0 ? (
                      <div className="space-y-4">
                        {filteredParentComments.map((comment, index) => (
                          <div 
                            key={comment.id} 
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <CommentItem 
                              comment={comment} 
                              onFeedbackSubmit={handleFeedbackSubmit}
                              isSubmitting={isSubmitting}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState activeTab={activeTab} />
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

// PolicyListControlsコンポーネント（既存のコードから移植）
const PolicyListControls = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: "date" | "title";
  onSortChange: (value: "date" | "title") => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-4 mb-6">
      {/* 検索バー */}
      <div className="relative">
        <input
          type="text"
          placeholder="政策を検索..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AA0E9] focus:border-transparent"
        />
        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* ソート・ページネーション */}
      <div className="flex justify-between items-center">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as "date" | "title")}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#4AA0E9] focus:border-transparent"
        >
          <option value="date">投稿日時順</option>
          <option value="title">タイトル順</option>
        </select>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{totalItems}件中 {startItem}-{endItem}件</span>
        </div>
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            前へ
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 text-sm border rounded ${
                  currentPage === page
                    ? 'bg-[#4AA0E9] text-white border-[#4AA0E9]'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
};