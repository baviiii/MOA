import { type HTMLAttributes } from "react"

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "light"
} 