// app/page.tsx
"use client";

import CallToAction from "@/features/mainPage/components/CallToAction";
import CounterSection from "@/features/mainPage/components/counter-section/CounterSection";
import CoursesSection from "@/features/mainPage/components/courses-section/CoursesSection";
import FaqSection from "@/features/mainPage/components/FaqSection";
import WhyChooseUs from "@/features/mainPage/components/features-section/WhyChooseUs";
import HeroSection from "@/features/mainPage/components/hero-section/HeroSection";
import TeachersSection from "@/features/mainPage/components/teacher-section/TeachersSection";
import TestimonialsSection from "@/features/mainPage/components/testimonials-section/TestimonialsSection";
import { useAuth } from "@/hooks/useAuth";
import { useAuthSelectors } from "@/stores/auth.store";

export default function MainPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userRole, userFullName } = useAuthSelectors();

  return (
    <div>
      {/* Pass auth data to components if needed */}
      <HeroSection
        // isAuthenticated={isAuthenticated}
        // userRole={userRole}
        // userName={userFullName}
      />
      <CounterSection />
      <CoursesSection 
        showFeatured={false}
        selectedCategory="All"
      />
      <TeachersSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <CallToAction
      // isAuthenticated={isAuthenticated} userRole={userRole} 
      />
      <FaqSection />
    </div>
  );
}
