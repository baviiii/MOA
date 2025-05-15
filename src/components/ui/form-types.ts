import { type VariantProps } from "class-variance-authority"
import { type FormHTMLAttributes } from "react"
import { formVariants } from "@/lib/form-variants"

export type FormProps = FormHTMLAttributes<HTMLFormElement> &
  VariantProps<typeof formVariants> 