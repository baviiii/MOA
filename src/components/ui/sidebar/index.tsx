
// Only export components from this file
import Sidebar from './sidebar';
import { SidebarProvider } from './sidebar';
import { SidebarTrigger } from './sidebar';
import { SidebarRail } from './sidebar';

// ADD THIS IMPORT AND EXPORT
import { sidebarVariants } from '@/lib/sidebar-variants';
export { sidebarVariants };

export { Sidebar };
export {
  SidebarProvider,
  SidebarTrigger,
  SidebarRail
};

// Re-export only component-related exports from components
export * from './components';

export * from './utils';
export { useSidebar } from './use-sidebar';
export type { SidebarProps, SidebarVariant } from './constants';
