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
  fx?: number
  fy?: number
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

// ========== Policy Proposal Types (Backend Integration) ==========
// 政策タグの型定義
export interface PolicyTag {
  id: number;
  name: string;
  description: string | null;
  keywords: string | null;
  created_at: string;
}

// 政策提案の型定義（バックエンド連携）
export interface PolicyProposal {
  id: string;
  title: string;
  body: string;
  status: "draft" | "published" | "archived";
  published_by_user_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  attachments: PolicyProposalAttachment[];
  policy_tags: PolicyTag[] | null; // 新規追加
}

// 政策提案の添付ファイル型定義
export interface PolicyProposalAttachment {
  id: string;
  policy_proposal_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by_user_id: string;
  uploaded_at: string;
}

// 政策提案コメントの型定義（バックエンド連携）
export interface PolicyProposalComment {
  id: string;
  policy_proposal_id: string;
  author_type: "admin" | "staff" | "contributor" | "viewer";
  author_id: string;
  author_name: string | null; // 投稿者の実際の名前（姓 + 名）
  comment_text: string;
  parent_comment_id: string | null;
  evaluation: number | null; // 1-5
  stance: number | null; // 1-5
  posted_at: string;
  updated_at: string;
}

// ========== Expert Insights DTOs (from backend) ==========
export interface MeetingParticipantDepartmentOut {
  department_name?: string | null
  department_section?: string | null
}

export interface MeetingParticipantOut {
  user_id: string
  last_name: string
  first_name: string
  department?: MeetingParticipantDepartmentOut | null
}

export interface MeetingOverviewOut {
  meeting_id: string
  meeting_date: string
  title: string
  summary?: string | null
  minutes_url?: string | null
  evaluation?: number | null
  stance?: number | null
  participants: MeetingParticipantOut[]
  expert_company_name?: string | null
  expert_department_name?: string | null
  expert_title?: string | null
}

export interface PolicyProposalCommentOut {
  policy_proposal_id: string
  policy_title: string
  comment_text: string
  posted_at: string
  like_count: number
  evaluation?: number | null
  stance?: number | null
  expert_company_name?: string | null
  expert_department_name?: string | null
  expert_title?: string | null
}

export interface ExpertInsightsOut {
  expert_id: string
  experts_name?: string
  company_id?: string | null
  company_name?: string | null
  department?: string | null
  email?: string | null
  mobile?: string | null
  title?: string | null
  meetings: MeetingOverviewOut[]
  policy_comments: PolicyProposalCommentOut[]
  evaluation_average?: number | null
  stance_average?: number | null
}

// ========== User Info Types (for API responses) ==========
export interface UserInfo {
  id: string;
  name: string;
  firstname?: string;  // 名
  lastname?: string;   // 姓
  role: string;
  company: string;
  department?: string;
  title?: string;
  badges: Array<{
    type: string;
    label: string;
    color: string;
    description: string;
  }>;
  expertiseLevel: string;
}

export interface UsersInfoResponse {
  [userId: string]: UserInfo;
}

export function stanceToLabel(value?: number | null): string {
  switch (value) {
    case 1: return "否定的";
    case 2: return "やや否定的";
    case 3: return "中立";
    case 4: return "やや肯定的";
    case 5: return "肯定的";
    default: return "-";
  }
}