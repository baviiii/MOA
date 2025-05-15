import { cva } from "class-variance-authority"

export const navigationMenuVariants = cva(
  "relative z-10 flex max-w-max flex-1 items-center justify-center",
  {
    variants: {
      variant: {
        default: "",
        vertical: "flex-col space-y-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
) 