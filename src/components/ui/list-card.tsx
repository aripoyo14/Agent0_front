import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardTitleIcon } from "@/components/ui/card-title-icon";
import { EmptyState } from "@/components/ui/empty-state";

interface ListCardProps {
  title: string;
  icon: string;
  items: unknown[];
  emptyMessage: string;
  renderItem: (item: unknown, index: number) => ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function ListCard({
  title,
  icon,
  items,
  emptyMessage,
  renderItem,
  className = "",
  fullHeight = false,
}: ListCardProps) {
  const cardClasses = `profile-card ${fullHeight ? "h-full" : ""} ${className}`;
  const contentClasses = fullHeight
    ? "relative h-full"
    : "card-content-padding";

  return (
    <Card className={cardClasses}>
      <CardHeader className="card-header-padding">
        <CardTitle className="card-title-base">
          <CardTitleIcon>{icon}</CardTitleIcon>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${contentClasses} pt-0`}>
        {items.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          /* ↓↓↓ スクロール対応ラッパー追加 ↓↓↓ */
          <div
            className={
              fullHeight
                ? "absolute inset-x-3 top-0 bottom-1.5 overflow-y-auto space-y-1.5 pr-1.5 custom-scrollbar"
                : "max-h-[400px] overflow-y-auto space-y-1.5 pr-1.5 custom-scrollbar"
            }
          >
            {items.map(renderItem)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
