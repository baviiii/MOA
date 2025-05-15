import { cva } from "class-variance-authority"

export const formVariants = cva(
  "space-y-6",
  {
    variants: {
      variant: {
        default: "",
        horizontal: "flex flex-col space-y-0 sm:flex-row sm:space-x-4 sm:space-y-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
) 