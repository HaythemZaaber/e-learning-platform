import { Sparkles, TrendingUp, BarChart3, Users } from "lucide-react";
import { CounterData } from "../types/counterTypes";

export const defaultCounterData = {
  counterOne: [
    {
      tag: "POURQUOI NOUS CHOISIR",
      title: "Une Plateforme Innovante",
      subTitle: "Pour Tous les Savoirs",
      desc: "Notre plateforme d'e-learning offre un environnement où chaque individu peut enseigner et apprendre en toute confiance grâce à un système avancé de vérification des formateurs.",
      body: [
        {
          text: "Apprenants Actifs",
          num: 5000,
          img: "/images/icons/counter-01.png",
          top: true,
          color: "text-blue-600",
          icon: <Users className="h-6 w-6" />,
        },
        {
          text: "Cours Disponibles",
          num: 800,
          img: "/images/icons/counter-02.png",
          top: false,
          color: "text-purple-600",
          icon: <BarChart3 className="h-6 w-6" />,
        },
        {
          text: "Formateurs Certifiés",
          num: 1200,
          img: "/images/icons/counter-03.png",
          top: true,
          color: "text-accent",
          icon: <Sparkles className="h-6 w-6" />,
        },
        {
          text: "Domaines d'Expertise",
          num: 100,
          img: "/images/icons/counter-04.png",
          top: false,
          color: "text-green-600",
          icon: <BarChart3 className="h-6 w-6" />,
        },
      ],
    },
  ],
};
