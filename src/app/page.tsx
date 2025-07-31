import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { CareerInfo } from "@/components/profile/CareerInfo";
import { Summary } from "@/components/profile/Summary";
import { ActivityInfo } from "@/components/profile/ActivityInfo";
import { ContactInfo } from "@/components/profile/ContactInfo";
import { StaffList } from "@/components/profile/StaffList";
import { RelatedPeople } from "@/components/profile/RelatedPeople";
// データ切り替え用: 以下のどちらかをコメントアウトして使用
import { sampleExpertProfile } from "@/data"; // フルデータ版
// import { sampleExpertProfile } from "@/data/index_empty"; // 空データ版（テスト用）

export default function ExpertProfilePage() {
  const profile = sampleExpertProfile;

  return (
    <div className="bg-gray-50 min-h-screen w-full h-screen overflow-hidden">
      <div className="h-16 lg:h-20">
        <ProfileHeader name={profile.name} skillTags={profile.skillTags} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 lg:gap-2 p-2 lg:p-3 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] overflow-y-auto w-full">
        {/* Left Column - Widest */}
        <div className="lg:col-span-4 flex flex-col gap-1.5 lg:gap-2 lg:h-full">
          <div className="h-auto lg:h-[40%]">
            <CareerInfo
              currentInfo={profile.currentInfo}
              pastBusinessCards={profile.pastBusinessCards}
            />
          </div>
          <div className="h-auto lg:h-[60%] lg:flex-1">
            <Summary records={profile.meetingRecords} />
          </div>
        </div>

        {/* Middle Column - Activity Information */}
        <div className="lg:col-span-5 flex flex-col gap-1.5 lg:gap-2 lg:h-full">
          <div className="h-auto lg:h-full">
            <ActivityInfo activities={profile.activities} />
          </div>
        </div>

        {/* Right Column - Narrowest */}
        <div className="lg:col-span-3 flex flex-col gap-1.5 lg:gap-2 lg:h-full">
          <div className="h-auto lg:h-[20%]">
            <ContactInfo
              email={profile.contactInfo.email}
              phone={profile.contactInfo.phone}
            />
          </div>
          <div className="h-auto lg:h-[40%]">
            <StaffList staff={profile.contactStaff} />
          </div>
          <div className="h-auto lg:h-[40%]">
            <RelatedPeople people={profile.relatedPeople} />
          </div>
        </div>
      </div>
    </div>
  );
}
