import { ElementType } from "react";

export type ColorKey =
  | "blue"
  | "indigo"
  | "purple"
  | "green"
  | "amber"
  | "pink"
  | "cyan"
  | "orange"
  | "red";

export interface Feature {
  icon: ElementType;
  title: string;
  description: string;
  benefits?: string[];
  color?: ColorKey;
  accent?: boolean;
}

export interface FeatureCategory {
  id: string;
  label: string;
  features: Feature[];
}
