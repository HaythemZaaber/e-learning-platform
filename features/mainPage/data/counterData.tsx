import { Sparkles, TrendingUp, BarChart3, Users } from "lucide-react";
import { CounterData } from "../types/counterTypes";

export const defaultCounterData = {
  counterOne: [
    {
      tag: "WHY CHOOSE US",
      title: "An Innovative Platform",
      subTitle: "For All Knowledge",
      desc: "Our e-learning platform provides an environment where every individual can teach and learn with confidence thanks to an advanced instructor verification system.",
      body: [
        {
          text: "Active Learners",
          num: 5000,
          img: "/images/icons/counter-01.png",
          top: true,
          color: "text-blue-600",
          icon: <Users className="h-6 w-6" />,
        },
        {
          text: "Available Courses",
          num: 800,
          img: "/images/icons/counter-02.png",
          top: false,
          color: "text-purple-600",
          icon: <BarChart3 className="h-6 w-6" />,
        },
        {
          text: "Certified Instructors",
          num: 1200,
          img: "/images/icons/counter-03.png",
          top: true,
          color: "text-accent",
          icon: <Sparkles className="h-6 w-6" />,
        },
        {
          text: "Expertise Domains",
          num: 100,
          img: "/images/icons/counter-04.png",
          top: false,
          color: "text-green-600",
          icon: <BarChart3 className="h-6 w-6" />,
        },
      ],
    },
  ],
};