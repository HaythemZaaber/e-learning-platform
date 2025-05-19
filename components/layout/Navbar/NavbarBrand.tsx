"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const NavbarBrand = () => {
  return (
    <motion.div
      className="flex items-center gap-2 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <BookOpen className="h-6 w-6 text-accent" />
      <span className="font-bold text-2xl bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
        ELearning
      </span>
    </motion.div>     
  );
};

export default NavbarBrand;
