import * as React from "react"
import { cn } from "@/lib/utils"

interface CardTitleIconProps extends React.ComponentProps<"span"> {
  children: React.ReactNode
  size?: "small" | "normal"
}

function CardTitleIcon({ 
  className, 
  children, 
  size = "small",
  ...props 
}: CardTitleIconProps) {
  return (
    <span
      className={cn(
        size === "small" ? "card-title-icon-small" : "card-title-icon-normal",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { CardTitleIcon } 