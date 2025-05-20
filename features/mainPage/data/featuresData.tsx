import {
  ShieldCheck,
  CalendarClock,
  GraduationCap,
  Users,
  Check,
  Globe,
  Sparkles,
  Award,
  BadgeCheck,
  ThumbsUp,
} from "lucide-react";
import { FeatureCategory } from "../types/featuresTypes";

export const featureCategories: FeatureCategory[] = [
  {
    id: "quality",
    label: "Quality",
    features: [
      {
        icon: ShieldCheck,
        title: "Verified Trainers",
        description:
          "Each trainer is rigorously evaluated by AI and human experts to ensure a high level of excellence.",
        benefits: [
          "Identity verification",
          "Skill assessment",
          "Satisfaction tracking",
        ],
        color: "blue",
        accent: true,
      },
      {
        icon: GraduationCap,
        title: "For All Levels",
        description:
          "Courses tailored to all ages and levels, from elementary to professional, with personalized content.",
        benefits: [
          "Progressive curricula",
          "Regular evaluations",
          "Adapted to learning pace",
        ],
        color: "indigo",
      },
      {
        icon: Award,
        title: "Pedagogical Excellence",
        description:
          "Modern and effective teaching methodologies based on the latest educational research.",
        benefits: [
          "Interactive courses",
          "Multimedia resources",
          "Immediate practice",
        ],
        color: "purple",
      },
      {
        icon: Globe,
        title: "Global Accessibility",
        description:
          "Platform available in multiple languages with trainers from around the world for a rich experience.",
        benefits: [
          "Multilingual interface",
          "International trainers",
          "Culturally diverse content",
        ],
        color: "green",
      },
    ],
  },
  {
    id: "flexibility",
    label: "Flexibility",
    features: [
      {
        icon: CalendarClock,
        title: "Flexible Schedules",
        description:
          "Choose time slots based on your availability, in group or individual sessions, 24/7 and from anywhere.",
        benefits: [
          "On-demand classes",
          "Recorded sessions",
          "Automatic reminders",
        ],
        color: "amber",
        accent: true,
      },
      {
        icon: Users,
        title: "Personalized Learning",
        description:
          "Learning plans tailored to your style and goals for optimal progression.",
        benefits: [
          "Initial level test",
          "Personalized goals",
          "Detailed progress tracking",
        ],
        color: "pink",
      },
      {
        icon: Sparkles,
        title: "Adaptable Plans",
        description:
          "Different subscription options to suit your needs and budget, with no long-term commitment.",
        benefits: ["Free trial", "Pay-per-session option", "Family plans"],
        color: "cyan",
      },
      {
        icon: ThumbsUp,
        title: "Satisfaction Guaranteed",
        description:
          "We guarantee your satisfaction or your money back, no questions asked.",
        benefits: [
          "Refundable first class",
          "Trainer change option",
          "Responsive customer support",
        ],
        color: "orange",
      },
    ],
  },
  {
    id: "security",
    label: "Security",
    features: [
      {
        icon: BadgeCheck,
        title: "Safe Learning Environment",
        description:
          "Protected space for children, parental control tools, active moderation, and respectful atmosphere.",
        benefits: [
          "Content filtering",
          "Interaction monitoring",
          "Easy reporting",
        ],
        color: "red",
        accent: true,
      },
      {
        icon: ShieldCheck,
        title: "Data Protection",
        description:
          "Your personal and learning data is secured according to the strictest standards (GDPR).",
        benefits: [
          "Data encryption",
          "Clear privacy policy",
          "Control over your information",
        ],
        color: "green",
      },
      {
        icon: Users,
        title: "Supportive Community",
        description:
          "A carefully moderated community of learners and trainers for peaceful learning.",
        benefits: [
          "Code of conduct",
          "Proactive moderation",
          "Reputation system",
        ],
        color: "blue",
      },
      {
        icon: CalendarClock,
        title: "Responsive Support",
        description:
          "A support team available quickly to resolve your issues and answer your questions.",
        benefits: ["Live chat", "Phone support", "Comprehensive help center"],
        color: "purple",
      },
    ],
  },
];
