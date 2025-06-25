"use client";

import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                ED
              </div>
              <span className="font-bold text-xl text-foreground">
                EduConnect
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#why-verify"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Why Verify
              </Link>
              <a
                href="#process"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Process
              </a>
              <a
                href="#success-stories"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Success Stories
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                FAQ
              </a>
            </nav>

            <Link href="/become-instructor/verification">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-blue-700 hover:to-blue-800">
                Start Verification
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </header>
  );
}
