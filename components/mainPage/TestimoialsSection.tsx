"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sami B.",
    avatar: "/avatars/sami.jpg",
    fallback: "SB",
    review:
      "Une plateforme exceptionnelle ! J'ai trouvé un professeur de mathématiques génial pour mon fils. Très satisfait.",
    course: "Mathématiques pour collégiens",
  },
  {
    name: "Ines D.",
    avatar: "/avatars/ines.jpg",
    fallback: "ID",
    review:
      "Les cours sont variés et très bien expliqués. J'ai adoré l'expérience avec le mentorat.",
    course: "Développement personnel",
  },
  {
    name: "Ali K.",
    avatar: "/avatars/ali.jpg",
    fallback: "AK",
    review:
      "Interface intuitive, enseignants qualifiés, et support réactif. Je recommande fortement !",
    course: "Anglais conversationnel",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="">
      <div className="w-[90vw] container">
        <h2 className="text-3xl font-bold mb-4">
          Ce que disent nos apprenants
        </h2>
        <p className="text-muted-foreground mb-12">
          Découvrez comment notre plateforme a transformé leur façon
          d'apprendre.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Card className="shadow-xl rounded-2xl p-6">
                <CardContent className="flex flex-col items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.fallback}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-center text-muted-foreground">
                    "{t.review}"
                  </p>
                  <div className="mt-4 text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground italic">
                    Cours : {t.course}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
