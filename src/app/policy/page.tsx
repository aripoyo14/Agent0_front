import { PolicySubmissionForm } from '@/components/blocks/PolicySubmissionForm';

// ハードコーディングされた政策タグ（既存のまま）
const POLICY_TAGS = [
  { id: "economy-industry", title: "経済産業" },
  { id: "digital-transformation", title: "DX-デジタル変革" },
  { id: "manufacturing-it-distribution-services", title: "産業構造転換" },
  { id: "startup-support", title: "スタートアップ・中小企業支援" },
  { id: "external-economy", title: "通商戦略" },
  { id: "sme-regional-economy", title: "経済連携" },
  { id: "regional-co-creation", title: "ADX-アジア新産業共創" },
  { id: "economic-security", title: "経済安全保障" },
  { id: "energy-environment", title: "再生可能エネルギー" },
  { id: "green-growth", title: "水素社会" },
  { id: "safety-security", title: "資源外交" },
  { id: "diversity-management", title: "グリーン成長戦略" },
  { id: "data-ai-utilization", title: "デジタル政策" },
  { id: "femtech", title: "人材政策" },
  { id: "cashless", title: "産学連携" },
  { id: "other", title: "地域政策" }
];

export default function Policy() {
  return (
    <PolicySubmissionForm 
      initialPolicyTags={POLICY_TAGS}
      initialFormData={{
        selectedThemes: [],
        policyTitle: "",
        policyContent: "",
        attachedFiles: []
      }}
    />
  );
}
