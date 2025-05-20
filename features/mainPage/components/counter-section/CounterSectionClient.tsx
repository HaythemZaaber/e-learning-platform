"use client";

import React from "react";
import { useAnimation, useInView } from "framer-motion";
import { CounterItem } from "../../types/counterTypes";

import { CounterContainer } from "../animations/counterAnimations";
import CounterCard from "./CounterCard";

interface CounterSectionClientProps {
  item: CounterItem;
}

export const CounterSectionClient: React.FC<CounterSectionClientProps> = ({
  item,
}) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <div ref={ref}>
      <CounterContainer controls={controls}>
        <CounterCard item={item} />
      </CounterContainer>
    </div>
  );
};
