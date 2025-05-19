import CallToAction from "@/features/mainPage/components/CallToAction";
import CounterSection from "@/features/mainPage/components/counter-section/CounterSection";
import CoursesSection from "@/features/mainPage/components/courses-section/CoursesSection";

import FaqSection from "@/features/mainPage/components/FaqSection";
import FeaturedCourses from "@/features/mainPage/components/FeaturedCourses";

import HeroSection from "@/features/mainPage/components/hero-section/HeroSection";
import TeachersSection from "@/features/mainPage/components/teacher-section/TeachersSection";
import TestimonialsSection from "@/features/mainPage/components/TestimoialsSection";
import WhyChooseUs from "@/features/mainPage/components/WhyChooseUs";

export default function MainPage() {
  return (
    <div>
      <HeroSection />
      <CounterSection />
      <CoursesSection />
      <TeachersSection />
      {/* <FeaturedCourses /> */}
      <WhyChooseUs />
      <TestimonialsSection />
      <CallToAction />
      <FaqSection />
    </div>
  );
}
