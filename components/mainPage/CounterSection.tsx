"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

// Counter data type definitions
interface CounterItem {
  text: string;
  num: number;
  img: string;
  top: boolean;
}

interface CounterData {
  tag: string;
  title: string;
  subTitle: string;
  desc: string;
  body: CounterItem[];
}

interface CounterSectionProps {
  isDesc?: boolean;
  head?: boolean;
  data?: {
    counterOne: CounterData[];
  };
}

// Counter value display with animation
const CounterValue: React.FC<{ target: number }> = ({ target }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 2000; // animation duration in ms
    const interval = 20; // update interval in ms
    const steps = duration / interval;
    const increment = target / steps;
    let current = 0;
    let timer: NodeJS.Timeout;

    const updateCounter = () => {
      current += increment;
      setValue(Math.min(Math.round(current), target));

      if (current < target) {
        timer = setTimeout(updateCounter, interval);
      }
    };

    updateCounter();

    return () => clearTimeout(timer);
  }, [target]);

  return <span className="text-4xl font-bold">{value}</span>;
};

// Counter Head component
const CounterHead: React.FC<{
  tag: string;
  title: string;
  subTitle: string;
  desc: string;
}> = ({ tag, title, subTitle, desc }) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
        {tag}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        {title} <span className="text-indigo-600">{subTitle}</span>
      </h2>
      {desc && <p className="text-gray-600">{desc}</p>}
    </div>
  );
};

// Default counter data - customized for your e-learning platform
const defaultCounterData = {
  counterOne: [
    {
      tag: "POURQUOI NOUS CHOISIR",
      title: "Une Plateforme Innovante",
      subTitle: "Pour Tous les Savoirs",
      desc: "Notre plateforme d'e-learning offre un environnement où chaque individu peut enseigner et apprendre en toute confiance grâce à un système avancé de vérification des formateurs.",
      body: [
        {
          text: "Apprenants Actifs",
          num: 5000,
          img: "/images/icons/counter-01.png",
          top: true,
        },
        {
          text: "Cours Disponibles",
          num: 800,
          img: "/images/icons/counter-02.png",
          top: false,
        },
        {
          text: "Formateurs Certifiés",
          num: 1200,
          img: "/images/icons/counter-03.png",
          top: true,
        },
        {
          text: "Domaines d'Expertise",
          num: 100,
          img: "/images/icons/counter-04.png",
          top: false,
        },
      ],
    },
  ],
};

// Animation variants for the counter items
const counterItemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.5,
    },
  }),
};

const CounterSection: React.FC<CounterSectionProps> = ({
  isDesc = true,
  head = true,
  data = defaultCounterData,
}) => {
  return (
    <section className=" bg-gray-50 ">
      <div className="container w-[90vw]">
        {data.counterOne.map((counterData, index) => (
          <div className=" mx-auto px-4" key={index}>
            {head && (
              <CounterHead
                tag={counterData.tag}
                title={counterData.title}
                subTitle={counterData.subTitle}
                desc={isDesc ? counterData.desc : ""}
              />
            )}

            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {counterData.body.map((item, innerIndex) => (
                <motion.div
                  key={innerIndex}
                  custom={innerIndex}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={counterItemVariants}
                >
                  <Card
                    className={cn(
                      "h-full overflow-hidden hover:shadow-lg transition-shadow duration-300",
                      "border-b-4 border-indigo-500"
                    )}
                  >
                    <CardContent>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 p-3 bg-indigo-100 rounded-full">
                          <Image
                            src={item.img}
                            width={40}
                            height={40}
                            alt={`${item.text} Icon`}
                            className="h-15 w-15"
                          />
                        </div>

                        <div className="mt-2">
                          <div className="flex items-center justify-center">
                            <CounterValue target={item.num} />
                            {item.text.includes("k") && (
                              <span className="text-4xl font-bold">k</span>
                            )}
                          </div>
                          <span className="text-gray-600 mt-1 block">
                            {item.text}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CounterSection;
