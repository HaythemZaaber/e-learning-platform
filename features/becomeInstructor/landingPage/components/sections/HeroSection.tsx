"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "../../layout/Container";
import { ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion"; 
import Image from "next/image";
import becomeInstructor from "@/public/images/becomeInstructor.jpg";   
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-20 lg:py-32">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <Heart className="w-4 h-4 mr-1" />
                  Join 15,000+ Verified Instructors
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Transform Your Teaching
                <span className="text-blue-600"> Passion</span> Into
                <span className="text-secondary"> Income</span>
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Join thousands of verified instructors earning $50-200+ per hour
                teaching what you love
              </motion.p>
            </div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link href="/become-instructor/verification">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-base cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out mb-5"
              >
                Start Verification Process
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"
                    ></div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  Join 15,000+ Verified Instructors
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="  transform rotate-2 flex justify-center items-center"
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={becomeInstructor}
                alt="Instructor teaching students"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 bg-green-500 text-white p-4 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
            >
              <div className="text-2xl font-bold">$75/hr</div>
              <div className="text-sm">Average Earnings</div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
