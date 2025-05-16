"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import ReduxProvider from "./ReduxProvider";

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
