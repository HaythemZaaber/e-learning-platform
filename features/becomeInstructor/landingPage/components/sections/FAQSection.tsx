"use client";

import { useState } from "react";
import { FAQItem } from "../ui/FAQItem";
import { FAQ_DATA } from "../../utils/constants";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Container } from "../../layout/Container";
import SectionHead from "@/components/shared/SectionHead";

export function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 bg-gradient-to-b from-white to-primary/5"
    >
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <SectionHead
            title="Frequently Asked Questions"
            desc="Get answers to common questions about verification"
            tag="FAQ"
          />
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto space-y-4"
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
          {FAQ_DATA.map((faq, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onToggle={() => toggleFaq(index)}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
