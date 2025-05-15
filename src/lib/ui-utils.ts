import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { formVariants } from "@/lib/form-variants";
import { navigationMenuVariants } from "@/lib/navigation-menu-variants";
import { sidebarVariants } from "@/lib/sidebar-variants";
import { sonnerVariants } from "@/lib/sonner-variants";
import { toggleVariants } from "@/lib/toggle-variants";

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type FormVariants = VariantProps<typeof formVariants>;
export type NavigationMenuVariants = VariantProps<typeof navigationMenuVariants>;
export type SidebarVariants = VariantProps<typeof sidebarVariants>;
export type SonnerVariants = VariantProps<typeof sonnerVariants>;
export type ToggleVariants = VariantProps<typeof toggleVariants>;
