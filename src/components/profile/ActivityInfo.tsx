"use client";

import { useState } from "react";
import { ActivityBadge } from "@/components/ui/activity-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardTitleIcon } from "@/components/ui/card-title-icon";
import { Activity, ACTIVITY_CATEGORY_CLASSES } from "@/types";

const getCategoryClass = (category: Activity["category"]) => {
  return ACTIVITY_CATEGORY_CLASSES[category] || "activity-category--other";
};

interface ActivityInfoProps {
  activities: Activity[];
}

export function ActivityInfo({ activities }: ActivityInfoProps) {
  const [useEmptyData, setUseEmptyData] = useState(false);

  // TODO: 将来的にバックエンド実装時に最新の活動情報を取得する機能にd変更予定
  const handleToggleData = () => {
    setUseEmptyData(!useEmptyData);
  };

  const displayActivities = useEmptyData ? [] : activities;

  return (
    <Card className="profile-card h-full">
      <CardHeader className="card-header-padding">
        <div className="flex items-center justify-between">
          <CardTitle className="card-title-base">
            <CardTitleIcon>rss_feed</CardTitleIcon>
            活動情報
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-4 py-1.5 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full bg-transparent"
            onClick={handleToggleData}
          >
            {useEmptyData ? "デモデータに戻す" : "最新情報を取得"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative h-full">
        {displayActivities.length === 0 ? (
          <div className="flex items-center justify-center pt-8">
            <div className="text-sm text-gray-500">活動情報がありません</div>
          </div>
        ) : (
          // ↓↓↓ スクロール対応ラッパー追加 ↓↓↓
          <div className="absolute inset-3 top-0 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
            {displayActivities.map((activity, index) => (
              <div
                key={index}
                className={`p-2.5 rounded-lg ${getCategoryClass(
                  activity.category
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ActivityBadge className="activity-badge">
                        {activity.category}
                      </ActivityBadge>
                      <span className="text-meta">{activity.date}</span>
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      {activity.title}
                    </p>
                  </div>
                  <div className="bg-white rounded-full px-2 py-0.5 ml-2 shadow-sm border border-gray-100">
                    <span className="text-xs text-gray-600">
                      {activity.details}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
