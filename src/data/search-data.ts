import { PolicyTheme, FilterOption, NetworkNode } from "@/types";

export const policyThemes: PolicyTheme[] = [
  {
    id: "digital-transformation",
    title: "DX",
    description: "",
    color: "#007aff",
    participants: 0
  },
  {
    id: "startup-support",
    title: "スタートアップ・中小企業支援",
    description: "",
    color: "#34c759",
    participants: 0
  },
  {
    id: "industrial-transformation",
    title: "産業構造転換",
    description: "",
    color: "#ff9500",
    participants: 0
  },
  {
    id: "communication-strategy",
    title: "通信戦略",
    description: "",
    color: "#af52de",
    participants: 0
  },
  {
    id: "economic-cooperation",
    title: "経済連携",
    description: "",
    color: "#ff2d92",
    participants: 0
  },
  {
    id: "adx-new-business",
    title: "ADX",
    description: "",
    color: "#ff6b35",
    participants: 0
  },
  {
    id: "renewable-energy",
    title: "再生可能エネルギー",
    description: "",
    color: "#1e40af",
    participants: 0
  },
  {
    id: "hydrogen-society",
    title: "水素社会",
    description: "",
    color: "#7c3aed",
    participants: 0
  },
  {
    id: "green-growth",
    title: "GX",
    description: "",
    color: "#059669",
    participants: 0
  },
  {
    id: "digital-policy",
    title: "デジタル政策",
    description: "",
    color: "#0369a1",
    participants: 0
  },
  {
    id: "human-resources",
    title: "人材政策",
    description: "",
    color: "#dc2626",
    participants: 0
  },
  {
    id: "regional-policy",
    title: "地域政策",
    description: "",
    color: "#ea580c",
    participants: 0
  }
];

export const industryOptions: FilterOption[] = [
  { value: "manufacturing", label: "製造業", count: 45 },
  { value: "it", label: "情報通信業", count: 38 },
  { value: "finance", label: "金融・保険業", count: 32 },
  { value: "retail", label: "小売業", count: 28 },
  { value: "healthcare", label: "医療・福祉", count: 24 },
  { value: "construction", label: "建設業", count: 22 },
  { value: "energy", label: "電力・ガス・水道業", count: 18 },
  { value: "transportation", label: "運輸・物流業", count: 16 },
  { value: "education", label: "教育・学習支援業", count: 14 },
  { value: "consulting", label: "コンサルティング", count: 12 }
];

export const positionOptions: FilterOption[] = [
  { value: "ceo", label: "代表取締役・CEO", count: 42 },
  { value: "cto", label: "CTO・技術責任者", count: 35 },
  { value: "department-head", label: "部長・事業部長", count: 68 },
  { value: "manager", label: "課長・マネージャー", count: 89 },
  { value: "researcher", label: "研究者・開発者", count: 56 },
  { value: "consultant", label: "コンサルタント", count: 23 },
  { value: "academic", label: "大学教授・准教授", count: 31 },
  { value: "government", label: "官公庁職員", count: 19 },
  { value: "entrepreneur", label: "起業家・創業者", count: 27 }
];

export const regionOptions: FilterOption[] = [
  { value: "tokyo", label: "東京都", count: 156 },
  { value: "osaka", label: "大阪府", count: 78 },
  { value: "aichi", label: "愛知県", count: 45 },
  { value: "kanagawa", label: "神奈川県", count: 42 },
  { value: "fukuoka", label: "福岡県", count: 38 },
  { value: "hokkaido", label: "北海道", count: 32 },
  { value: "kyoto", label: "京都府", count: 29 },
  { value: "hiroshima", label: "広島県", count: 24 },
  { value: "sendai", label: "宮城県", count: 21 },
  { value: "other", label: "その他", count: 95 }
];

export const otherOptions: FilterOption[] = [
  { value: "has-patent", label: "特許保有者", count: 67 },
  { value: "published-paper", label: "論文発表経験", count: 89 },
  { value: "conference-speaker", label: "講演経験", count: 124 },
  { value: "media-appearance", label: "メディア出演", count: 45 },
  { value: "award-recipient", label: "受賞歴", count: 32 },
  { value: "board-member", label: "役員経験", count: 78 },
  { value: "overseas-experience", label: "海外勤務経験", count: 56 },
  { value: "mba-holder", label: "MBA保有", count: 43 }
];

export const sampleNetworkNodes: NetworkNode[] = [
  {
    id: "1",
    name: "田中 太郎",
    company: "株式会社イノベーション",
    position: "代表取締役CEO",
    group: 1,
    x: 400,
    y: 200,
    connections: ["2", "3", "5"],
    relevanceScore: 0.9
  },
  {
    id: "2", 
    name: "佐藤 花子",
    company: "テクノロジー株式会社",
    position: "CTO",
    group: 2,
    x: 250,
    y: 120,
    connections: ["1", "4", "6"],
    relevanceScore: 0.8
  },
  {
    id: "3",
    name: "鈴木 次郎",
    company: "グローバル商事",
    position: "事業開発部長",
    group: 3,
    x: 550,
    y: 120,
    connections: ["1", "7", "8"],
    relevanceScore: 0.7
  },
  {
    id: "4",
    name: "高橋 美咲",
    company: "株式会社フューチャー",
    position: "研究開発部長",
    group: 4,
    x: 150,
    y: 80,
    connections: ["2", "9"],
    relevanceScore: 0.6
  },
  {
    id: "5",
    name: "山田 健一",
    company: "スマートソリューションズ",
    position: "取締役",
    group: 5,
    x: 350,
    y: 240,
    connections: ["1", "10"],
    relevanceScore: 0.75
  },
  {
    id: "6",
    name: "中村 雅子",
    company: "デジタルイノベーション",
    position: "プロダクトマネージャー",
    group: 6,
    x: 200,
    y: 200,
    connections: ["2", "11"],
    relevanceScore: 0.5
  },
  {
    id: "7",
    name: "小林 達也",
    company: "アドバンステック",
    position: "営業部長",
    group: 7,
    x: 650,
    y: 90,
    connections: ["3", "12"],
    relevanceScore: 0.4
  },
  {
    id: "8",
    name: "森田 恵子",
    company: "コンサルティングファーム",
    position: "パートナー",
    group: 8,
    x: 600,
    y: 160,
    connections: ["3", "13"],
    relevanceScore: 0.65
  },
  {
    id: "9",
    name: "井上 康弘",
    company: "東京大学",
    position: "教授",
    group: 9,
    x: 100,
    y: 60,
    connections: ["4"],
    relevanceScore: 0.45
  },
  {
    id: "10",
    name: "岡田 純一",
    company: "ベンチャーキャピタル",
    position: "パートナー",
    group: 10,
    x: 450,
    y: 280,
    connections: ["5"],
    relevanceScore: 0.55
  },
  {
    id: "11",
    name: "松本 裕子",
    company: "AI研究所",
    position: "主任研究員",
    group: 11,
    x: 150,
    y: 220,
    connections: ["6"],
    relevanceScore: 0.3
  },
  {
    id: "12",
    name: "清水 和也",
    company: "製造業協会",
    position: "理事",
    group: 12,
    x: 700,
    y: 80,
    connections: ["7"],
    relevanceScore: 0.25
  },
  {
    id: "13",
    name: "吉田 麻衣",
    company: "経済産業省",
    position: "課長",
    group: 13,
    x: 650,
    y: 220,
    connections: ["8"],
    relevanceScore: 0.85
  }
];
