"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import ContactTeam from "./ContactTeam";

export default function FaqSection() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const faqItems = [
    {
      id: "item-1",
      question: "Who can become an instructor on the platform?",
      answer:
        "Anyone with verifiable expertise in a specific field can register as an instructor after profile validation. We assess qualifications, experience, and certifications before approving new instructors.",
    },
    {
      id: "item-2",
      question: "Are the courses paid?",
      answer:
        "Some courses are free, while others are paid based on the pricing model chosen by the instructor. You can filter courses by price. We also offer monthly subscriptions for unlimited access to certain premium content.",
    },
    {
      id: "item-3",
      question: "How are payments secured?",
      answer:
        "Payments are processed via Stripe, a PCI DSS Level 1 secure payment system. You can choose between payment before or after the session based on the instructor's preferences. All transactions are encrypted and protected.",
    },
    {
      id: "item-4",
      question: "Are there courses for children?",
      answer:
        "Yes, our Junior section offers courses specially adapted for young learners with parental controls. All our children's instructors are certified and undergo background checks.",
    },
    {
      id: "item-5",
      question: "Can I get a certificate after completing a course?",
      answer:
        "Most of our paid courses offer industry-recognized completion certificates. These certificates can be shared directly on LinkedIn or downloaded as PDFs.",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const contentVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-[90vw] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-4"
        >
          <Accordion
            type="single"
            collapsible
            className="space-y-4"
            value={activeItem || undefined}
            onValueChange={setActiveItem}
          >
            {faqItems.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <AccordionItem
                  value={item.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{
                          rotate: activeItem === item.id ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-5 w-5 text-primary shrink-0 transition-transform duration-200" />
                      </motion.div>
                      <span className="font-medium text-lg text-gray-900">
                        {item.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AnimatePresence>
                    {activeItem === item.id && (
                      <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={contentVariants}
                      >
                        <AccordionContent className="px-6 pb-4 pt-0 text-gray-600">
                          {item.answer}
                        </AccordionContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-6">
            Can't find the answer to your question?
          </p>

          <ContactTeam />
        </motion.div>
      </div>
    </section>
  );
}