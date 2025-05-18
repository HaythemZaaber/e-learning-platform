import CallToAction from "@/features/mainPage/components/CallToAction";
import CounterSection from "@/features/mainPage/components/CounterSection";
import CoursesSection from "@/features/mainPage/components/CoursesSection";
import FaqSection from "@/features/mainPage/components/FaqSection";
import FeaturedCourses from "@/features/mainPage/components/FeaturedCourses";

import HeroSection from "@/features/mainPage/components/HeroSection";
import TeachersSection from "@/features/mainPage/components/TeachersSection";
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
