import { ExpertPolicyTheme, ExpertArticle, ExpertComment, CommentAuthor, CommentBadge, CommentSortOption } from '@/types';

// 政策テーマのサンプルデータ
export const policyThemes: ExpertPolicyTheme[] = [
  { id: "startup", name: "スタートアップ・\n中小企業支援", color: "#007aff", isSelected: true },
  { id: "renewable", name: "再生可能エネルギー", color: "#00b900", isSelected: false },
  { id: "dx", name: "DX-デジタル変革", color: "#007aff", isSelected: false },
  { id: "hydrogen", name: "水素社会", color: "#00b900", isSelected: false },
  { id: "industrial", name: "産業構造転換", color: "#007aff", isSelected: false },
  { id: "resources", name: "資源外交", color: "#00b900", isSelected: false },
  { id: "trade", name: "通商戦略", color: "#f59e0c", isSelected: false },
  { id: "digital", name: "デジタル政策", color: "#af52de", isSelected: false },
  { id: "green", name: "グリーン成長戦略", color: "#af52de", isSelected: false },
  { id: "security", name: "経済安全保障", color: "#f59e0c", isSelected: false },
  { id: "talent", name: "人材政策", color: "#af52de", isSelected: false },
  { id: "partnership", name: "経済連携", color: "#f59e0c", isSelected: false },
  { id: "academia", name: "産学連携", color: "#af52de", isSelected: false },
  { id: "adx", name: "ADX-アジア新産業共創", color: "#f59e0c", isSelected: false },
  { id: "regional", name: "地域政策", color: "#af52de", isSelected: false },
];

// 記事のサンプルデータ
export const articles: ExpertArticle[] = [
  {
    id: "article-001",
    title: "地方スタートアップ育成ファンドの創設",
    content: "スタートアップ支援の地域格差を是正するため、「地方発スタートアップ育成ファンド」の新設が検討されている。首都圏や大都市圏に集中しがちなベンチャー投資を、地方に呼び込む仕組みで、自治体と民間ベンチャーキャピタル（VC）の共同出資を促進。",
    department: "中小企業庁 地域産業支援課",
    publishedAt: "16時間前",
    commentCount: 157,
    themeId: "startup"
  },
  {
    id: "article-002",
    title: "スタートアップ向け税制優遇措置の拡充",
    content: "スタートアップ企業の成長を支援するため、研究開発費の税額控除や設備投資に対する特別償却制度の拡充を検討。新規事業立ち上げ時の資金調達負担を軽減。",
    department: "財務省 主税局",
    publishedAt: "1日前",
    commentCount: 203,
    themeId: "startup"
  },
  {
    id: "article-003",
    title: "スタートアップ人材育成プログラムの開始",
    content: "スタートアップ企業で働く人材のスキル向上を図るため、実践的な研修プログラムを開始。起業家精神の醸成とビジネスモデル構築能力の育成を支援。",
    department: "厚生労働省 職業能力開発局",
    publishedAt: "2日前",
    commentCount: 89,
    themeId: "startup"
  },
  {
    id: "article-004",
    title: "スタートアップ向け融資制度の新設",
    content: "資金調達に苦労するスタートアップ企業を支援するため、政府系金融機関による新たな融資制度を創設。事業性評価に基づく柔軟な融資条件を設定。",
    department: "日本政策金融公庫 新事業支援部",
    publishedAt: "3日前",
    commentCount: 167,
    themeId: "startup"
  },
  {
    id: "article-005",
    title: "スタートアップ企業向け海外展開支援",
    content: "日本のスタートアップ企業の海外展開を加速させるため、現地での事業立ち上げ支援やネットワーキングイベントの開催を実施。グローバル市場での競争力強化を図る。",
    department: "経済産業省 通商政策局",
    publishedAt: "4日前",
    commentCount: 134,
    themeId: "startup"
  },
  {
    id: "article-006",
    title: "スタートアップ向け特許取得支援制度",
    content: "スタートアップ企業の知的財産戦略を強化するため、特許取得費用の補助制度を新設。専門家による無料相談サービスも併せて提供。",
    department: "特許庁 総務部",
    publishedAt: "5日前",
    commentCount: 98,
    themeId: "startup"
  },
  {
    id: "article-007",
    title: "スタートアップ企業向けクラウド利用支援",
    content: "スタートアップ企業のITインフラ構築コストを削減するため、主要クラウドプロバイダーとの連携による利用料金の優遇制度を開始。",
    department: "デジタル庁 デジタル基盤課",
    publishedAt: "6日前",
    commentCount: 76,
    themeId: "startup"
  },
  {
    id: "article-008",
    title: "スタートアップ向けオフィススペース提供",
    content: "スタートアップ企業の事業立ち上げを支援するため、都内主要駅周辺にコワーキングスペースを開設。低価格でのオフィス利用とネットワーキング機会を提供。",
    department: "東京都 産業労働局",
    publishedAt: "1週間前",
    commentCount: 112,
    themeId: "startup"
  },
  {
    id: "article-009",
    title: "スタートアップ企業向けメンタリングプログラム",
    content: "経験豊富な起業家や経営者がスタートアップ企業の経営者に対してメンタリングを実施。事業戦略の立案や課題解決を支援。",
    department: "中小企業庁 創業・新事業促進課",
    publishedAt: "1週間前",
    commentCount: 145,
    themeId: "startup"
  },
  {
    id: "article-010",
    title: "スタートアップ向けデータ活用支援",
    content: "スタートアップ企業のデータ活用能力向上を支援するため、AI・ビッグデータ分析の専門家による技術指導プログラムを実施。",
    department: "総務省 情報流通行政局",
    publishedAt: "1週間前",
    commentCount: 88,
    themeId: "startup"
  },
  {
    id: "article-011",
    title: "デジタル人材育成プログラムの拡充",
    content: "DX推進に必要なデジタル人材の不足が深刻化している。企業のデジタル変革を加速させるため、実践的なスキルを身につけられる育成プログラムの拡充を検討。",
    department: "デジタル庁 デジタル人材課",
    publishedAt: "1日前",
    commentCount: 89,
    themeId: "dx"
  },
  {
    id: "article-012",
    title: "水素エネルギーインフラ整備計画",
    content: "カーボンニュートラル実現に向け、水素エネルギーの普及を加速させるインフラ整備計画を策定。水素ステーションの設置促進と水素製造技術の開発支援を実施。",
    department: "資源エネルギー庁 新エネルギー課",
    publishedAt: "2日前",
    commentCount: 234,
    themeId: "hydrogen"
  },
  {
    id: "article-013",
    title: "グリーン成長戦略の改訂版",
    content: "2050年カーボンニュートラル実現に向けたグリーン成長戦略の改訂版を公表。14の重点分野における具体的な施策と投資計画を明示。",
    department: "経済産業省 産業技術環境局",
    publishedAt: "3日前",
    commentCount: 312,
    themeId: "green"
  },
  {
    id: "article-014",
    title: "経済安全保障技術の研究開発支援",
    content: "重要技術の海外流出を防ぎ、経済安全保障を強化するため、先端技術の研究開発に対する支援制度を新設。",
    department: "経済産業省 経済安全保障課",
    publishedAt: "4日前",
    commentCount: 178,
    themeId: "security"
  },
  {
    id: "article-015",
    title: "産学連携によるイノベーション創出",
    content: "大学と企業の連携を強化し、革新的な技術開発を促進するための新たな支援制度を導入。共同研究プロジェクトの立ち上げを支援。",
    department: "文部科学省 科学技術・学術政策局",
    publishedAt: "5日前",
    commentCount: 145,
    themeId: "academia"
  }
];

