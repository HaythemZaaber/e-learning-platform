import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CounterValue from "./CounterValue";

import {
  CounterItem as AnimatedCounterItem,
  PulseWrapper,
  CounterText,
} from "@/features/mainPage/components/animations/counterAnimations";
import { CounterItem } from "../../types/counterTypes";

interface CounterCardProps {
  item: CounterItem;
}

const CounterCard: React.FC<CounterCardProps> = ({ item }) => {
  return (
    <AnimatedCounterItem top={item.top}>
      <Card
        className={cn(
          "h-full overflow-hidden border-0 rounded-xl shadow-md hover:shadow-xl transition-all duration-300",
          "bg-white backdrop-blur-sm"
        )}
      >
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            <div
              className={`mb-6 p-4 rounded-full relative ${
                item.color
                  ? item.color.replace("text", "bg") + "/10"
                  : "bg-accent/10"
              }`}
            >
              {item.icon ? (
                <div className={item.color || "text-accent"}>{item.icon}</div>
              ) : (
                <Image
                  src={item.img}
                  width={40}
                  height={40}
                  alt={`${item.text} Icon`}
                  className="h-10 w-10"
                />
              )}

              <PulseWrapper
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: item.color
                    ? item.color.replace("text", "bg").replace("-600", "-500") +
                      "/10"
                    : "bg-accent/10",
                }}
              >
                <div className="w-full h-full" />
              </PulseWrapper>
            </div>

            <div className="mt-2 space-y-2">
              <CounterValue
                target={item.num}
                color={item.color || "text-accent"}
              />
              <CounterText className="text-lg text-gray-700 font-medium block pt-1">
                {item.text}
              </CounterText>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedCounterItem>
  );
};

export default CounterCard;
