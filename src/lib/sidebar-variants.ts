import { cva } from "class-variance-authority"

export const sidebarVariants = cva(
  "fixed inset-y-0 z-50 flex w-72 flex-col",
  {
    variants: {
      variant: {
        default: "bg-sidebar text-sidebar-foreground",
        light: "bg-background text-foreground",
        inset: "bg-sidebar text-sidebar-foreground",
      },
      position: {
        left: "left-0",
        right: "right-0",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "left",
    },
  }
) 