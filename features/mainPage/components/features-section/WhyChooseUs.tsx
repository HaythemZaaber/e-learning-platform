"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionHead from "@/components/shared/SectionHead";
import { featureCategories } from "../../data/featuresData";
import FeatureCard from "./FeatureCard";

export default function WhyChooseUs() {
  const [selectedTab, setSelectedTab] = useState("quality");
  const { ref, inView } = useInView({ threshold: 0.1 });

  const currentFeatures =
    featureCategories.find((cat) => cat.id === selectedTab)?.features || [];

  return (
    <section className="bg-gradient-to-b from-white to-primary/5" ref={ref}>
      <div className="container w-[90vw] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <SectionHead
            tag="WHY CHOOSE US"
            title="Why Choose Us"
            subTitle="The Perfect Choice for Your Learning Journey"
            desc="Discover the many benefits that make our platform the ideal choice for your learning journey."
          />
        </motion.div>

        <Tabs
          defaultValue="quality"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full max-w-3xl mx-auto mb-12"
        >
          <TabsList className="grid grid-cols-3 mx-auto">
            {featureCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {currentFeatures.map((feature, idx) => (
            <FeatureCard
              key={idx}
              feature={feature}
              idx={idx}
              inView={inView}
              selectedTab={selectedTab}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
