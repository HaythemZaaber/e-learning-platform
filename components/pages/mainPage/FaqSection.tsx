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
      question: "Qui peut devenir formateur sur la plateforme ?",
      answer:
        "Toute personne disposant d'une expertise vérifiable dans un domaine spécifique peut s'inscrire comme formateur, après validation de son profil. Nous évaluons les qualifications, l'expérience et les certifications avant d'approuver un nouveau formateur.",
    },
    {
      id: "item-2",
      question: "Est-ce que les cours sont payants ?",
      answer:
        "Certains cours sont gratuits, d'autres sont payants selon le modèle choisi par le formateur. Vous pouvez filtrer les cours par tarif. Nous offrons également des abonnements mensuels pour un accès illimité à certains contenus premium.",
    },
    {
      id: "item-3",
      question: "Comment les paiements sont-ils sécurisés ?",
      answer:
        "Les paiements sont traités via Stripe, un système de paiement sécurisé de niveau 1 PCI DSS. Vous pouvez choisir entre paiement avant ou après la session selon les préférences du formateur. Toutes les transactions sont cryptées et protégées.",
    },
    {
      id: "item-4",
      question: "Y a-t-il des cours pour enfants ?",
      answer:
        "Oui, notre section Junior propose des cours spécialement adaptés aux jeunes apprenants avec contrôle parental. Tous nos formateurs pour enfants sont certifiés et passent des vérifications de casier judiciaire.",
    },
    {
      id: "item-5",
      question: "Puis-je obtenir un certificat après un cours ?",
      answer:
        "La plupart de nos cours payants offrent des certificats de complétion reconnus par l'industrie. Ces certificats peuvent être partagés directement sur LinkedIn ou téléchargés au format PDF.",
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
          Questions fréquentes
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
            Vous ne trouvez pas la réponse à votre question ?
          </p>

          <ContactTeam />
        </motion.div>
      </div>
    </section>
  );
}