// テーマIDで記事をフィルタリングする関数
export const getArticlesByTheme = (themeId: string | null): ExpertArticle[] => {
  if (!themeId) return articles;
  return articles.filter(article => article.themeId === themeId);
};

// コメントバッジの定義
const commentBadges: Record<string, CommentBadge[]> = {
  pro: [
    {
      type: 'pro',
      label: 'Pro',
      color: '#FF6B35',
      description: '認定プロフェッショナル'
    }
  ],
  expert: [
    {
      type: 'expert',
      label: '認定エキスパート',
      color: '#4AA0E9',
      description: '政府認定の専門家'
    }
  ],
  verified: [
    {
      type: 'verified',
      label: '認証済み',
      color: '#00B900',
      description: '本人確認済み'
    }
  ],
  official: [
    {
      type: 'official',
      label: '公式',
      color: '#F59E0C',
      description: '政府関係者'
    }
  ],
  influencer: [
    {
      type: 'influencer',
      label: 'インフルエンサー',
      color: '#AF52DE',
      description: '業界リーダー'
    }
  ]
};

// コメント投稿者のサンプルデータ
const commentAuthors: CommentAuthor[] = [
  {
    id: "author-001",
    name: "S Hideaki",
    role: "製造業 Financial Planner",
    company: "大手製造業",
    badges: [commentBadges.pro[0], commentBadges.verified[0]],
    expertiseLevel: 'pro'
  },
  {
    id: "author-002",
    name: "田中 太郎",
    role: "スタートアップ支援コンサルタント",
    company: "ベンチャーキャピタル",
    badges: [commentBadges.expert[0], commentBadges.verified[0]],
    expertiseLevel: 'expert'
  },
  {
    id: "author-003",
    name: "佐藤 花子",
    role: "投資担当",
    company: "ベンチャーキャピタル",
    badges: [commentBadges.pro[0], commentBadges.influencer[0]],
    expertiseLevel: 'pro'
  },
  {
    id: "author-004",
    name: "山田 次郎",
    role: "政策アドバイザー",
    company: "経済産業省",
    badges: [commentBadges.official[0], commentBadges.expert[0]],
    expertiseLevel: 'expert'
  },
  {
    id: "author-005",
    name: "鈴木 美咲",
    role: "起業家",
    company: "テックスタートアップ",
    badges: [commentBadges.verified[0]],
    expertiseLevel: 'regular'
  }
];

