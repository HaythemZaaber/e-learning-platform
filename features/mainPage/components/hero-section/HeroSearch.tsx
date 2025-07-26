"use client";

import { useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/stores/search.store";
import { AnimatedWrapper, fadeInUp } from "../animations/AnimatedWrapper";
import Link from "next/link";

export function HeroSearch() {
  const setShowNavbarSearch = useSearchStore(
    (state) => state.setShowNavbarSearch
  );
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNavbarSearch(!entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "-100px 0px 0px 0px" }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [setShowNavbarSearch]);

  return (
    <AnimatedWrapper
      animation={fadeInUp}
      className="flex flex-col sm:flex-row gap-4 mt-4"
    >
      <div ref={observerRef} className="relative flex-grow max-w-md">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          placeholder="Search for courses or subjects..."
          className="pl-10 pr-4 py-6 w-full rounded-lg border border-gray-200 focus:border-accent focus:ring-accent"
        />
      </div>
      <Link href="/courses">
        <Button
          className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-accent/25"
          size="lg"
        >
          Explore Courses
        </Button>
      </Link>
    </AnimatedWrapper>
  );
}
