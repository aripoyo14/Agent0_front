import { ExpertProfile } from "@/types";

export const sampleExpertProfile: ExpertProfile = {
  name: "鈴木一郎",
  skillTags: [
    "GX投資",
    "スタートアップエコシステム",
    "脱炭素技術",
    "技術経営",
    "ESG投資",
    "グリーンテック",
  ],
  currentInfo: {
    exchange_date: "2025/07/26",
    company_name: "GXベンチャーズ株式会社",
    current_department: "投資部",
    current_title: "投資マネージャー",
  },
  pastBusinessCards: [
    {
      exchange_date: "2022/03/15",
      company_name: "三菱商事株式会社",
      department_at_time: "新規事業開発部",
      title_at_time: "主任",
    },
    {
      exchange_date: "2020/08/10",
      company_name: "マッキンゼー・アンド・カンパニー",
      department_at_time: "コンサルティング部",
      title_at_time: "アソシエイト",
    },
    {
      exchange_date: "2019/04/22",
      company_name: "ソフトバンクグループ株式会社",
      department_at_time: "投資部門",
      title_at_time: "投資アナリスト",
    },
    {
      exchange_date: "2018/11/08",
      company_name: "野村証券株式会社",
      department_at_time: "M&Aアドバイザリー部",
      title_at_time: "アソシエイト",
    },
    {
      exchange_date: "2017/06/14",
      company_name: "株式会社リクルート",
      department_at_time: "新規事業推進室",
      title_at_time: "企画担当",
    },
    {
      exchange_date: "2016/09/30",
      company_name: "楽天株式会社",
      department_at_time: "戦略企画部",
      title_at_time: "マネージャー",
    },
    {
      exchange_date: "2015/12/03",
      company_name: "株式会社電通",
      department_at_time: "デジタルマーケティング局",
      title_at_time: "プランナー",
    },
    {
      exchange_date: "2014/07/18",
      company_name: "グーグル合同会社",
      department_at_time: "プロダクト開発部",
      title_at_time: "プロダクトマネージャー",
    },
    {
      exchange_date: "2013/02/25",
      company_name: "株式会社サイバーエージェント",
      department_at_time: "AI事業部",
      title_at_time: "エンジニア",
    },
    {
      exchange_date: "2012/05/16",
      company_name: "LINE株式会社",
      department_at_time: "プラットフォーム開発部",
      title_at_time: "シニアエンジニア",
    },
    {
      exchange_date: "2011/10/07",
      company_name: "株式会社メルカリ",
      department_at_time: "事業開発部",
      title_at_time: "ディレクター",
    },
    {
      exchange_date: "2010/08/12",
      company_name: "DeNA Co., Ltd.",
      department_at_time: "ゲーム事業部",
      title_at_time: "プロデューサー",
    },
  ],
  meetingRecords: [
    {
      id: 1,
      date: "2025/07/11",
      title: "スタートアップエコシステムの現状と政策支援について",
      user: "田中太郎",
      summary:
        "日本のスタートアップエコシステムの現状について詳細な議論を行った。特に、シード段階での資金調達の課題と政策支援制度の活用方法について議論を行った。参考となる、現場での政策実装に向けた具体的な改善点を明確にすることができた。また、海外諸国と比べての日本のあり方、グローバル市場での競争力強化に向けた長期的な施策についても議論した。",
      isLatest: true,
    },
    {
      id: 2,
      date: "2025/07/05",
      title: "AI・データ活用推進に向けた長期政策の動向",
      user: "佐藤花子",
      summary:
        "AI分野への長期政策展開と設計の意見について議論。特に規制強化のAI法制等を考慮して、日本企業の競争力向上の観点から業態を分析した。成功事例としての技術力だけでなく、事業化のスピードと市場ニーズへの対応力が重要であることを確認。今後の産業政策において、段階的なリスクマネージャーの体制と、実証実験から事業化への架け橋の在り方について意見交換を行った。",
      isLatest: false,
    },
    {
      id: 3,
      date: "2025/06/28",
      title: "カーボンニュートラル実現に向けた投資戦略",
      user: "山田次郎",
      summary:
        "脱炭素技術への投資戦略と政策について議論実施。グリーンエナジー分野での投資戦略を検討。技術的革新性だけでなく、コスト競争力と実用化スピードが投資判断の重要な要素であることを確認した。政府の支援制度について、初期段階のリスクマネージャーの体制と、実証実験から事業化への運営について、国際競争力強化の観点から、長期的な観点も含めて議論を行った。",
      isLatest: false,
    },
    {
      id: 4,
      date: "2025/06/20",
      title: "デジタル人材育成とDX推進の課題",
      user: "高橋美里",
      summary:
        "デジタル人材不足の現状と育成施策について議論。リスキリング支援制度の効果測定方法と、企業と教育機関の連携体制について意見交換。特に、実践的なスキル習得の場の提供と、継続的な学習支援の仕組み作りが重要であることを確認した。",
      isLatest: false,
    },
    {
      id: 5,
      date: "2025/06/15",
      title: "ヘルスケア分野における規制改革とイノベーション",
      user: "小林健一",
      summary:
        "医療技術イノベーションを促進する規制改革について議論。薬事承認プロセスの合理化と安全性確保のバランス、デジタル治療アプリの評価基準について検討。海外の事例を参考に、日本の医療イノベーション環境の改善策を議論した。",
      isLatest: false,
    },
    {
      id: 6,
      date: "2025/06/08",
      title: "地方創生とテクノロジー活用の可能性",
      user: "松本真由美",
      summary:
        "地方におけるデジタル技術活用による地域活性化について議論。スマート農業、遠隔医療、オンライン教育などの具体的な取り組み事例を検討。都市部との格差解消に向けた政策支援の在り方について意見交換を行った。",
      isLatest: false,
    },
    {
      id: 7,
      date: "2025/06/01",
      title: "サイバーセキュリティ強化と産業競争力",
      user: "中村宏",
      summary:
        "サイバーセキュリティ対策の強化と企業の競争力向上の両立について議論。ゼロトラスト・アーキテクチャの導入支援と人材育成、国際連携の重要性について検討。セキュリティ投資の効果測定方法についても意見交換した。",
      isLatest: false,
    },
    {
      id: 8,
      date: "2025/05/25",
      title: "Web3とブロックチェーン技術の産業応用",
      user: "藤田恵子",
      summary:
        "ブロックチェーン技術の実用化に向けた課題と機会について議論。金融、物流、コンテンツ産業での活用事例を検討。規制の明確化と技術標準化の必要性、国際的な競争力確保の観点から政策支援の在り方を議論した。",
      isLatest: false,
    },
    {
      id: 9,
      date: "2025/05/18",
      title: "量子コンピューティング研究開発の戦略",
      user: "井上拓也",
      summary:
        "量子コンピューター分野における日本の競争力強化について議論。基礎研究への投資と産業応用の橋渡し、国際共同研究の推進について検討。人材育成と研究基盤整備の重要性について意見交換を行った。",
      isLatest: false,
    },
    {
      id: 10,
      date: "2025/05/12",
      title: "宇宙産業の商業化とイノベーション政策",
      user: "木村亮介",
      summary:
        "宇宙産業の商業化促進に向けた政策について議論。衛星データ活用、宇宙輸送、宇宙利用サービスの各分野での民間企業支援策を検討。国際競争力強化と技術安全保障の観点から、戦略的な投資の在り方について意見交換した。",
      isLatest: false,
    },
    {
      id: 11,
      date: "2025/05/06",
      title: "次世代モビリティと都市設計",
      user: "渡辺千春",
      summary:
        "自動運転技術、電動モビリティ、MaaSの普及に向けた社会実装について議論。インフラ整備、法制度改正、都市計画との連携について検討。持続可能な交通システムの構築に向けた統合的なアプローチについて意見交換した。",
      isLatest: false,
    },
    {
      id: 12,
      date: "2025/04/28",
      title: "バイオテクノロジーと食料安全保障",
      user: "斉藤良太",
      summary:
        "バイオテクノロジーを活用した食料生産技術について議論。遺伝子組み換え技術、細胞培養肉、植物工場などの技術開発支援と規制の在り方を検討。食料自給率向上と環境負荷軽減の両立に向けた政策支援について意見交換した。",
      isLatest: false,
    },
    {
      id: 13,
      date: "2025/04/22",
      title: "エネルギー貯蔵技術と電力システム改革",
      user: "大野雅子",
      summary:
        "再生可能エネルギーの大量導入に向けた蓄電技術について議論。リチウムイオン電池の技術革新、次世代電池開発、系統安定化技術について検討。電力市場の制度設計と技術開発支援の連携について意見交換を行った。",
      isLatest: false,
    },
  ],
  activities: [
    {
      category: "ニュース",
      date: "2025/07/25",
      title: "GXベンチャーズが脱炭素技術スタートアップに100億円投資を発表",
      details: "詳細を見る",
    },
    {
      category: "イベント",
      date: "2025/07/20",
      title: "Tokyo Startup Ecosystem Summit 2025でキーノート講演",
      details: "詳細を見る",
    },
    {
      category: "論文",
      date: "2025/07/15",
      title:
        "「日本のGX投資における政策金融の役割」（日本経済研究センター紀要）",
      details: "詳細を見る",
    },
    {
      category: "書籍",
      date: "2025/07/10",
      title: "『脱炭素ビジネスの未来』（日経BP社）に寄稿",
      details: "詳細を見る",
    },
    {
      category: "ニュース",
      date: "2025/07/05",
      title: "日経新聞「AI・データ活用推進の課題と展望」インタビュー記事掲載",
      details: "詳細を見る",
    },
    {
      category: "イベント",
      date: "2025/06/30",
      title: "グリーンテック・カンファレンス2025パネリスト参加",
      details: "詳細を見る",
    },
    {
      category: "論文",
      date: "2025/06/25",
      title:
        "「スタートアップエコシステムにおける投資戦略の変化」（ベンチャー学会誌）",
      details: "詳細を見る",
    },
    {
      category: "ニュース",
      date: "2025/06/20",
      title: "TechCrunch Japan「デジタル人材育成の新アプローチ」寄稿記事",
      details: "詳細を見る",
    },
    {
      category: "イベント",
      date: "2025/06/15",
      title: "ヘルスケア・イノベーション・サミット基調講演",
      details: "詳細を見る",
    },
    {
      category: "書籍",
      date: "2025/06/10",
      title: "『テクノロジーが拓く地方創生の可能性』（東洋経済新報社）共著",
      details: "詳細を見る",
    },
    {
      category: "論文",
      date: "2025/06/05",
      title:
        "「サイバーセキュリティ投資の経済効果分析」（情報セキュリティ学会論文誌）",
      details: "詳細を見る",
    },
    {
      category: "ニュース",
      date: "2025/06/01",
      title: "Forbes Japan「Web3が変える産業構造」特集記事に登場",
      details: "詳細を見る",
    },
    {
      category: "イベント",
      date: "2025/05/28",
      title: "量子コンピューティング研究会での招待講演",
      details: "詳細を見る",
    },
    {
      category: "論文",
      date: "2025/05/22",
      title:
        "「宇宙産業における民間投資の動向と課題」（宇宙利用促進センター研究報告）",
      details: "詳細を見る",
    },
    {
      category: "ニュース",
      date: "2025/05/18",
      title: "日刊工業新聞「次世代モビリティへの投資戦略」インタビュー",
      details: "詳細を見る",
    },
    {
      category: "イベント",
      date: "2025/05/15",
      title: "バイオテクノロジー・フォーラム2025でパネル討論参加",
      details: "詳細を見る",
    },
    {
      category: "書籍",
      date: "2025/05/10",
      title: "『エネルギー革命とスタートアップ投資』（中央経済社）監修",
      details: "詳細を見る",
    },
    {
      category: "論文",
      date: "2025/05/05",
      title:
        "「持続可能な投資戦略とESG評価手法」（サステナビリティ経営学会誌）",
      details: "詳細を見る",
    },
    {
      category: "ニュース",
      date: "2025/05/01",
      title: "東洋経済オンライン「GX投資の現在地と今後の展望」寄稿",
      details: "詳細を見る",
    },
    {
      category: "イベント",
      date: "2025/04/25",
      title: "Japan Venture Awards 2025審査員として参加",
      details: "詳細を見る",
    },
    {
      category: "論文",
      date: "2025/04/20",
      title:
        "「イノベーション政策と民間投資の相互作用」（政策研究大学院大学紀要）",
      details: "詳細を見る",
    },
    {
      category: "ニュース",
      date: "2025/04/15",
      title: "週刊ダイヤモンド「脱炭素スタートアップ投資の最前線」特集記事",
      details: "詳細を見る",
    },
    {
      category: "イベント",
      date: "2025/04/10",
      title: "アジア・パシフィック・ベンチャー・サミットで基調講演",
      details: "詳細を見る",
    },
    {
      category: "書籍",
      date: "2025/04/05",
      title: "『デジタル変革時代の投資哲学』（日本経済新聞出版）に章を執筆",
      details: "詳細を見る",
    },
  ],
  contactStaff: [
    {
      id: 1,
      name: "田中太郎",
      department: "デジタル政策課",
    },
    {
      id: 2,
      name: "佐藤花子",
      department: "AI・データ戦略室",
    },
    {
      id: 3,
      name: "山田次郎",
      department: "環境・エネルギー政策課",
    },
    {
      id: 4,
      name: "高橋美里",
      department: "人材開発政策課",
    },
    {
      id: 5,
      name: "小林健一",
      department: "医療・ヘルスケア政策室",
    },
    {
      id: 6,
      name: "松本真由美",
      department: "地方創生推進室",
    },
    {
      id: 7,
      name: "中村宏",
      department: "サイバーセキュリティ戦略本部",
    },
    {
      id: 8,
      name: "藤田恵子",
      department: "デジタル庁Web3推進室",
    },
    {
      id: 9,
      name: "井上拓也",
      department: "科学技術政策局量子研究推進室",
    },
    {
      id: 10,
      name: "木村亮介",
      department: "宇宙政策委員会事務局",
    },
    {
      id: 11,
      name: "渡辺千春",
      department: "交通・モビリティ政策課",
    },
    {
      id: 12,
      name: "斉藤良太",
      department: "農林水産技術面談事務局",
    },
    {
      id: 13,
      name: "大野雅子",
      department: "資源エネルギー庁新エネルギー課",
    },
  ],
  contactInfo: {
    email: "suzuki.ichiro@gx-ventures.co.jp",
    phone: "03-1234-5678",
  },
  relatedPeople: [
    {
      id: 1,
      name: "田中智子",
      company: "テックソリューションズ株式会社",
    },
    {
      id: 2,
      name: "山田浩一",
      company: "株式会社グリーンエナジー",
    },
    {
      id: 3,
      name: "佐藤美咲",
      company: "ヘルスケアAI株式会社",
    },
    {
      id: 4,
      name: "加藤雄二",
      company: "スタートアップインキュベーター株式会社",
    },
    {
      id: 5,
      name: "森川香織",
      company: "フィンテックベンチャーズ",
    },
    {
      id: 6,
      name: "橋本拓実",
      company: "量子コンピューティング研究所",
    },
    {
      id: 7,
      name: "野村恵美",
      company: "バイオテック・イノベーション",
    },
    {
      id: 8,
      name: "清水正志",
      company: "ロボティクス・ソリューションズ",
    },
    {
      id: 9,
      name: "石川由紀",
      company: "サステナブル・エナジー株式会社",
    },
    {
      id: 10,
      name: "辻本健太郎",
      company: "次世代モビリティ開発機構",
    },
    {
      id: 11,
      name: "岡田真理子",
      company: "データサイエンス・ラボ",
    },
    {
      id: 12,
      name: "吉田裕介",
      company: "宇宙テクノロジー株式会社",
    },
    {
      id: 13,
      name: "西村あゆみ",
      company: "アグリテック・イノベーション",
    },
    {
      id: 14,
      name: "高木誠一",
      company: "ブロックチェーン・ソリューションズ",
    },
    {
      id: 15,
      name: "松井琴美",
      company: "クリーンテック・パートナーズ",
    },
    {
      id: 16,
      name: "安田博之",
      company: "AIドリブン・コンサルティング",
    },
    {
      id: 17,
      name: "三浦雅代",
      company: "サイバーセキュリティ・テクノロジーズ",
    },
    {
      id: 18,
      name: "池田圭介",
      company: "スマートシティ・デベロップメント",
    },
  ],
  contactInfo: {
    email: "suzuki@gx-ventures.co.jp",
    phone: "03-6234-5678",
  },
};
