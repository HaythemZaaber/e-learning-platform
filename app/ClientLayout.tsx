"use client";

import { usePathname } from "next/navigation";

import Footer from "@/features/mainPage/components/Footer";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/navbar";
import { useState } from "react";
import { AiAssistant } from "@/components/shared/AiAssistant";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  return (
    <>
      {!isAuthPage && (
        <Navbar
          showAiAssistant={showAiAssistant}
          setShowAiAssistant={setShowAiAssistant}
        />
      )}
      <div className="fixed bottom-4 right-4 z-50">
        {showAiAssistant && (
          <AiAssistant onClose={() => setShowAiAssistant(false)} />
        )}
      </div>
      {children}
      <Toaster position="top-center" richColors />
      {!isAuthPage && <Footer />}
    </>
  );
}
