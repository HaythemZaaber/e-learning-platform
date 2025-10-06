// features/dashboard/types/dashboard.types.ts

import { LucideIcon } from "lucide-react";
import { UserRole } from "@/stores/auth.store";

export { UserRole };

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | null;
}

export interface NavigationSection {
  main: NavigationItem[];
  quick?: NavigationItem[];
  tools?: NavigationItem[];
}

export interface RoleInfo {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

export interface SidebarProps {
  userRole?: UserRole;
  className?: string;
  isOpen?: boolean;
isFloating?: boolean;
}
