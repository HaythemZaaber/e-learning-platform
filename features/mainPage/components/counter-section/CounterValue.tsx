import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { CounterValueWrapper } from "@/features/mainPage/components/animations/counterAnimations";

interface CounterValueProps {
  target: number;
  color?: string;
}

const CounterValue: React.FC<CounterValueProps> = ({
  target,
  color = "text-accent",
}) => {
  const [value, setValue] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef, { once: true, amount: 0.3 });
  const animationStarted = useRef(false);

  useEffect(() => {
    if (!isInView || animationStarted.current) return;

    animationStarted.current = true;
    const duration = 2500;
    const interval = 16;
    const steps = duration / interval;
    const increment = target / steps;
    let current = 0;
    let timer: NodeJS.Timeout;

    const easeOutQuad = (t: number) => t * (2 - t);

    const updateCounter = () => {
      const progress = Math.min(1, current / steps);
      const easedProgress = easeOutQuad(progress);
      const value = Math.min(Math.round(target * easedProgress), target);

      setValue(value);
      current += 1;

      if (current <= steps) {
        timer = setTimeout(updateCounter, interval);
      }
    };

    updateCounter();

    return () => clearTimeout(timer);
  }, [isInView, target]);

  return (
    <div ref={counterRef} className="relative">
      <span className={`text-4xl md:text-5xl font-bold ${color}`}>
        {value.toLocaleString()}
      </span>
      {value === target && (
        <CounterValueWrapper className="absolute -right-4 -top-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
        </CounterValueWrapper>
      )}
    </div>
  );
};

export default CounterValue;
