"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, School } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="bg-gradient-to-br from-primary to-secondary py-20 px-4 ">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-4 text-white"
        >
          Start your learning journey today!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg mb-8 text-gray-50"
        >
          Join thousands of learners and teachers worldwide.
        </motion.p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/courses">
              <Button className="text-lg px-6 py-4 cursor-pointer hover:bg-primary/80 hover:scale-105 transition-all duration-300 ">
                <ArrowRight className="mr-2" /> Browse Courses
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/become-instructor">
              <Button
                variant="outline"
                className=" text-lg px-6 py-4 hover:border-none cursor-pointer text-white bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all duration-300 "
              >
                <School className="mr-2" /> Become an Instructor
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
