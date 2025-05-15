import { type VariantProps } from "class-variance-authority"
import { type ComponentProps } from "react"
import { type TooltipContent } from "./tooltip"
import { sidebarMenuButtonVariants } from "./sidebar-menu-button-variants"

export type SidebarMenuButtonProps = ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants> 