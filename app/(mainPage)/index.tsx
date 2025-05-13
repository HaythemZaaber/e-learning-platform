import CallToAction from "@/components/mainPage/CallToAction";
import CounterSection from "@/components/mainPage/CounterSection";
import CoursesSection from "@/components/mainPage/CoursesSection";
import FaqSection from "@/components/mainPage/FaqSection";
import FeaturedCourses from "@/components/mainPage/FeaturedCourses";
import Footer from "@/components/mainPage/Footer";
import HeroSection from "@/components/mainPage/HeroSection";
import Navbar from "@/components/mainPage/Navbar";
import TeachersSection from "@/components/mainPage/TeachersSection";
import TestimonialsSection from "@/components/mainPage/TestimoialsSection";
import WhyChooseUs from "@/components/mainPage/WhyChooseUs";

export default function MainPage() {
  return (
    <div>
      <Navbar />
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
