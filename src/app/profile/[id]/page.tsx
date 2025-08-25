"use client";

import { useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileNetworkRoutes } from "@/components/ui/profile-network-routes";
import { MeetingOverviewOut, PolicyProposalCommentOut, stanceToLabel } from "@/types";
import BackgroundEllipses from "@/components/blocks/BackgroundEllipses";
import { useNetworkData } from "@/hooks/useNetworkData";
import { useProfilePage } from "./hooks/useProfilePage";
import { MeetingSkeletonCard, PolicySkeletonCard, ProfileHeaderSkeleton } from "./components/ProfileSkeletons";
import { EmptyState, ErrorState, LoadingState } from "./components/ProfileStates";
import { CompactCard } from "./components/ProfileCards";
import { formatDate, getAffiliationText, getMeetingAffiliationText } from "./utils/profileUtils";






export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const _id = params.id as string;

  // 人脈マップデータ
  const { data: networkData, loading: networkLoading, error: networkError } = useNetworkData(_id);
  
  // プロフィールページ専用フック
  const {
    insights,
    loading,
    error,
    showHeader,
    showMeetings,
    showPolicies,
    showNetwork,
    handleRetry
  } = useProfilePage(_id, networkLoading);

  const handleBackToSearch = useCallback(() => {
    router.push('/search');
  }, [router]);

  const meetingCards: MeetingOverviewOut[] = useMemo(() => insights?.meetings ?? [], [insights]);
  const policyCards: PolicyProposalCommentOut[] = useMemo(() => insights?.policy_comments ?? [], [insights]);
  const evalAvg = insights?.evaluation_average ?? null;

  return (
    <div className="h-screen w-full relative flex flex-col overflow-hidden">
      {/* Background gradient */}
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
      
      {/* Header */}
      <div className="relative z-10 px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBackToSearch}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span className="font-medium text-xs">検索に戻る</span>
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="font-semibold text-white text-sm tracking-wide hover:text-white/80 transition-colors cursor-pointer"
          >
            METI Picks
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-black/5 backdrop-blur-sm rounded-xl px-4 py-2">
          {loading ? (
            <ProfileHeaderSkeleton />
          ) : error ? (
            <ErrorState 
              message="データの読み込みに失敗しました"
              onRetry={handleRetry}
            />
          ) : insights && showHeader ? (
            <div className="fade-in">
              <ProfileHeader
                name={insights.experts_name || '名前がありません'}
                affiliation={getAffiliationText(insights)}
                evaluationAverage={evalAvg}
                email={insights.email || ''}
                phone={insights.mobile || ''}
              />
            </div>
          ) : (
            <ProfileHeaderSkeleton />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-6 lg:px-8 pb-4 overflow-hidden">
        <div className="h-full overflow-hidden">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            
            {/* Left Column - 面談記録のみ（経歴情報削除） */}
            <div className="lg:col-span-1 h-full">
              <div className="h-full">
                <CompactCard title="面談記録">
                  <div className="h-full overflow-y-auto space-y-2 custom-scrollbar">
                                      {loading ? (
                    <div className="space-y-2">
                      <MeetingSkeletonCard />
                      <MeetingSkeletonCard />
                      <MeetingSkeletonCard />
                    </div>
                  ) : error ? (
                    <ErrorState 
                      message="面談記録の読み込みに失敗しました"
                      onRetry={handleRetry}
                    />
                                    ) : insights && meetingCards.length === 0 ? (
                    showMeetings ? (
                      <EmptyState 
                        icon="description"
                        message="面談記録がありません"
                      />
                    ) : null
                  ) : insights ? (
                    showMeetings ? (
                      meetingCards.map((m, index) => {
                        const first = (m.participants && m.participants.length > 0) ? m.participants[0] : null;
                        const participantDept = first?.department?.department_name || "";
                        const participantName = first ? `${first.last_name}${first.first_name}` : "";
                        const affiliationAtThatTime = getMeetingAffiliationText(m);
                        return (
                          <div 
                            key={m.meeting_id} 
                            className="bg-gray-50 border border-gray-200 rounded p-2"
                          >
                            {/* タイトルの上: 面談日付 + 当時の所属・役職（右側） */}
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-600 text-[10px]">{formatDate(m.meeting_date)}</span>
                              <span className="text-gray-600 text-[10px]">
                                当時の所属・役職：{affiliationAtThatTime || '-'}
                              </span>
                            </div>
                            {/* タイトル */}
                            <h4 className="text-gray-900 text-xs font-semibold mb-0.5">{m.title}</h4>
                            {/* タイトルの下: 評価・スタンス */}
                            <div className="flex items-center gap-2 text-[10px] text-gray-700 mb-1">
                              <span>評価: {m.evaluation ?? '-'} / 5</span>
                              <span>スタンス: {stanceToLabel(m.stance)}</span>
                            </div>
                            {/* 面談した職員（名前＋当時の所属） */}
                            {(participantDept || participantName) && (
                              <div className="text-blue-600 text-[10px] font-semibold mb-1">
                                {participantDept ? `${participantDept} ` : ''}{participantName}
                              </div>
                            )}
                            {/* 要約 */}
                            {m.summary && (
                              <p className="text-gray-700 text-[10px] leading-tight line-clamp-3">{m.summary}</p>
                            )}
                          </div>
                        );
                      })
                    ) : null
                  ) : (
                    <div className="space-y-2">
                      <MeetingSkeletonCard />
                      <MeetingSkeletonCard />
                      <MeetingSkeletonCard />
                    </div>
                  )}
                </div>
              </CompactCard>
              </div>
            </div>

            {/* Middle Column - 政策意見のみ（活動情報削除） */}
            <div className="lg:col-span-1 h-full">
              <CompactCard title="政策意見">
                <div className="h-full overflow-y-auto space-y-1.5 custom-scrollbar">
                  {loading ? (
                    <div className="space-y-1.5">
                      <PolicySkeletonCard />
                      <PolicySkeletonCard />
                      <PolicySkeletonCard />
                    </div>
                                      ) : error ? (
                      <ErrorState 
                        message="政策意見の読み込みに失敗しました"
                        onRetry={handleRetry}
                      />
                  ) : insights && policyCards.length === 0 ? (
                    showPolicies ? (
                      <EmptyState 
                        icon="comment"
                        message="政策意見がありません"
                      />
                    ) : null
                  ) : insights ? (
                    showPolicies ? (
                      policyCards.map((p, index) => (
                        <div 
                          key={p.policy_proposal_id} 
                          className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            {/* タイトルの上: 投稿日 */}
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-gray-600 text-[10px]">{formatDate(p.posted_at)}</span>
                            </div>
                            {/* タイトル */}
                            <h4 className="text-gray-900 text-xs font-semibold mb-0.5">{p.policy_title}</h4>
                            {/* タイトルの下: 評価・スタンス */}
                            <div className="flex items-center gap-2 text-[10px] text-gray-700 mb-1">
                              <span>評価: {p.evaluation ?? '-'} / 5</span>
                              <span>スタンス: {stanceToLabel(p.stance)}</span>
                            </div>
                            {/* コメント本文ダイジェスト */}
                            <p className="text-gray-700 text-[10px] leading-tight line-clamp-3">{p.comment_text}</p>
                          </div>
                        </div>
                      ))
                    ) : null
                  ) : (
                    <div className="space-y-1.5">
                      <PolicySkeletonCard />
                      <PolicySkeletonCard />
                      <PolicySkeletonCard />
                    </div>
                  )}
                </div>
              </CompactCard>
            </div>
 
            {/* Right Column - 人脈マップ（/search と同形式） */}
            <div className="lg:col-span-1 h-full">
              <CompactCard title="人脈マップ">
                <div className="h-full">
                  {loading || networkLoading ? (
                    <LoadingState 
                      message="人脈マップを読み込み中..."
                      icon="hub"
                    />
                  ) : error || networkError ? (
                    <ErrorState 
                      message="人脈マップの読み込みに失敗しました"
                      onRetry={handleRetry}
                    />
                  ) : showNetwork ? (
                    <div className="h-full">
                      <ProfileNetworkRoutes 
                        expertId={_id} 
                        data={networkData}
                      />
                    </div>
                  ) : null}
                </div>
              </CompactCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}