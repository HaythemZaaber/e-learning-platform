import React from "react";
import { CounterSectionProps } from "../../types/counter";
import { defaultCounterData } from "../../data/counter";

import { CounterSectionClient } from "./CounterSectionClient";

const CounterSection: React.FC<CounterSectionProps> = ({
  isDesc = true,
  head = true,
  data = defaultCounterData,
}) => {
  return (
    <section className="bg-gradient-to-b from-white to-primary/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-70" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-70" />

      <div className="container">
        {data.counterOne.map((counterData, index) => (
          <div className="w-[90vw] mx-auto" key={index}>
            {head && (
              <div className="mb-16 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-4">
                  {counterData.tag}
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  {counterData.title}
                  <span className="block text-accent mt-2">
                    {counterData.subTitle}
                  </span>
                </h2>

                {isDesc && (
                  <p className="max-w-2xl mx-auto mt-4 text-gray-600">
                    {counterData.desc}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {counterData.body.map((item, innerIndex) => (
                <CounterSectionClient key={innerIndex} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CounterSection;
