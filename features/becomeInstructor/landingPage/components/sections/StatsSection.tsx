"use client";

import { Container } from "../../layout/Container";
import { StatCard } from "../ui/StatCard";
import { STATS_DATA } from "../../utils/constants";
import { motion } from "framer-motion";

export function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-primary/5">
      <Container>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {STATS_DATA.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value + (stat.suffix || "")}
              icon={stat.icon}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
