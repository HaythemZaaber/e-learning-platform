"use client";

import { usePathname } from "next/navigation";

import ReduxProvider from "./ReduxProvider";
import Navbar from "@/components/layout/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <ReduxProvider>
      {!isAuthPage && <Navbar />}
      {children}
      {/* Footer would go here */}
    </ReduxProvider>
  );
}
