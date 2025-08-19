import { UserRole } from "@/stores/auth.store";

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
