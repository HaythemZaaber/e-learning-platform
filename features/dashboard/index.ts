// features/dashboard/index.ts

// Components
export { DashboardSidebar } from "./components/DashboardSidebar";

// Hooks
export { useNavigation } from "./hooks/useNavigation";

// Types
export type {
  UserRole,
  NavigationItem,
  NavigationSection,
  RoleInfo,
  SidebarProps,
} from "./types/dashboard.types";

// Constants
export { ROLE_NAVIGATION, ROLE_INFO } from "./constants/navigation.constants";
