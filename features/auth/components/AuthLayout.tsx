import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
      
      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#ff0080,#7928ca,#ff0080)] animate-spin-slow"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg px-4">
        {children}
      </div>
    </div>
  );
} 