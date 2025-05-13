"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

// Define TypeScript interface for testimonial data
interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  fallback: string;
  review: string;
  course: string;
  rating: number;
  date?: string;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sami B.",
    avatar: "/avatars/sami.jpg",
    fallback: "SB",
    review:
      "Une plateforme exceptionnelle ! J'ai trouvé un professeur de mathématiques génial pour mon fils. Les progrès sont visibles après seulement quelques semaines. Très satisfait du suivi pédagogique personnalisé.",
    course: "Mathématiques pour collégiens",
    rating: 5,
    date: "15 avril 2025",
    featured: true,
  },
  {
    id: 2,
    name: "Ines D.",
    avatar: "/avatars/ines.jpg",
    fallback: "ID",
    review:
      "Les cours sont variés et très bien expliqués. J'ai adoré l'expérience avec le mentorat. Mon mentor a su m'accompagner vers mes objectifs avec patience et expertise.",
    course: "Développement personnel",
    rating: 4.5,
    date: "2 mai 2025",
  },
  {
    id: 3,
    name: "Ali K.",
    avatar: "/avatars/ali.jpg",
    fallback: "AK",
    review:
      "Interface intuitive, enseignants qualifiés, et support réactif. Je recommande fortement ! Grâce à cette plateforme, j'ai pu améliorer considérablement mon niveau d'anglais en seulement trois mois.",
    course: "Anglais conversationnel",
    rating: 5,
    date: "27 avril 2025",
    featured: true,
  },
  {
    id: 4,
    name: "Sarah M.",
    avatar: "/avatars/sarah.jpg",
    fallback: "SM",
    review:
      "Après avoir essayé plusieurs plateformes, celle-ci est de loin la meilleure. L'accompagnement est personnalisé et les enseignants sont vraiment à l'écoute des besoins de chaque apprenant.",
    course: "Programmation Python",
    rating: 4.8,
    date: "10 avril 2025",
  },
  {
    id: 5,
    name: "Mehdi R.",
    avatar: "/avatars/mehdi.jpg",
    fallback: "MR",
    review:
      "La qualité des cours est remarquable. Les explications sont claires et les exercices pratiques sont pertinents. J'ai pu rapidement mettre en application les connaissances acquises.",
    course: "Marketing digital",
    rating: 4.7,
    date: "5 mai 2025",
  },
];

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] =
    useState<Testimonial | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const featuredTestimonials = testimonials.filter((t) => t.featured);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    if (carouselRef.current) {
      const totalSlides = Math.ceil(testimonials.length / 3);
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      carouselRef.current.scrollTo({
        left:
          ((currentSlide + 1) % totalSlides) * carouselRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const prevSlide = () => {
    if (carouselRef.current) {
      const totalSlides = Math.ceil(testimonials.length / 3);
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      carouselRef.current.scrollTo({
        left:
          ((currentSlide - 1 + totalSlides) % totalSlides) *
          carouselRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 py-1 px-4 bg-blue-100 text-blue-800 border-blue-200"
          >
            <MessageCircle size={14} className="mr-1" /> Témoignages
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Ce que <span className="text-blue-600">disent</span> nos apprenants
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez comment notre plateforme a transformé leur façon
            d'apprendre et les a aidés à atteindre leurs objectifs académiques.
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        {featuredTestimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-16"
          >
            <Card className="overflow-hidden border-none bg-white shadow-xl rounded-3xl">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-center relative">
                    <Quote
                      size={120}
                      className="absolute opacity-10 -top-10 -left-10"
                    />
                    <h3 className="text-2xl font-bold mb-4 relative z-10">
                      Témoignage en vedette
                    </h3>
                    <p className="text-blue-100 mb-6 relative z-10">
                      Les avis authentiques de nos apprenants reflètent la
                      qualité de notre plateforme éducative
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
                    <p className="text-lg font-medium relative z-10">
                      4.8/5 moyenne
                    </p>
                    <p className="text-blue-200 text-sm relative z-10">
                      Basé sur plus de 500 avis
                    </p>
                  </div>
                  <div className="col-span-2 p-8 md:p-12">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                      >
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
                            <div className="flex mt-1">
                              {[...Array(5)].map((_, idx) => (
                                <Star
                                  key={idx}
                                  size={16}
                                  className={`${
                                    idx <
                                    Math.floor(
                                      featuredTestimonials[
                                        currentSlide %
                                          featuredTestimonials.length
                                      ].rating
                                    )
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  } mr-1`}
                                />
                              ))}
                              {featuredTestimonials[
                                currentSlide % featuredTestimonials.length
                              ].rating %
                                1 >
                                0 && (
                                <Star
                                  size={16}
                                  className="text-yellow-400 fill-yellow-400 mr-1"
                                  strokeWidth={3}
                                  strokeDasharray="64"
                                  strokeDashoffset="32"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>

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
          </motion.div>
        )}

        {/* All Testimonials */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Tous les témoignages
            </h3>

            {/* Desktop and Tablet Navigation Controls */}
            <div className="hidden sm:flex justify-end gap-2 mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="rounded-full hover:bg-blue-50 hover:text-blue-600"
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="rounded-full hover:bg-blue-50 hover:text-blue-600"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </motion.div>

          <div
            ref={carouselRef}
            className="overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-w-full">
                {testimonials.map((testimonial, idx) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={
                      inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                    }
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="snap-center h-full"
                    onClick={() => setActiveTestimonial(testimonial)}
                  >
                    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 h-full cursor-pointer border border-gray-100">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <Avatar className="w-14 h-14 border-2 border-blue-100">
                            <AvatarImage
                              src={testimonial.avatar}
                              alt={testimonial.name}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {testimonial.fallback}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < Math.floor(testimonial.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                } ml-1`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 flex-grow line-clamp-4">
                          "{testimonial.review}"
                        </p>
                        <div className="mt-6">
                          <div className="font-semibold text-gray-900">
                            {testimonial.name}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            Cours : {testimonial.course}
                          </div>
                          {testimonial.date && (
                            <div className="text-xs text-gray-500 mt-1">
                              {testimonial.date}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex sm:hidden justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full hover:bg-blue-50 hover:text-blue-600"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full hover:bg-blue-50 hover:text-blue-600"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Full Testimonial Modal */}
      <AnimatePresence>
        {activeTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveTestimonial(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                onClick={() => setActiveTestimonial(null)}
              >
                ✕
              </button>

              <div className="flex items-center mb-6">
                <Avatar className="w-16 h-16 border-2 border-blue-100">
                  <AvatarImage
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {activeTestimonial.fallback}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <div className="font-bold text-lg">
                    {activeTestimonial.name}
                  </div>
                  <div className="text-blue-600">
                    {activeTestimonial.course}
                  </div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(activeTestimonial.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        } mr-1`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Quote size={24} className="text-blue-400 opacity-50 mb-2" />
                <p className="text-gray-700 leading-relaxed">
                  "{activeTestimonial.review}"
                </p>
              </div>

              {activeTestimonial.date && (
                <div className="text-sm text-gray-500 mt-6 text-right">
                  Publié le {activeTestimonial.date}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
