"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardTitleIcon } from "@/components/ui/card-title-icon";
import { MeetingRecord } from "@/types";

// 共通スタイル定数
const STYLES = {
  header: {
    container: "card-header-padding",
    title: "card-title-base",
  },
  content: {
    container: "card-content-padding space-y-4",
    recordsContainer: "space-y-4",
  },
  icon: "material-symbols-outlined",
};

interface SummaryProps {
  records: MeetingRecord[];
}

export function Summary({ records }: SummaryProps) {
  const latestRecord = records.find((record) => record.isLatest) || records[0];
  const otherRecords = records.filter((record) => record !== latestRecord);
  const hasOtherRecords = otherRecords.length > 0;

  return (
    <Card className="profile-card h-full">
      <CardHeader className={STYLES.header.container}>
        <CardTitle className={STYLES.header.title}>
          <CardTitleIcon>description</CardTitleIcon>
          面談記録
        </CardTitle>
      </CardHeader>
      <CardContent className="relative h-full pt-0">
        {/* ↓↓↓ スクロール対応ラッパー追加 ↓↓↓ */}
        <div className="absolute inset-x-3 top-0 bottom-1.5 overflow-y-auto space-y-1.5 pr-1.5 custom-scrollbar">
          {/* 最新レコードの概要表示 */}
          {latestRecord && (
            <div className="border rounded-lg p-2.5 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  最新
                </div>
                <div className="flex items-center gap-1 text-blue-600 text-xs">
                  <span className="text-meta">{latestRecord.date}</span>
                </div>
              </div>
              <h3 className="text-gray-900 font-medium text-sm mb-2">
                {latestRecord.title}
              </h3>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="material-symbols-outlined text-blue-600 text-xs">
                  person
                </span>
                <span className="text-blue-600 font-medium text-xs">
                  {latestRecord.user}
                </span>
              </div>
              <div className="text-xs text-gray-700 leading-relaxed p-2 bg-gray-50 rounded border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="material-symbols-outlined text-gray-500 text-xs">
                    description
                  </span>
                  <span className="text-gray-600 font-medium text-xs">
                    面談内容要約
                  </span>
                </div>
                {latestRecord.summary}
              </div>
            </div>
          )}

          {/* その他のレコード（常に表示） */}
          {hasOtherRecords &&
            otherRecords.map((record) => (
              <div
                key={record.id}
                className="border rounded-lg p-2.5 bg-white border-gray-200"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-gray-900 font-medium text-xs flex-1">
                    {record.title}
                  </h3>
                  <div className="flex items-center gap-1 text-blue-600 text-xs flex-shrink-0 ml-2">
                    <span className="text-meta">{record.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-blue-600 text-xs">
                    person
                  </span>
                  <span className="text-blue-600 font-medium text-xs">
                    {record.user}
                  </span>
                </div>
                <div className="text-xs text-gray-700 leading-relaxed p-2 bg-gray-50 rounded border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-gray-500 text-xs">
                      description
                    </span>
                    <span className="text-gray-600 font-medium text-xs">
                      面談内容要約
                    </span>
                  </div>
                  {record.summary}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
