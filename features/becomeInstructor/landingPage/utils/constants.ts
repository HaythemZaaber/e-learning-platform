import {
  Shield,
  Award,
  Brain,
  FileCheck,
  BookOpen,
  Code,
  Palette,
  ChefHat,
  Target,
  Users,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  Zap,
  DollarSign,
} from "lucide-react";

export const STATS_DATA = [
  {
    label: "Average Instructor Earnings",
    value: "75",
    suffix: "/hour",
    prefix: "$",
    icon: DollarSign,
  },
  {
    label: "Verification Success Rate",
    value: "94",
    suffix: "%",
    icon: Target,
  },
  { label: "Time to Get Verified", value: "2-3", suffix: " days", icon: Clock },
  {
    label: "Student Satisfaction",
    value: "4.8",
    suffix: "/5 stars",
    icon: Star,
  },
];

export const BENEFITS_DATA = [
  {
    title: "Higher Earnings",
    description: "Verified instructors earn 3x more than unverified",
    icon: TrendingUp,
  },
  {
    title: "More Bookings",
    description: "Top search ranking and featured placement",
    icon: Users,
  },
  {
    title: "Student Trust",
    description: "Verified badge increases booking rates by 85%",
    icon: Shield,
  },
  {
    title: "Platform Protection",
    description: "Full dispute resolution and payment protection",
    icon: CheckCircle,
  },
  {
    title: "Marketing Support",
    description: "Featured in platform promotions and social media",
    icon: Zap,
  },
];

export const VERIFICATION_STEPS = [
  {
    title: "Identity Verification",
    description: "AI-powered document verification in minutes",
    icon: Shield,
  },
  {
    title: "Professional Credentials",
    description: "Showcase your expertise and qualifications",
    icon: Award,
  },
  {
    title: "Skills Assessment",
    description: "Demonstrate your teaching abilities",
    icon: Brain,
  },
  {
    title: "Background Check",
    description: "Final compliance and safety verification",
    icon: FileCheck,
  },
];

export const TEACHING_CATEGORIES = [
  {
    name: "Academic Subjects",
    description: "Math, Science, Languages",
    icon: BookOpen,
  },
  {
    name: "Professional Skills",
    description: "Coding, Design, Business",
    icon: Code,
  },
  { name: "Creative Arts", description: "Music, Art, Writing", icon: Palette },
  {
    name: "Life Skills",
    description: "Cooking, Fitness, Personal Development",
    icon: ChefHat,
  },
  {
    name: "Test Prep",
    description: "SAT, GRE, Professional Certifications",
    icon: Target,
  },
  {
    name: "Specialized Training",
    description: "Corporate workshops, Technical skills",
    icon: Award,
  },
];

export const TESTIMONIALS_DATA = [
  {
    name: "Sarah Chen",
    subject: "Mathematics & Physics",
    earnings: "$120/hour",
    quote:
      "Getting verified opened doors I never imagined. I went from struggling to find students to having a waitlist!",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    subject: "Web Development",
    earnings: "$95/hour",
    quote:
      "The verification process was smooth and professional. Now I teach full-time and love every minute of it.",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    name: "Dr. Emily Watson",
    subject: "Medical Sciences",
    earnings: "$150/hour",
    quote:
      "This platform helped me transition from traditional teaching to online education seamlessly.",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
];

export const FAQ_DATA = [
  {
    question: "How long does verification take?",
    answer:
      "Most instructors complete verification within 2-3 business days. Our AI-powered system processes documents quickly, and our team reviews applications promptly.",
  },
  {
    question: "What if I don't have formal teaching experience?",
    answer:
      "We welcome passionate educators from all backgrounds! Professional experience, certifications, or demonstrated expertise in your field can qualify you for verification.",
  },
  {
    question: "Can I teach multiple subjects?",
    answer:
      "Many of our top instructors teach across multiple categories. You can add subjects to your profile after initial verification.",
  },
  {
    question: "How much can I earn?",
    answer:
      "Earnings vary by subject and experience level. Our verified instructors average $75/hour, with many earning $100-200+ per hour for specialized subjects.",
  },
  {
    question: "What support do you provide?",
    answer:
      "We offer comprehensive support including marketing assistance, teaching resources, technical support, and dedicated account management for verified instructors.",
  },
];
