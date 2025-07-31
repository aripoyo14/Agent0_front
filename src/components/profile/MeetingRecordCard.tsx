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
    container: "flex items-center justify-between mb-4",
    left: "flex items-center gap-2",
    recordLabel: "text-gray-600 font-medium",
    dateContainer: "flex items-center gap-1 text-blue-600",
    dateIcon: "material-symbols-outlined text-sm",
    dateText: "text-sm font-medium"
  },
  title: {
    container: "mb-4",
    badge: "bg-blue-600 text-white border-0 px-3 py-1 text-xs font-medium rounded-md mb-3",
    text: "text-gray-900 font-medium text-base leading-relaxed"
  },
  user: {
    container: "flex items-center gap-2 mb-4",
    icon: "material-symbols-outlined text-blue-600 text-sm",
    name: "text-blue-600 font-medium"
  },
  content: {
    header: "flex items-center gap-2 mb-3",
    icon: "material-symbols-outlined text-gray-500 text-sm",
    label: "text-gray-600 font-medium",
    text: "text-sm text-gray-700 leading-relaxed p-3 bg-gray-50 rounded border border-gray-100"
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
      {/* Header */}
      <div className={STYLES.header.container}>
        <div className={STYLES.header.dateContainer} style={{ marginLeft: 'auto' }}>
          <span className={STYLES.header.dateIcon}>calendar_today</span>
          <span className={STYLES.header.dateText}>{record.date}</span>
        </div>
      </div>

      {/* Title and Badge */}
      <div className={STYLES.title.container}>
        {record.isLatest && (
          <Badge className={STYLES.title.badge}>
            最新
          </Badge>
        )}
        <h3 className={STYLES.title.text}>{record.title}</h3>
      </div>

      {/* User */}
      <div className={STYLES.user.container}>
        <span className={STYLES.user.icon}>person</span>
        <span className={STYLES.user.name}>{record.user}</span>
      </div>

      {/* Content Header */}
      <div className={STYLES.content.header}>
        <span className={STYLES.content.icon}>description</span>
        <span className={STYLES.content.label}>面談内容要約</span>
      </div>

      {/* Content */}
      <div className={STYLES.content.text}>
        {record.summary}
      </div>
    </div>
  )
}