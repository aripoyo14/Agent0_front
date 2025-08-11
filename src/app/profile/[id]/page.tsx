"use client";

import { useParams, useRouter } from 'next/navigation';
import { sampleExpertProfile } from "@/data";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

// Finazch Dashboard inspired UI components

const CompactCard = ({ title, children }: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/95 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg flex flex-col">
    <div className="p-3 border-b border-gray-200 flex-shrink-0">
      <h3 className="text-gray-800 font-semibold text-xs">{title}</h3>
    </div>
    <div className="p-3">
      {children}
    </div>
  </div>
);

const ActivityItem = ({ category, title, date, description }: {
  category: string;
  title: string;
  date: string;
  description: string;
}) => (
  <div 
    className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
    onClick={() => {
      // 詳細表示のロジックをここに追加
      console.log('Activity clicked:', { category, title, date, description });
      // 例: モーダル表示、詳細ページ遷移など
    }}
  >
    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs font-medium text-[10px]">
          {category}
        </span>
        <span className="text-gray-600 text-[10px]">{date}</span>
      </div>
      <h4 className="text-gray-900 text-xs font-semibold mb-0.5">{title}</h4>
      <p className="text-gray-700 text-[10px] leading-tight">{description}</p>
    </div>
  </div>
);

const PersonItem = ({ name, role, company }: {
  name: string;
  role: string;
  company?: string;
}) => (
  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
      {name.charAt(0)}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-gray-900 text-xs font-semibold">{name}</h4>
      <p className="text-gray-600 text-[10px]">{company ? `${role} at ${company}` : role}</p>
    </div>
  </div>
);

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const _id = params.id as string;

  // Sample data mapping (in real app, fetch by ID)
  const profile = sampleExpertProfile;

  if (!profile) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-t from-[#b4d9d6] to-[#58aadb]">
        <div className="text-white text-sm">プロフィールが見つかりません</div>
      </div>
    );
  }

  const handleBackToSearch = () => {
    router.push('/search');
  };

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
          <ProfileHeader name={profile.name} skillTags={profile.skillTags} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-6 lg:px-8 pb-4 overflow-hidden">
        <div className="h-full overflow-hidden">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            
            {/* Left Column - Career & Contact */}
            <div className="lg:col-span-4 flex flex-col gap-3 h-full">
              
              {/* Career Information */}
              <div className="flex-shrink-0">
                <CompactCard title="経歴情報">
                  <div className="max-h-45 overflow-y-auto space-y-2 custom-scrollbar">
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          最新
                        </span>
                        <span className="text-blue-600 text-[10px]">
                          {profile.currentInfo.exchange_date}
                        </span>
                      </div>
                      <h4 className="text-gray-900 font-semibold text-xs mb-0.5">
                        {profile.currentInfo.company_name}
                      </h4>
                      <p className="text-gray-700 text-[10px] mb-0.5">
                        {profile.currentInfo.current_department}
                      </p>
                      <p className="text-blue-600 text-[10px] font-medium">
                        {profile.currentInfo.current_title}
                      </p>
                    </div>
                    
                    {profile.pastBusinessCards.length > 0 && (
                      <div className="space-y-1">
                        <h5 className="text-gray-800 text-[10px] font-semibold">過去の経歴</h5>
                        {profile.pastBusinessCards.map((card, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded p-2">
                            <div className="flex justify-between items-start mb-0.5">
                              <h4 className="text-gray-900 text-xs font-semibold">{card.company_name}</h4>
                              <span className="text-gray-600 text-[10px]">{card.exchange_date}</span>
                            </div>
                            <p className="text-gray-700 text-[10px]">{card.department_at_time}</p>
                            <p className="text-gray-700 text-[10px]">{card.title_at_time}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CompactCard>
              </div>

              {/* Meeting Records */}
              <div className="flex-shrink-0">
                <CompactCard title="面談記録">
                  <div className="max-h-45 overflow-y-auto space-y-2 custom-scrollbar">
                    {profile.meetingRecords.map((record) => (
                      <div key={record.id} className="bg-gray-50 border border-gray-200 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          {record.isLatest && (
                            <span className="bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold">
                              最新
                            </span>
                          )}
                          <span className="text-gray-600 text-[10px]">{record.date}</span>
                        </div>
                        <h4 className="text-gray-900 text-xs font-semibold mb-0.5">{record.title}</h4>
                        <p className="text-blue-600 text-[10px] mb-1 font-medium">{record.user}</p>
                        <p className="text-gray-700 text-[10px] leading-tight line-clamp-3">
                          {record.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </CompactCard>
              </div>


            </div>

            {/* Middle Column - Activities */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="bg-white/95 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg flex flex-col">
                <div className="p-3 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
                  <h3 className="text-gray-800 font-semibold text-xs">活動情報</h3>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-1.5 py-0 rounded text-[10px] font-medium transition-colors">
                    最新情報取得
                  </button>
                </div>
                <div className="p-3">
                  <div className="max-h-45 overflow-y-auto space-y-1.5 custom-scrollbar">
                  {profile.activities.map((activity, index) => (
                    <ActivityItem
                      key={index}
                      category={activity.category}
                      title={activity.title}
                      date={activity.date}
                                            description={activity.details}
                    />
                  ))}
                  </div>
                </div>
              </div>

              {/* Policy Opinions */}
              <CompactCard title="政策意見">
                <div className="max-h-45 overflow-y-auto space-y-1.5 custom-scrollbar">
                  {/* 政策意見データがある場合の表示例 */}
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="bg-green-500 text-white px-1 py-0.5 rounded text-xs font-medium text-[10px]">
                          政策提案
                        </span>
                        <span className="text-gray-600 text-[10px]">2025/01/15</span>
                      </div>
                      <h4 className="text-gray-900 text-xs font-semibold mb-0.5">スタートアップ支援政策に関する意見</h4>
                      <p className="text-gray-700 text-[10px] leading-tight">新規事業創出における規制緩和と税制優遇措置について具体的な提案をいただきました。特に...</p>
                    </div>
                  </div>
                </div>
              </CompactCard>
            </div>

            {/* Right Column - Contacts & People */}
            <div className="lg:col-span-3">
              <div className="bg-white/95 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg max-h-126 flex flex-col">
                <div className="p-3 border-b border-gray-200 flex-shrink-0">
                  <h3 className="text-gray-800 font-semibold text-xs">人物・連絡先</h3>
                </div>
                <div className="p-3 flex-1 overflow-hidden">
                                  <div className="max-h-115 overflow-y-auto space-y-4 custom-scrollbar">
                  
                  {/* Contact Information */}
                  <div>
                    <h4 className="text-gray-800 text-xs font-semibold mb-2">連絡先</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                          <span className="material-symbols-outlined text-blue-600 text-xs">mail</span>
                        </div>
                        <div>
                          <p className="text-gray-900 text-xs font-medium">{profile.contactInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                          <span className="material-symbols-outlined text-blue-600 text-xs">phone</span>
                        </div>
                        <div>
                          <p className="text-gray-900 text-xs font-medium">{profile.contactInfo.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related People */}
                  <div>
                    <h4 className="text-gray-800 text-xs font-semibold mb-2">関連する人物</h4>
                    <div className="space-y-1">
                      {profile.relatedPeople.slice(0, 3).map((person) => (
                        <PersonItem
                          key={person.id}
                          name={person.name}
                          role="関係者"
                          company={person.company}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Contact Staff */}
                  <div>
                    <h4 className="text-gray-800 text-xs font-semibold mb-2">接点職員</h4>
                    <div className="space-y-1">
                      {profile.contactStaff.map((staff) => (
                        <PersonItem
                          key={staff.id}
                          name={staff.name}
                          role={staff.department}
                        />
                      ))}
                    </div>
                  </div>

                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}