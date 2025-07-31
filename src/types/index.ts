export interface CurrentInfo {
  exchange_date: string | null
  company_name: string
  current_department: string
  current_title: string
}

export interface PastBusinessCard {
  exchange_date: string
  company_name: string
  department_at_time: string
  title_at_time: string
}

export interface MeetingRecord {
  id: number
  date: string
  title: string
  user: string
  summary: string
  isLatest: boolean
}

export interface Activity {
  category: "ニュース" | "書籍" | "論文" | "イベント"
  date: string
  title: string
  details: string
}

// 汎用的な人物の基本型
export interface BasePerson {
  id: number
  name: string
}

// 接点職員型
export interface ContactStaff extends BasePerson {
  department: string
}

// 関連する人物型
export interface RelatedPerson extends BasePerson {
  company: string
}

// 汎用的な人物項目型（ListCardで使用）
export interface PersonItem extends BasePerson {
  subtitle: string
}

// UI用のカテゴリマッピング
export const ACTIVITY_CATEGORY_CLASSES = {
  "ニュース": "activity-category--news",
  "イベント": "activity-category--event", 
  "書籍": "activity-category--book",
  "論文": "activity-category--paper",
} as const

export interface ExpertProfile {
  name: string
  skillTags: string[]
  currentInfo: CurrentInfo
  pastBusinessCards: PastBusinessCard[]
  meetingRecords: MeetingRecord[]
  activities: Activity[]
  contactStaff: ContactStaff[]
  relatedPeople: RelatedPerson[]
  contactInfo: {
    email: string
    phone: string
  }
}