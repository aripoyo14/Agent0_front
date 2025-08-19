import { PolicySubmission, PolicyComment, CommentAnalysis } from "@/types";

// AI分析結果のサンプルデータ
const sampleAnalysis1: CommentAnalysis = {
  score: 85,
  category: 'constructive',
  summary: '生成AI導入支援プログラムについて、具体的な業務課題への対応と地方・小規模事業者への恩恵について建設的な提案を提供',
  keyPoints: ['業務効率化の具体的なユースケース', '地方・小規模事業者への配慮', '専門人材による伴走支援'],
  suggestions: ['補助金の申請プロセスを簡素化', '成功事例の共有を強化'],
  relevanceScore: 92,
  expertiseLevel: 'high',
  actionableInsights: ['製造業でのAI活用モデルを参考にすべき', 'Financial Plannerとしての視点が有用']
};

const sampleAnalysis2: CommentAnalysis = {
  score: 78,
  category: 'positive',
  summary: '生成AI導入支援プログラムの方向性に賛同し、具体的な活用方法について詳細な提案を提供',
  keyPoints: ['業務効率化の重要性', '売上予測の活用', '顧客対応の自動化'],
  suggestions: ['段階的な導入支援を検討', '業界別のベストプラクティスを共有'],
  relevanceScore: 88,
  expertiseLevel: 'medium',
  actionableInsights: ['中小企業向けの導入ガイドライン作成に活用可能']
};

const sampleAnalysis3: CommentAnalysis = {
  score: 72,
  category: 'positive',
  summary: '生成AI導入支援プログラムの基本的な方向性に賛同し、実装面での改善提案を提供',
  keyPoints: ['初期費用補助の重要性', '活用モデルの提示', '専門人材の必要性'],
  suggestions: ['補助対象の拡大を検討', '導入後のフォローアップ体制を強化'],
  relevanceScore: 85,
  expertiseLevel: 'medium',
  actionableInsights: ['導入支援の継続的な改善に活用可能']
};

// サンプル政策投稿データ
export const samplePolicySubmissions: PolicySubmission[] = [
  {
    id: "policy-001",
    title: "地方スタートアップ育成ファンドの創設",
    content: "地方創生の観点から、地域の特色を活かしたスタートアップ支援制度の創設を提案します。特に、地方の資源や文化を活用したビジネスモデルの開発を支援し、地域経済の活性化を図ります。",
    policyThemes: ["地方創生", "スタートアップ支援"],
    submittedAt: "2025年7月21日",
    status: "under_review",
    attachedFiles: ["proposal_document.pdf", "regional_analysis.xlsx"],
    commentCount: 157
  },
  {
    id: "policy-002",
    title: "海外展開スタートアップ向けアクセラレータープログラム",
    content: "グローバル市場への進出を目指すスタートアップを支援するため、海外展開に特化したアクセラレータープログラムの創設を提案します。",
    policyThemes: ["海外展開", "スタートアップ支援"],
    submittedAt: "2025年7月1日",
    status: "approved",
    attachedFiles: ["program_outline.pdf"],
    commentCount: 89
  },
  {
    id: "policy-003",
    title: "中小企業のAI導入支援",
    content: "中小企業のデジタル化を促進するため、AI技術の導入を支援する制度の拡充を提案します。",
    policyThemes: ["AI導入", "中小企業支援"],
    submittedAt: "2025年5月11日",
    status: "submitted",
    attachedFiles: ["ai_survey_results.pdf"],
    commentCount: 45
  }
];

// サンプルコメントデータ
export const samplePolicyComments: PolicyComment[] = [
  {
    id: "comment-001",
    policyId: "policy-001",
    author: "H Fukatsu",
    authorRole: "製造業 Financial Planner",
    content: "生成AIの急速な進化を受け、中小企業の業務改革と生産性向上を図るための「生成AI導入支援プログラム」が立案されている。本プログラムでは、業種や地域を問わず導入を目指す中小企業に対して、初期費用の一部補助や、活用モデルの提示、専門人材による伴走支援を提供する。特に、業務効率化、売上予測、顧客対応の自動化など、具体的な業務課題に直結するユースケースに焦点を当てる。都市部の大企業に偏らず、地方や小規模事業者にも生成AIの恩恵を行き渡らせ、社会全体での技術利活用を底上げする狙い。",
    createdAt: "2025年07月20日",
    isOfficial: false,
    aiAnalysis: sampleAnalysis1
  },
  {
    id: "comment-002",
    policyId: "policy-001",
    author: "S Arimura",
    authorRole: "製造業 Financial Planner",
    content: "生成AIの急速な進化を受け、中小企業の業務改革と生産性向上を図るための「生成AI導入支援プログラム」が立案されている。本プログラムでは、業種や地域を問わず導入を目指す中小企業に対して、初期費用の一部補助や、活用モデルの提示、専門人材による伴走支援を提供する。特に、業務効率化、売上予測、顧客対応の自動化など、具体的な業務課題に直結するユースケースに焦点を当てる。都市部の大企業に偏らず、地方や小規模事業者にも生成AIの恩恵を行き渡らせ、社会全体での技術利活用を底上げする狙い。",
    createdAt: "2025年07月20日",
    isOfficial: false,
    aiAnalysis: sampleAnalysis2
  },
  {
    id: "comment-003",
    policyId: "policy-001",
    author: "A Endoh",
    authorRole: "製造業 Financial Planner",
    content: "生成AIの急速な進化を受け、中小企業の業務改革と生産性向上を図るための「生成AI導入支援プログラム」が立案されている。本プログラムでは、業種や地域を問わず導入を目指す中小企業に対して、初期費用の一部補助や、活用モデルの提示、専門人材による伴走支援を提供する。特に、業務効率化、売上予測、顧客対応の自動化など、具体的な業務課題に直結するユースケースに焦点を当てる。都市部の大企業に偏らず、地方や小規模事業者にも生成AIの恩恵を行き渡らせ、社会全体での技術利活用を底上げする狙い。",
    createdAt: "2025年07月20日",
    isOfficial: false,
    aiAnalysis: sampleAnalysis3
  }
];

// 政策投稿をIDで取得する関数
export const getPolicySubmissionById = (id: string): PolicySubmission | undefined => {
  return samplePolicySubmissions.find(policy => policy.id === id);
};

// 政策投稿のコメントを取得する関数
export const getCommentsByPolicyId = (policyId: string): PolicyComment[] => {
  return samplePolicyComments.filter(comment => comment.policyId === policyId);
};

// コメント数を取得する関数
export const getTotalCommentCount = (): number => {
  return samplePolicySubmissions.reduce((total, policy) => total + policy.commentCount, 0);
};

// 最新のコメント数を取得する関数
export const getRecentCommentCount = (days: number = 7): number => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return samplePolicySubmissions.reduce((total, policy) => {
    const policyDate = new Date(policy.submittedAt.replace('年', '/').replace('月', '/').replace('日', ''));
    if (policyDate >= cutoffDate) {
      return total + policy.commentCount;
    }
    return total;
  }, 0);
};
