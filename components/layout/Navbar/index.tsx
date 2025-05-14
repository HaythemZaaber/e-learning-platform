"use client";

import ClientNavbar, { UserRole } from "./ClientNavbar";
import { useAppSelector } from "@/redux/hooks";

const getUserFromCookies = (
  role: string
): {
  role: UserRole;
  name: string;
  initials: string;
  notificationCount: number;
} | null => {
  try {
    // This would normally decode and verify a JWT or similar
    // For demo purposes, we'll just return mock data
    return {
      role: role as UserRole,
      name: "Haythem Zaaber",
      initials: "HZ",
      notificationCount: 4,
    };
  } catch (error) {
    console.error("Failed to parse user session", error);
    return null;
  }
};

export default function Navbar() {
  const role = useAppSelector((state) => state.auth.role);
  const user = getUserFromCookies(role);

  return (
    <ClientNavbar
      userRole={user?.role || "visitor"}
      userName={user?.name || ""}
      userInitials={user?.initials || ""}
      notificationCount={user?.notificationCount || 0}
    />
  );
}
