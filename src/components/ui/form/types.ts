import { type VariantProps } from "class-variance-authority"
import { formVariants } from "@/lib/form-variants"

export interface FormProps
  extends React.ComponentPropsWithoutRef<"form">,
    VariantProps<typeof formVariants> {} 