"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { SlideIn, ScaleIn } from "../animations/testimonialsAnimations";
import TestimonialStars from "./TestimonialsStars";
import { Testimonial } from "../../types/testimonialsTypes";
import { Button } from "@/components/ui/button";

interface FeaturedTestimonialProps {
  featuredTestimonials: Testimonial[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  autoplayInterval?: number;
}

export default function FeaturedTestimonial({
  featuredTestimonials,
  currentSlide,
  setCurrentSlide,
  autoplayInterval = 5000, // Default to 5 seconds
}: FeaturedTestimonialProps) {
  // Auto-rotation for featured testimonials
  useEffect(() => {
    if (featuredTestimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((currentSlide + 1) % featuredTestimonials.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [
    currentSlide,
    featuredTestimonials.length,
    setCurrentSlide,
    autoplayInterval,
  ]);

  if (featuredTestimonials.length === 0) return null;

  return (
    <ScaleIn className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Featured Testimonials
        </h3>

        {/* Desktop and Tablet Navigation Controls */}
        <div className="hidden sm:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide(
                (currentSlide - 1 + featuredTestimonials.length) %
                  featuredTestimonials.length
              )
            }
            className="rounded-full hover:bg-blue-50 hover:text-blue-600"
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide((currentSlide + 1) % featuredTestimonials.length)
            }
            className="rounded-full hover:bg-blue-50 hover:text-blue-600"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-none bg-white shadow-xl rounded-3xl">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-center relative">
              <Quote
                size={120}
                className="absolute opacity-10 -top-10 -left-10"
              />
              <h3 className="text-2xl font-bold mb-4 relative z-10">
                Featured Testimonial
              </h3>
              <p className="text-blue-100 mb-6 relative z-10">
                Authentic reviews from our learners reflect the quality of our
                educational platform
              </p>
              <div className="flex space-x-1 mb-4 relative z-10">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={20}
                    className="fill-yellow-300 text-yellow-300"
                  />
                ))}
              </div>
              <p className="text-lg font-medium relative z-10">4.8/5 average</p>
              <p className="text-blue-200 text-sm relative z-10">
                Based on over 500 reviews
              </p>
            </div>
            <div className="col-span-2 p-8 md:p-12">
              <AnimatePresence mode="wait">
                <SlideIn key={currentSlide}>
                  <div className="flex items-start mb-6">
                    <Quote
                      size={36}
                      className="text-blue-400 opacity-50 mr-4 mt-1"
                    />
                    <p className="text-lg text-gray-700 italic">
                      "
                      {
                        featuredTestimonials[
                          currentSlide % featuredTestimonials.length
                        ].review
                      }
                      "
                    </p>
                  </div>
                  <div className="flex items-center mt-8">
                    <Avatar className="w-16 h-16 border-2 border-blue-100">
                      <AvatarImage
                        src={
                          featuredTestimonials[
                            currentSlide % featuredTestimonials.length
                          ].avatar
                        }
                        alt={
                          featuredTestimonials[
                            currentSlide % featuredTestimonials.length
                          ].name
                        }
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {
                          featuredTestimonials[
                            currentSlide % featuredTestimonials.length
                          ].fallback
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="font-bold text-lg text-gray-800">
                        {
                          featuredTestimonials[
                            currentSlide % featuredTestimonials.length
                          ].name
                        }
                      </div>
                      <div className="text-gray-500">
                        {
                          featuredTestimonials[
                            currentSlide % featuredTestimonials.length
                          ].course
                        }
                      </div>
                      <TestimonialStars
                        rating={
                          featuredTestimonials[
                            currentSlide % featuredTestimonials.length
                          ].rating
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </SlideIn>
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Navigation Controls */}
      <div className="flex sm:hidden justify-center gap-2 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (currentSlide - 1 + featuredTestimonials.length) %
                featuredTestimonials.length
            )
          }
          className="rounded-full hover:bg-blue-50 hover:text-blue-600"
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((currentSlide + 1) % featuredTestimonials.length)
          }
          className="rounded-full hover:bg-blue-50 hover:text-blue-600"
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Featured Testimonial Dots */}
      {featuredTestimonials.length > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {featuredTestimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide % featuredTestimonials.length === idx
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-gray-300"
              }`}
              aria-label={`View testimonial ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </ScaleIn>
  );
}
