import { Testimonial } from "../types/testimonialsTypes";

// Testimonial data translated to English
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sami B.",
    avatar: "/avatars/sami.jpg",
    fallback: "SB",
    review:
      "An exceptional platform! I found a great math teacher for my son. The progress is visible after just a few weeks. Very satisfied with the personalized educational approach.",
    course: "Mathematics for Middle School",
    rating: 5,
    date: "April 15, 2025",
    featured: true,
  },
  {
    id: 2,
    name: "Ines D.",
    avatar: "/avatars/ines.jpg",
    fallback: "ID",
    review:
      "The courses are varied and very well explained. I loved the mentoring experience. My mentor was able to guide me towards my goals with patience and expertise.",
    course: "Personal Development",
    rating: 4.5,
    date: "May 2, 2025",
  },
  {
    id: 3,
    name: "Ali K.",
    avatar: "/avatars/ali.jpg",
    fallback: "AK",
    review:
      "Intuitive interface, qualified teachers, and responsive support. I highly recommend it! Thanks to this platform, I was able to significantly improve my English level in just three months.",
    course: "Conversational English",
    rating: 5,
    date: "April 27, 2025",
    featured: true,
  },
  {
    id: 4,
    name: "Sarah M.",
    avatar: "/avatars/sarah.jpg",
    fallback: "SM",
    review:
      "After trying several platforms, this one is by far the best. The support is personalized and the teachers are really attentive to the needs of each learner.",
    course: "Python Programming",
    rating: 4.8,
    date: "April 10, 2025",
  },
  {
    id: 5,
    name: "Mehdi R.",
    avatar: "/avatars/mehdi.jpg",
    fallback: "MR",
    review:
      "The quality of the courses is remarkable. The explanations are clear and the practical exercises are relevant. I was able to quickly apply the knowledge gained.",
    course: "Digital Marketing",
    rating: 3.6,
    date: "May 5, 2025",
  },
];

// Helper function to get featured testimonials
export const getFeaturedTestimonials = () => {
  return testimonials.filter((t) => t.featured);
};
