import { Badge } from "@/components/ui/badge"
import { MeetingRecord } from "@/types"

// 共通スタイル定数
const STYLES = {
  card: {
    base: "border rounded-lg p-6 shadow-sm",
    latest: "border-blue-200 bg-blue-50",
    regular: "border-gray-200 bg-white"
  },
  dot: "w-2 h-2 bg-blue-600 rounded-full",
  header: {
    container: "flex items-center justify-between mb-2",
    left: "flex items-center gap-2",
    recordLabel: "text-gray-600 font-medium",
    dateContainer: "flex items-center text-blue-600",
    dateText: "text-[10px] font-medium"
  },
  title: {
    container: "space-y-1",
    badge: "bg-blue-600 text-white border-0 px-1.5 py-0.5 text-[10px] font-medium rounded",
    text: "text-gray-900 font-medium text-xs leading-relaxed"
  },
  user: {
    container: "text-blue-600 font-medium text-xs mb-1"
  },
  content: {
    text: "text-[10px] text-gray-700 leading-relaxed p-2 bg-gray-50 rounded border border-gray-100 mt-2"
  }
}

interface MeetingRecordCardProps {
  record: MeetingRecord
}

export function MeetingRecordCard({ record }: MeetingRecordCardProps) {
  const cardClassName = `${STYLES.card.base} ${
    record.isLatest ? STYLES.card.latest : STYLES.card.regular
  }`

  return (
    <div className={cardClassName}>
      {/* Header - Badge and Date */}
      <div className={STYLES.header.container}>
        {record.isLatest && (
          <Badge className={STYLES.title.badge}>
            最新
          </Badge>
        )}
        <div className={STYLES.header.dateContainer}>
          <span className={STYLES.header.dateText}>{record.date}</span>
        </div>
      </div>

      {/* Title and Content */}
      <div className={STYLES.title.container}>
        <h3 className={STYLES.title.text}>{record.title}</h3>
      </div>

        <div className={STYLES.user.container}>
          {record.user}
        </div>

        {/* Content */}
        <div className={STYLES.content.text}>
          {record.summary}
        </div>
    </div>
  )
}