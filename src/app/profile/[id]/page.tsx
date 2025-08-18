"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { sampleExpertProfile } from "@/data";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { NetworkMap } from "@/components/ui/network-map";
import { ExpertInsightsOut, MeetingOverviewOut, PolicyProposalCommentOut, NetworkMapResponseDTO, stanceToLabel } from "@/types";
import { apiFetch } from "@/lib/apiClient";

// Finazch Dashboard inspired UI components

const CompactCard = ({ title, children }: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/95 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg flex flex-col h-full">
    <div className="p-3 border-b border-gray-200 flex-shrink-0">
      <h3 className="text-gray-800 font-semibold text-xs">{title}</h3>
    </div>
    <div className="p-3 flex-1 overflow-hidden">
      {children}
    </div>
  </div>
);

// 使われていないコンポーネントは削除

function formatDate(d: string | Date): string {
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return String(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const _id = params.id as string;

  // APIデータ
  const [insights, setInsights] = useState<ExpertInsightsOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkData, setNetworkData] = useState<NetworkMapResponseDTO | null>(null);

  // サンプルはフォールバック用途のみ
  const profile = sampleExpertProfile;

  // early return は Hooks の評価順序を乱すため使用しない

  const handleBackToSearch = () => {
    router.push('/search');
  };

  // インサイト取得
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<ExpertInsightsOut>(`/api/experts/${_id}/insights`, { method: 'GET' });
        setInsights(data);
        // TODO: 適切な人脈マップのデータ供給に置き換え
        setNetworkData({ policy_themes: [], experts: [], relations: [] });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : '取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    if (_id) run();
  }, [_id]);

  const meetingCards: MeetingOverviewOut[] = useMemo(() => insights?.meetings ?? [], [insights]);
  const policyCards: PolicyProposalCommentOut[] = useMemo(() => insights?.policy_comments ?? [], [insights]);
  const evalAvg = insights?.evaluation_average ?? null;

  return (
    <div className="h-screen w-full relative flex flex-col overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#b4d9d6] to-[#58aadb]" />
      
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
          
          <h1 className="font-semibold text-white text-sm tracking-wide">
            METI Picks
          </h1>
        </div>

        {/* Profile Header Card */}
        <div className="bg-black/5 backdrop-blur-sm rounded-xl px-4 py-2">
          <ProfileHeader
            name={insights?.experts_name || profile.name}
            affiliation={insights ? `${insights.company_name || ''}${insights.department ? ` / ${insights.department}` : ''}${insights.title ? ` / ${insights.title}` : ''}` : `${profile.currentInfo.company_name} / ${profile.currentInfo.current_department} / ${profile.currentInfo.current_title}`}
            evaluationAverage={evalAvg}
            email={insights?.email || profile.contactInfo.email}
            phone={insights?.mobile || profile.contactInfo.phone}
          />
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
                    {loading && <div className="text-xs text-gray-600">読み込み中...</div>}
                    {error && <div className="text-xs text-red-600">{error}</div>}
                    {meetingCards.map((m) => {
                      const first = (m.participants && m.participants.length > 0) ? m.participants[0] : null;
                      const participantDept = first?.department?.department_name || "";
                      const participantName = first ? `${first.last_name}${first.first_name}` : "";
                      const affiliationAtThatTime = [m.expert_company_name, m.expert_department_name, m.expert_title].filter(Boolean).join(' ');
                      return (
                        <div key={m.meeting_id} className="bg-gray-50 border border-gray-200 rounded p-2">
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
                    })}
                  </div>
                </CompactCard>
              </div>
            </div>

            {/* Middle Column - 政策意見のみ（活動情報削除） */}
            <div className="lg:col-span-1 h-full">
              <CompactCard title="政策意見">
                <div className="h-full overflow-y-auto space-y-1.5 custom-scrollbar">
                  {policyCards.map((p) => (
                    <div key={p.policy_proposal_id} className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
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
                  ))}
                </div>
              </CompactCard>
            </div>
 
            {/* Right Column - 人脈マップ（/search と同形式） */}
            <div className="lg:col-span-1 h-full">
              <CompactCard title="人脈マップ">
                <div className="h-full">
                  <NetworkMap filters={{ searchQuery: "", policyThemes: [], industries: [], positions: [] }} backendData={networkData} />
                </div>
              </CompactCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}