import type React from "react";
export interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
}

export interface ProcessStepProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  stepNumber: number;
  delay?: number;
}

export interface CategoryCardProps {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
}

export interface TestimonialCardProps {
  name: string;
  subject: string;
  earnings: string;
  quote: string;
  image: string;
  rating: number;
  delay?: number;
}

export interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export interface TrustBadgeProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  variant?: "green" | "blue" | "purple";
}

export interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}
