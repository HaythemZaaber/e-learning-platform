"use client";

import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { HeroSection } from "./components/sections/HeroSection";
import { StatsSection } from "./components/sections/StatsSection";
import { WhyVerifySection } from "./components/sections/WhyVerifySection";
import { ProcessPreview } from "./components/sections/ProcessPreview";
import { TeachingCategories } from "./components/sections/TeachingCategories";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { RequirementsSection } from "./components/sections/RequirementsSection";
import { FAQSection } from "./components/sections/FAQSection";
import { CTASection } from "./components/sections/CTASection";
import { FloatingCTA } from "./components/interactive/FloatingCTA";

// This is a test comment
export default function BecomeInstructorLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <WhyVerifySection />
        <ProcessPreview />
        <TeachingCategories />
        <TestimonialsSection />
        <RequirementsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
