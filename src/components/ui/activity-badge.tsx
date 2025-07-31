import * as React from "react"
import { cn } from "@/lib/utils"

interface ActivityBadgeProps extends React.ComponentProps<"span"> {
  children: React.ReactNode
}

function ActivityBadge({ className, children, ...props }: ActivityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-medium whitespace-nowrap",
        "text-xs px-1 py-0.5", // デフォルトサイズ
        className
      )}
      style={{
        fontSize: '10px',
        lineHeight: '10px',
        padding: '1px 4px'
      }}
      {...props}
    >
      {children}
    </span>
  )
}

export { ActivityBadge } 