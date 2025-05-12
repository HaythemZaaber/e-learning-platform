// components/FaqSection.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqSection() {
  return (
    <section className="">
      <div className="w-[90vw] container">
        <h2 className="text-3xl font-bold text-center mb-10">
          Questions fréquentes
        </h2>
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Qui peut devenir formateur sur la plateforme ?
            </AccordionTrigger>
            <AccordionContent>
              Toute personne disposant d'une expertise vérifiable dans un
              domaine spécifique peut s'inscrire comme formateur, après
              validation de son profil.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Est-ce que les cours sont payants ?
            </AccordionTrigger>
            <AccordionContent>
              Certains cours sont gratuits, d'autres sont payants selon le
              modèle choisi par le formateur. Vous pouvez filtrer les cours par
              tarif.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Comment les paiements sont-ils sécurisés ?
            </AccordionTrigger>
            <AccordionContent>
              Les paiements sont traités via un système sécurisé avec option de
              paiement avant ou après la session selon les préférences du
              formateur.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Y a-t-il des cours pour enfants ?
            </AccordionTrigger>
            <AccordionContent>
              Oui, une section dédiée propose des cours spécialement adaptés aux
              jeunes apprenants avec contrôle parental.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
