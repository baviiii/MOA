export type { SidebarProps, SidebarVariant } from './constants';

export interface SidebarContextType {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (value: boolean | ((value: boolean) => boolean)) => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (value: boolean) => void;
  toggleSidebar: () => void;
} 