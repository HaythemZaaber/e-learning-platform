// Types for testimonials
export interface Testimonial {
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
