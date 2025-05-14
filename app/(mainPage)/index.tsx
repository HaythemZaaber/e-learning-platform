import CallToAction from "@/components/pages/mainPage/CallToAction";
import CounterSection from "@/components/pages/mainPage/CounterSection";
import CoursesSection from "@/components/pages/mainPage/CoursesSection";
import FaqSection from "@/components/pages/mainPage/FaqSection";
import FeaturedCourses from "@/components/pages/mainPage/FeaturedCourses";
import Footer from "@/components/pages/mainPage/Footer";
import HeroSection from "@/components/pages/mainPage/HeroSection";

import TeachersSection from "@/components/pages/mainPage/TeachersSection";
import TestimonialsSection from "@/components/pages/mainPage/TestimoialsSection";
import WhyChooseUs from "@/components/pages/mainPage/WhyChooseUs";

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
      <Footer />
    </div>
  );
}
