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

// 検索フィルター型
export interface SearchFilters {
  searchQuery: string
  policyThemes: string[]
  industries: string[]
  positions: string[]
}

// ネットワークマップのノード型
export interface NetworkNode {
  id: string
  name: string
  company?: string
  position?: string
  group: number
  connections: string[]
  x?: number
  y?: number
  relevanceScore?: number // 0-1の関連度スコア
}

// 政策テーマ型
export interface PolicyTheme {
  id: string
  title: string
  description: string
  color: string
  participants: number
}

// フィルターオプション型
export interface FilterOption {
  value: string
  label: string
  count?: number
}

// 政策投稿型
export interface PolicySubmission {
  id: string
  title: string
  content: string
  policyThemes: string[]
  submittedAt: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  attachedFiles?: string[]
  commentCount: number
}

// 政策コメント型
export interface PolicyComment {
  id: string
  policyId: string
  author: string
  authorRole: string
  content: string
  createdAt: string
  isOfficial: boolean // 公式コメントかどうか
  attachments?: string[]
  aiAnalysis?: CommentAnalysis // AI分析結果
}

// AI分析結果型
export interface CommentAnalysis {
  score: number // 0-100のスコア
  category: 'positive' | 'neutral' | 'negative' | 'constructive' | 'critical'
  summary: string // コメントの要約
  keyPoints: string[] // 重要なポイント
  suggestions: string[] // 改善提案
  relevanceScore: number // 政策との関連性スコア (0-100)
  expertiseLevel: 'high' | 'medium' | 'low' // 専門性レベル
  actionableInsights: string[] // 実行可能な洞察
}

// ========== Network Map DTOs (from backend) ==========
export interface PolicyThemeDTO {
  id: string
  title: string
  color?: string
}

export interface ExpertDTO {
  id: string
  name: string
  department?: string
  title?: string
}

export interface RelationDTO {
  policy_id: string
  expert_id: string
  relation_score: number
}

export interface NetworkMapResponseDTO {
  policy_themes: PolicyThemeDTO[]
  experts: ExpertDTO[]
  relations: RelationDTO[]
}

// ========== Expert Articles Types ==========
// 政策テーマの型定義（外部有識者向け）
export interface ExpertPolicyTheme {
  id: string;
  name: string;
  color: string;
  isSelected: boolean;
}

// 記事の型定義（外部有識者向け）
export interface ExpertArticle {
  id: string;
  title: string;
  summary: string; // 概要（記事一覧とオーバーレイ用）
  content: string; // 全体（詳細ページ用）
  department: string;
  publishedAt: string;
  commentCount: number;
  themeId: string;
}

// ページの状態管理（外部有識者向け）
export type ExpertPageState = "idle" | "loading" | "error" | "success";

// フィルター状態（外部有識者向け）
export interface ExpertFilterState {
  selectedTheme: string | null;
  searchQuery: string;
}

// コメント投稿者の属性（外部有識者向け）
export interface CommentAuthor {
  id: string;
  name: string;
  role: string;
  company: string;
  badges: CommentBadge[];
  expertiseLevel: 'expert' | 'pro' | 'verified' | 'regular';
}

// コメントバッジ（外部有識者向け）
export interface CommentBadge {
  type: 'pro' | 'expert' | 'verified' | 'official' | 'influencer';
  label: string;
  color: string;
  description: string;
}

// コメント（外部有識者向け）
export interface ExpertComment {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
  aiAnalysis?: CommentAnalysis;
}

// コメント並び替えオプション
export type CommentSortOption = 'likes' | 'views' | 'date' | 'relevance';

// オーバーレイ状態（外部有識者向け）
export interface ExpertOverlayState {
  isOpen: boolean;
  selectedArticle: ExpertArticle | null;
}