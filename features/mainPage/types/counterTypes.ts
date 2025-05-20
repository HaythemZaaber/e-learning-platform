import { ReactNode } from "react";

export interface CounterItem {
  text: string;
  num: number;
  img: string;
  top: boolean;
  icon?: ReactNode;
  color?: string;
}

export interface CounterData {
  tag: string;
  title: string;
  subTitle: string;
  desc: string;
  body: CounterItem[];
}

export interface CounterSectionProps {
  isDesc?: boolean;
  head?: boolean;
  data?: {
    counterOne: CounterData[];
  };
}
