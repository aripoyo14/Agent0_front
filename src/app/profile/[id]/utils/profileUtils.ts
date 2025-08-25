import { ExpertInsightsOut, MeetingOverviewOut } from "@/types";

// プロフィールページ専用ユーティリティ関数
export const formatDate = (d: string | Date): string => {
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return String(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
};

export const getAffiliationText = (insights: ExpertInsightsOut): string => {
  return `${insights.company_name || ''}${insights.department ? ` / ${insights.department}` : ''}${insights.title ? ` / ${insights.title}` : ''}`;
};

export const getMeetingAffiliationText = (meeting: MeetingOverviewOut): string => {
  return [meeting.expert_company_name, meeting.expert_department_name, meeting.expert_title]
    .filter(Boolean)
    .join(' ');
};
