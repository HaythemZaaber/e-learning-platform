"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import CounterHead from "@/components/shared/SectionHead";
import { Sparkles, TrendingUp, BarChart3, Users } from "lucide-react";

// Counter data type definitions
interface CounterItem {
  text: string;
  num: number;
  img: string;
  top: boolean;
  icon?: React.ReactNode;
  color?: string;
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

// Enhanced Counter value display with animation
const CounterValue: React.FC<{ target: number; color?: string }> = ({
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
    const duration = 2500; // animation duration in ms
    const interval = 16; // update interval in ms (60fps)
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
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 200 }}
          className="absolute -right-4 -top-2"
        >
          <TrendingUp className="h-5 w-5 text-green-500" />
        </motion.div>
      )}
    </div>
  );
};

// Default counter data with enhanced presentation
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
          color: "text-blue-600",
          icon: <Users className="h-6 w-6" />,
        },
        {
          text: "Cours Disponibles",
          num: 800,
          img: "/images/icons/counter-02.png",
          top: false,
          color: "text-purple-600",
          icon: <BarChart3 className="h-6 w-6" />,
        },
        {
          text: "Formateurs Certifiés",
          num: 1200,
          img: "/images/icons/counter-03.png",
          top: true,
          color: "text-accent",
          icon: <Sparkles className="h-6 w-6" />,
        },
        {
          text: "Domaines d'Expertise",
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

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const counterItemVariants = {
  hidden: (top: boolean) => ({
    opacity: 0,
    y: top ? 30 : -30,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const CounterSection: React.FC<CounterSectionProps> = ({
  isDesc = true,
  head = true,
  data = defaultCounterData,
}) => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <section
      ref={sectionRef}
      className=" bg-gradient-to-b from-white to-primary/5 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-70" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-70" />

      <div className="container ">
        {data.counterOne.map((counterData, index) => (
          <div className="w-[90vw] mx-auto" key={index}>
            {head && (
              <motion.div
                initial="hidden"
                animate={controls}
                variants={headingVariants}
                className="mb-16 text-center"
              >
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
              </motion.div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {counterData.body.map((item, innerIndex) => (
                <motion.div
                  key={innerIndex}
                  custom={item.top}
                  variants={counterItemVariants}
                  whileHover={{
                    y: -5,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
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
                            <div className={item.color || "text-accent"}>
                              {item.icon}
                            </div>
                          ) : (
                            <Image
                              src={item.img}
                              width={40}
                              height={40}
                              alt={`${item.text} Icon`}
                              className="h-10 w-10"
                            />
                          )}

                          <AnimatePresence>
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              initial={{ scale: 0.8, opacity: 0.5 }}
                              animate={{
                                scale: [0.8, 1.2, 0.8],
                                opacity: [0.5, 0.2, 0.5],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "loop",
                              }}
                              style={{
                                backgroundColor: item.color
                                  ? item.color
                                      .replace("text", "bg")
                                      .replace("-600", "-500") + "/10"
                                  : "bg-accent/10",
                              }}
                            />
                          </AnimatePresence>
                        </div>

                        <div className="mt-2 space-y-2">
                          <CounterValue
                            target={item.num}
                            color={item.color || "text-accent"}
                          />
                          <motion.span
                            className="text-lg text-gray-700 font-medium block pt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            {item.text}
                          </motion.span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CounterSection;
