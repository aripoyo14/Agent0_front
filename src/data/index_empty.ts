import { ExpertProfile } from "@/types"

export const sampleExpertProfile: ExpertProfile = {
  name: "鈴木一郎",
  skillTags: ["GX投資", "スタートアップエコシステム", "脱炭素技術", "技術経営", "ESG投資", "グリーンテック"],
  currentInfo: {
    exchange_date: "2025/07/26",
    company_name: "GXベンチャーズ株式会社",
    current_department: "投資部",
    current_title: "投資マネージャー"
  },
  pastBusinessCards: [
    {
      exchange_date: "2022/03/15",
      company_name: "三菱商事株式会社",
      department_at_time: "新規事業開発部",
      title_at_time: "主任"
    },
    {
      exchange_date: "2020/08/10",
      company_name: "マッキンゼー・アンド・カンパニー",
      department_at_time: "コンサルティング部",
      title_at_time: "アソシエイト"
    },
    {
      exchange_date: "2019/04/22",
      company_name: "ソフトバンクグループ株式会社",
      department_at_time: "投資部門",
      title_at_time: "投資アナリスト"
    },
    {
      exchange_date: "2018/11/08",
      company_name: "野村証券株式会社",
      department_at_time: "M&Aアドバイザリー部",
      title_at_time: "アソシエイト"
    },
    {
      exchange_date: "2017/06/14",
      company_name: "株式会社リクルート",
      department_at_time: "新規事業推進室",
      title_at_time: "企画担当"
    },
    {
      exchange_date: "2016/09/30",
      company_name: "楽天株式会社",
      department_at_time: "戦略企画部",
      title_at_time: "マネージャー"
    },
    {
      exchange_date: "2015/12/03",
      company_name: "株式会社電通",
      department_at_time: "デジタルマーケティング局",
      title_at_time: "プランナー"
    },
    {
      exchange_date: "2014/07/18",
      company_name: "グーグル合同会社",
      department_at_time: "プロダクト開発部",
      title_at_time: "プロダクトマネージャー"
    },
    {
      exchange_date: "2013/02/25",
      company_name: "株式会社サイバーエージェント",
      department_at_time: "AI事業部",
      title_at_time: "エンジニア"
    },
    {
      exchange_date: "2012/05/16",
      company_name: "LINE株式会社",
      department_at_time: "プラットフォーム開発部",
      title_at_time: "シニアエンジニア"
    },
    {
      exchange_date: "2011/10/07",
      company_name: "株式会社メルカリ",
      department_at_time: "事業開発部",
      title_at_time: "ディレクター"
    },
    {
      exchange_date: "2010/08/12",
      company_name: "DeNA Co., Ltd.",
      department_at_time: "ゲーム事業部",
      title_at_time: "プロデューサー"
    }
  ],
  meetingRecords: [
    {
      id: 1,
      date: "2025/07/11",
      title: "スタートアップエコシステムの現状と政策支援について",
      user: "田中太郎",
      summary: "日本のスタートアップエコシステムの現状について詳細な議論を行った。特に、シード段階での資金調達の課題と政策支援制度の活用方法について議論を行った。参考となる、現場での政策実装に向けた具体的な改善点を明確にすることができた。また、海外諸国と比べての日本のあり方、グローバル市場での競争力強化に向けた長期的な施策についても議論した。",
      isLatest: true
    },
    {
      id: 2,
      date: "2025/07/05",
      title: "AI・データ活用推進に向けた長期政策の動向",
      user: "佐藤花子",
      summary: "AI技術の社会実装とデータ活用推進における政策課題について議論。特に、プライバシー保護とイノベーション促進のバランス、国際的な競争力確保について検討。産学官連携の具体的な枠組みと、中長期的なロードマップについて意見交換を行った。",
      isLatest: false
    },
    {
      id: 3,
      date: "2025/06/28",
      title: "カーボンニュートラル実現に向けた技術革新支援",
      user: "山田次郎",
      summary: "2050年カーボンニュートラル目標達成に向けた技術開発支援策について議論。グリーンテクノロジーの投資環境整備、税制優遇措置、国際協力の可能性について検討。特に、水素技術とCCUS技術の社会実装加速化について具体的な方策を議論した。",
      isLatest: false
    },
    {
      id: 4,
      date: "2025/06/20",
      title: "デジタル社会実現に向けた基盤整備",
      user: "田中太郎",
      summary: "デジタル変革を支える基盤技術とインフラ整備について議論。5G/6G通信基盤、データセンター整備、サイバーセキュリティ強化について検討。地域格差の解消と包摂的なデジタル社会の実現に向けた課題と対策について意見交換を行った。",
      isLatest: false
    },
    {
      id: 5,
      date: "2025/06/15",
      title: "イノベーション創出のための規制改革",
      user: "佐藤花子",
      summary: "新技術の社会実装を阻害する規制の見直しについて議論。規制サンドボックス制度の拡充、業界横断的な規制調整、国際標準化への対応について検討。特に、フィンテックとヘルステックの分野における規制改革の優先度について具体的な提案を行った。",
      isLatest: false
    },
    {
      id: 6,
      date: "2025/06/08",
      title: "地方創生とスタートアップエコシステム",
      user: "山田次郎",
      summary: "地方におけるスタートアップ創出と育成について議論。地域の特色を活かした産業クラスター形成、人材確保・育成、資金調達環境の整備について検討。東京一極集中からの脱却と、地方発のイノベーション創出に向けた具体的な施策について意見交換を行った。",
      isLatest: false
    },
    {
      id: 7,
      date: "2025/06/01",
      title: "科学技術・イノベーション政策の国際連携",
      user: "田中太郎",
      summary: "国際的な科学技術協力とイノベーション政策について議論。特に、EU、米国、アジア諸国との連携強化、共同研究開発プロジェクトの推進について検討。知的財産権保護と技術移転、人材交流の促進について具体的な方策を議論した。",
      isLatest: false
    },
    {
      id: 8,
      date: "2025/05/25",
      title: "持続可能な社会保障制度とテクノロジー",
      user: "佐藤花子",
      summary: "超高齢社会における社会保障制度の持続可能性について議論。ICT活用による効率化、予防医療の推進、データ活用による政策立案の高度化について検討。特に、AI技術を活用した健康管理システムと医療DXの推進について具体的な提案を行った。",
      isLatest: false
    },
    {
      id: 9,
      date: "2025/05/18",
      title: "教育DXと人材育成の未来",
      user: "山田次郎",
      summary: "デジタル時代の教育システム改革について議論。EdTech活用による個別最適化学習、STEAM教育の推進、リカレント教育の充実について検討。特に、AIとビッグデータを活用した教育効果測定と、生涯学習社会の実現に向けた具体的な施策について意見交換を行った。",
      isLatest: false
    },
    {
      id: 10,
      date: "2025/05/12",
      title: "サプライチェーン強靭化と経済安全保障",
      user: "田中太郎",
      summary: "経済安全保障の観点からサプライチェーンの強靭化について議論。重要物資の安定供給、技術流出防止、国際協力による供給網多様化について検討。特に、半導体とレアメタルの安定調達と、代替技術開発について具体的な方策を議論した。",
      isLatest: false
    },
    {
      id: 11,
      date: "2025/05/06",
      title: "宇宙産業の振興と安全保障",
      user: "佐藤花子",
      summary: "宇宙産業の成長戦略と安全保障政策について議論。民間宇宙企業の育成、衛星コンステレーション構築、宇宙デブリ対策について検討。特に、準天頂衛星システムの活用拡大と、宇宙技術の民生転用について具体的な提案を行った。",
      isLatest: false
    },
    {
      id: 12,
      date: "2025/04/28",
      title: "海洋資源開発と環境保護の両立",
      user: "山田次郎",
      summary: "海洋資源の持続可能な開発について議論。深海鉱物資源開発、洋上風力発電、海洋バイオマス活用について検討。環境影響評価の厳格化と、海洋生態系保護との両立について具体的な方策を議論した。",
      isLatest: false
    },
    {
      id: 13,
      date: "2025/04/22",
      title: "次世代エネルギーシステムの構築",
      user: "大野雅子",
      summary: "再生可能エネルギーの大量導入に向けた蓄電技術について議論。リチウムイオン電池の技術革新、次世代電池開発、系統安定化技術について検討。電力市場の制度設計と技術開発支援の連携について意見交換を行った。",
      isLatest: false
    }
  ],
  activities: [],
  contactStaff: [],
  contactInfo: {
    email: "suzuki.ichiro@gx-ventures.co.jp",
    phone: "03-1234-5678"
  },
  relatedPeople: []
}