// 記事別のコメントサンプルデータ
export const getArticleComments = (articleId: string): ExpertComment[] => {
  const baseComments: ExpertComment[] = [
    {
      id: "comment-001",
      author: commentAuthors[0],
      content: "生成AIの急速な進化を受け、中小企業の業務改革と生産性向上を図るための「生成AI導入支援プログラム」が立案されている。本プログラムでは、業種や地域を問わず導入を目指す中小企業に対して、初期費用の一部補助や、活用モデルの提示、専門人材による伴走支援を提供する。",
      createdAt: "2025年07月20日",
      likeCount: 4,
      viewCount: 156,
      isLiked: false
    },
    {
      id: "comment-002",
      author: commentAuthors[1],
      content: "地方創生の観点から非常に重要な施策だと思います。特に、地域課題に特化したスタートアップの育成は、地方経済の活性化につながる重要な取り組みです。投資だけでなく、経営支援や人材マッチングまで含めた包括的な支援体制が評価できます。",
      createdAt: "2025年07月19日",
      likeCount: 12,
      viewCount: 234,
      isLiked: false
    },
    {
      id: "comment-003",
      author: commentAuthors[2],
      content: "自治体と民間VCの共同出資という仕組みは興味深いですね。リスク分散と地域密着型の支援が両立できる良いモデルだと思います。観光、医療、再エネ、一次産業という重点領域の設定も、地方の強みを活かした適切な選択だと思います。",
      createdAt: "2025年07月18日",
      likeCount: 8,
      viewCount: 189,
      isLiked: false
    },
    {
      id: "comment-004",
      author: commentAuthors[3],
      content: "政府としても、スタートアップエコシステムの構築は重要な政策課題です。今回のファンド創設により、地方におけるイノベーション創出の基盤が強化されることを期待しています。継続的なモニタリングと効果測定も重要です。",
      createdAt: "2025年07月17日",
      likeCount: 15,
      viewCount: 312,
      isLiked: false
    },
    {
      id: "comment-005",
      author: commentAuthors[4],
      content: "実際にスタートアップを立ち上げた経験から、初期段階での資金調達の重要性を実感しています。このファンドが多くの起業家の夢を後押しすることを願っています。",
      createdAt: "2025年07月16日",
      likeCount: 6,
      viewCount: 98,
      isLiked: false
    }
  ];

  // 記事IDに応じてコメントを返す（現在は全ての記事で同じコメントを使用）
  return baseComments;
};

// コメントの並び替え関数
export const sortComments = (comments: ExpertComment[], sortOption: CommentSortOption): ExpertComment[] => {
  const sortedComments = [...comments];
  
  switch (sortOption) {
    case 'likes':
      return sortedComments.sort((a, b) => b.likeCount - a.likeCount);
    case 'views':
      return sortedComments.sort((a, b) => b.viewCount - a.viewCount);
    case 'date':
      // 日付文字列をDate型に変換して比較
      return sortedComments.sort((a, b) => {
        const dateA = new Date(a.createdAt.replace('年', '/').replace('月', '/').replace('日', ''));
        const dateB = new Date(b.createdAt.replace('年', '/').replace('月', '/').replace('日', ''));
        return dateB.getTime() - dateA.getTime();
      });
    case 'relevance':
      // 関連性スコア（いいね数 + 閲覧数の重み付け）
      return sortedComments.sort((a, b) => {
        const scoreA = a.likeCount * 2 + a.viewCount * 0.1;
        const scoreB = b.likeCount * 2 + b.viewCount * 0.1;
        return scoreB - scoreA;
      });
    default:
      return sortedComments;
  }
};

// 検索クエリで記事をフィルタリングする関数
export const searchArticles = (query: string): ExpertArticle[] => {
  if (!query.trim()) return articles;
  const lowerQuery = query.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.content.toLowerCase().includes(lowerQuery) ||
    article.department.toLowerCase().includes(lowerQuery)
  );
};
