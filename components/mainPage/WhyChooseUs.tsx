"use client";

import { ShieldCheck, CalendarClock, GraduationCap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SectionHead from "../shared/SectionHead";

const features = [
  {
    icon: ShieldCheck,
    title: "Formateurs vérifiés",
    description:
      "Chaque formateur est rigoureusement évalué par IA et par des experts humains.",
  },
  {
    icon: CalendarClock,
    title: "Horaires flexibles",
    description:
      "Choisissez des créneaux selon vos disponibilités, en groupe ou en individuel.",
  },
  {
    icon: GraduationCap,
    title: "Pour tous les niveaux",
    description:
      "Des cours adaptés à chaque âge, du primaire au professionnel.",
  },
  {
    icon: Users,
    title: "Apprentissage sécurisé",
    description:
      "Espace protégé pour enfants, outils de suivi parental, et plus encore.",
  },
];

export default function WhyChooseUs() {
  return (
    <section>
      <div className="container mx-auto px-4 text-center">
        {/* <h2 className="text-3xl font-bold mb-10 text-accentTitle">
          Pourquoi choisir notre plateforme ?
        </h2> */}
        <SectionHead
          tag="Why Choose Us"
          title="Pourquoi choisir notre plateforme ?"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, idx) => (
            <Card
              key={idx}
              className="shadow-md hover:shadow-lg transition duration-300"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-accent/10 p-4 rounded-full mb-4">
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
