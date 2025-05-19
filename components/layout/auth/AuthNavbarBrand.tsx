"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const AuthNavbarBrand = () => {
  const router = useRouter();
  return (
    <motion.div
      className="flex items-center gap-2 cursor-pointer fixed top-0 z-50 p-5 bg-transparent"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={() => router.push("/")}
    >
      <BookOpen className="h-6 w-6 text-white" />
      <span className="font-bold text-2xl text-white">ELearning</span>
    </motion.div>
  );
};

export default AuthNavbarBrand;
