"use client";

import { usePathname } from "next/navigation";

import Footer from "@/features/mainPage/components/Footer";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      <Toaster position="top-center" richColors />
      {!isAuthPage && <Footer />}
    </>
  );
}
