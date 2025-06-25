"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AuthNavbarBrand = () => {
  const router = useRouter();
  return (
    <motion.div
      className="flex items-center gap-2 cursor-pointer fixed top-0 z-50 p-5 bg-transparent"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={() => router.push("/")}
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
          ED
        </div>
        <span className="font-bold text-xl text-white">EduConnect</span>
      </Link>
    </motion.div>
  );
};

export default AuthNavbarBrand;
