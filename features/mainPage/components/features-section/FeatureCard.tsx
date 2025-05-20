"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColorKey } from "../../types/featuresTypes";
import { Feature } from "../../types/featuresTypes";

// Import color classes for use in the component
const colorClasses: Record<ColorKey, string> = {
  blue: "text-blue-500 bg-blue-50",
  indigo: "text-indigo-500 bg-indigo-50",
  purple: "text-purple-500 bg-purple-50",
  green: "text-green-500 bg-green-50",
  amber: "text-amber-500 bg-amber-50",
  pink: "text-pink-500 bg-pink-50",
  cyan: "text-cyan-500 bg-cyan-50",
  orange: "text-orange-500 bg-orange-50",
  red: "text-red-500 bg-red-50",
};

// Props type for FeatureCard component
interface FeatureCardProps {
  feature: Feature;
  idx: number;
  inView: boolean;
  selectedTab: string;
}

// Feature Card component to manage individual card state
export default function FeatureCard({
  feature,
  idx,
  inView,
  selectedTab,
}: FeatureCardProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [selectedTab]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.2, delay: idx * 0.01 }}
      whileHover={{ y: -7 }}
      className="h-full"
    >
      <Card
        className={`shadow-md cursor-default hover:shadow-xl transition h-full border ${
          feature.accent ? "border-l-4 border-l-indigo-500" : "border-gray-100"
        }`}
      >
        <CardContent className="p-6 py-2 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-3 rounded-lg ${
                colorClasses[feature.color || "blue"]
              }`}
            >
              <feature.icon className="w-8 h-8" />
            </div>
            {feature.accent && (
              <Badge
                variant="outline"
                className="bg-indigo-50 text-indigo-600 border-indigo-100"
              >
                Populaire
              </Badge>
            )}
          </div>

          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600 mb-4 flex-grow">{feature.description}</p>

          {feature.benefits && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: expanded ? 1 : 0,
                height: expanded ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="mt-3 space-y-2">
                {feature.benefits.map((b, i) => (
                  <li key={i} className="flex text-sm text-gray-600">
                    <Check size={16} className="min-w-4 text-green-500 mr-2" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Voir moins" : "En savoir plus"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
