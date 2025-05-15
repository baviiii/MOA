import { createContext } from 'react';
import type { SidebarContextType } from './types';

export const SIDEBAR_COOKIE_NAME = 'sidebar-state';
export const SIDEBAR_COOKIE_MAX_AGE = 31536000; // 1 year
export const SIDEBAR_WIDTH = '240px';
export const SIDEBAR_WIDTH_ICON = '48px';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export type SidebarVariant = 'default' | 'inset';

export type SidebarProps = {
  variant?: SidebarVariant;
  className?: string;
}; 