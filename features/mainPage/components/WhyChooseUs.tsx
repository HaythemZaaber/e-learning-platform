"use client";

import { useState } from "react";
import {
  ShieldCheck,
  CalendarClock,
  GraduationCap,
  Users,
  Check,
  Globe,
  Sparkles,
  Award,
  BadgeCheck,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHead from "@/components/shared/SectionHead";

const colorClasses = {
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

type ColorKey = keyof typeof colorClasses;
interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  benefits?: string[];
  color?: ColorKey;
  accent?: boolean;
}

interface FeatureCategory {
  id: string;
  label: string;
  features: Feature[];
}

// Feature data organized by categories
const featureCategories: FeatureCategory[] = [
  {
    id: "quality",
    label: "Qualité",
    features: [
      {
        icon: ShieldCheck,
        title: "Formateurs vérifiés",
        description:
          "Chaque formateur est rigoureusement évalué par IA et par des experts humains pour garantir un niveau d'excellence.",
        benefits: [
          "Vérification d'identité",
          "Évaluation des compétences",
          "Suivi de la satisfaction",
        ],
        color: "blue",
        accent: true,
      },
      {
        icon: GraduationCap,
        title: "Pour tous les niveaux",
        description:
          "Des cours adaptés à chaque âge et niveau, du primaire au professionnel avec des contenus personnalisés.",
        benefits: [
          "Cursus progressifs",
          "Évaluations régulières",
          "Adaptation au rythme d'apprentissage",
        ],
        color: "indigo",
      },
      {
        icon: Award,
        title: "Excellence pédagogique",
        description:
          "Méthodologies d'enseignement modernes et efficaces basées sur les dernières recherches en pédagogie.",
        benefits: [
          "Cours interactifs",
          "Supports multimédia",
          "Mise en pratique immédiate",
        ],
        color: "purple",
      },
      {
        icon: Globe,
        title: "Accessibilité globale",
        description:
          "Plateforme disponible en plusieurs langues avec des formateurs du monde entier pour une expérience enrichissante.",
        benefits: [
          "Interface multilingue",
          "Formateurs internationaux",
          "Contenus culturellement diversifiés",
        ],
        color: "green",
      },
    ],
  },
  {
    id: "flexibility",
    label: "Flexibilité",
    features: [
      {
        icon: CalendarClock,
        title: "Horaires flexibles",
        description:
          "Choisissez des créneaux selon vos disponibilités, en groupe ou en individuel, 24/7 et sans contrainte de lieu.",
        benefits: [
          "Cours à la demande",
          "Sessions enregistrées",
          "Rappels automatiques",
        ],
        color: "amber",
        accent: true,
      },
      {
        icon: Users,
        title: "Apprentissage personnalisé",
        description:
          "Plans d'apprentissage adaptés à votre style et à vos objectifs spécifiques pour une progression optimale.",
        benefits: [
          "Test de niveau initial",
          "Objectifs personnalisés",
          "Suivi de progression détaillé",
        ],
        color: "pink",
      },
      {
        icon: Sparkles,
        title: "Formules adaptables",
        description:
          "Différentes formules d'abonnement selon vos besoins et votre budget, sans engagement à long terme.",
        benefits: [
          "Essai gratuit",
          "Paiement à la séance possible",
          "Formules familiales",
        ],
        color: "cyan",
      },
      {
        icon: ThumbsUp,
        title: "Satisfaction garantie",
        description:
          "Nous garantissons votre satisfaction ou vous êtes remboursé, sans question et sans délai.",
        benefits: [
          "Premier cours remboursable",
          "Changement de formateur possible",
          "Support client réactif",
        ],
        color: "orange",
      },
    ],
  },
  {
    id: "security",
    label: "Sécurité",
    features: [
      {
        icon: BadgeCheck,
        title: "Apprentissage sécurisé",
        description:
          "Espace protégé pour enfants, outils de suivi parental, modération active et environnement respectueux.",
        benefits: [
          "Filtrage des contenus",
          "Surveillance des interactions",
          "Signalement facile",
        ],
        color: "red",
        accent: true,
      },
      {
        icon: ShieldCheck,
        title: "Protection des données",
        description:
          "Vos données personnelles et pédagogiques sont sécurisées selon les normes les plus strictes (RGPD).",
        benefits: [
          "Chiffrement des données",
          "Politique de confidentialité claire",
          "Contrôle de vos informations",
        ],
        color: "green",
      },
      {
        icon: Users,
        title: "Communauté bienveillante",
        description:
          "Une communauté d'apprenants et de formateurs soigneusement modérée pour un apprentissage serein.",
        benefits: [
          "Charte de conduite",
          "Modération proactive",
          "Système de réputation",
        ],
        color: "blue",
      },
      {
        icon: CalendarClock,
        title: "Support réactif",
        description:
          "Une équipe de support disponible rapidement pour résoudre vos problèmes et répondre à vos questions.",
        benefits: [
          "Chat en direct",
          "Support téléphonique",
          "Centre d'aide complet",
        ],
        color: "purple",
      },
    ],
  },
];

export default function WhyChooseUs() {
  const [selectedTab, setSelectedTab] = useState("quality");
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Color mapping for icons

  // Get current category features
  const currentFeatures =
    featureCategories.find((cat) => cat.id === selectedTab)?.features || [];

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Tabs
            defaultValue="quality"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full max-w-3xl mx-auto"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              {featureCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-sm md:text-base py-3"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {currentFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onHoverStart={() => setHoveredFeature(idx)}
              onHoverEnd={() => setHoveredFeature(null)}
            >
              <Card
                className={`shadow-md hover:shadow-xl transition duration-300 h-full border ${
                  feature.accent
                    ? "border-l-4 border-l-indigo-500"
                    : "border-gray-100"
                }`}
              >
                <CardContent className="p-6 flex flex-col h-full">
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
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {feature.description}
                  </p>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredFeature === idx ? 1 : 0,
                      height: hoveredFeature === idx ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {feature.benefits && (
                      <ul className="mt-3 space-y-2">
                        {feature.benefits.map((benefit, bidx) => (
                          <li
                            key={bidx}
                            className="flex items-start text-sm text-gray-600"
                          >
                            <Check
                              size={16}
                              className="min-w-4 text-green-500 mt-1 mr-2"
                            />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      className="w-full justify-center hover:bg-indigo-50 hover:text-indigo-600 text-gray-600"
                      onClick={() =>
                        setHoveredFeature(hoveredFeature === idx ? null : idx)
                      }
                    >
                      {hoveredFeature === idx ? "Voir moins" : "En savoir plus"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-lg"
            size="lg"
          >
            Démarrer gratuitement
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Essai gratuit de 7 jours, sans engagement
          </p>
        </motion.div>
      </div>
    </section>
  );
}
