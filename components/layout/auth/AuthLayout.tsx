import NavbarBrand from "@/components/layout/navbar/NavbarBrand";
import { ReactNode } from "react";
import AuthNavbarBrand from "./AuthNavbarBrand";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-8 sm:pt-0">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-indigo-500 to-blue-500"></div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#ff0080,#7928ca,#ff0080)] animate-spin-slow"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg px-4">{children}</div>
    </div>
  );
}
