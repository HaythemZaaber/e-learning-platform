import CounterSection from "@/components/mainPage/CounterSection";
import HeroSection from "@/components/mainPage/HeroSection";
import Navbar from "@/components/mainPage/Navbar";

export default function MainPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CounterSection />
      <CounterSection />
    </div>
  );
}
