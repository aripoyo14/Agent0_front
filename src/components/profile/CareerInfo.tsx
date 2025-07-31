"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardTitleIcon } from "@/components/ui/card-title-icon";
import { CurrentInfo, PastBusinessCard } from "@/types";

interface CareerInfoProps {
  currentInfo: CurrentInfo;
  pastBusinessCards: PastBusinessCard[];
}

export function CareerInfo({
  currentInfo,
  pastBusinessCards,
}: CareerInfoProps) {
  const hasPastCareer = pastBusinessCards.length > 0;

  return (
    <Card className="profile-card h-full">
      <CardHeader className="card-header-padding">
        <CardTitle className="card-title-base">
          <CardTitleIcon>business_center</CardTitleIcon>
          経歴情報
        </CardTitle>
      </CardHeader>
      <CardContent className="relative h-full pt-0">
        {/* ↓↓↓ スクロール対応ラッパー追加 ↓↓↓ */}
        <div className="absolute inset-x-3 top-0 bottom-1.5 overflow-y-auto space-y-1.5 pr-1.5 custom-scrollbar">
          {/* 現在の情報 */}
          <div className="border rounded-lg p-2.5 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                最新
              </Badge>
              <div className="flex items-center gap-1 text-blue-600 text-xs">
                <span className="text-meta">名刺取得日：{currentInfo.exchange_date}</span>
              </div>
            </div>
            <h3 className="text-gray-900 font-medium text-sm mb-2">
              {currentInfo.company_name}
            </h3>
            <div className="text-xs text-gray-700 leading-relaxed p-2 bg-gray-50 rounded border border-gray-100">
              <p className="mb-1">{currentInfo.current_department}</p>
              <p>{currentInfo.current_title}</p>
            </div>
          </div>

          {/* 過去の名刺情報（常に表示） */}
          {hasPastCareer &&
            pastBusinessCards.map((card, index) => (
              <div
                key={index}
                className="border rounded-lg p-2.5 bg-white border-gray-200"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-gray-900 font-medium text-xs flex-1">
                    {card.company_name}
                  </h3>
                  <div className="flex items-center gap-1 text-blue-600 text-xs flex-shrink-0 ml-2">
                    <span className="text-meta">取得日：{card.exchange_date}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-700 leading-relaxed p-2 bg-gray-50 rounded border border-gray-100">
                  <p className="mb-1">{card.department_at_time}</p>
                  <p>{card.title_at_time}</p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
