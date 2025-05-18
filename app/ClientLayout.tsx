"use client";

import { usePathname } from "next/navigation";


import Navbar from "@/components/layout/Navbar";
import Footer from "@/features/mainPage/components/Footer";
import { Toaster } from "sonner";

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
