"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  const socialLinks = [
    { icon: FaFacebookF, url: "https://facebook.com" },
    { icon: FaTwitter, url: "https://twitter.com" },
    { icon: FaInstagram, url: "https://instagram.com" },
    { icon: FaLinkedinIn, url: "https://linkedin.com" },
    { icon: FaYoutube, url: "https://youtube.com" },
  ];

  const exploreLinks = [
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
    { name: "Teachers", url: "/teachers" },
    { name: "Pricing", url: "/pricing" },
    { name: "About Us", url: "/about" },
    { name: "Contact", url: "/contact" },
  ];

  const legalLinks = [
    { name: "Terms of Service", url: "/terms" },
    { name: "Privacy Policy", url: "/privacy" },
    { name: "Cookie Policy", url: "/cookies" },
  ];

  return (
    <div className="bg-gradient-to-br from-secondary to-primary text-white font-semibold">
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-[90vw] container py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              EduConnect
            </h2>
            <p className="text-sm text-white/80">
              Your global destination for expert-led courses. Learn anything,
              anytime, anywhere.
            </p>

            {/* Newsletter Subscription */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Subscribe to our newsletter
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  id="email"
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Join
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Explore Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.url}
                    className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/80">
                <MdEmail className="mt-0.5 flex-shrink-0" />
                support@educonnect.com
              </li>
              <li className="flex items-start gap-3 text-sm text-white/80">
                <MdPhone className="mt-0.5 flex-shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-3 text-sm text-white/80">
                <MdLocationOn className="mt-0.5 flex-shrink-0" />
                123 Edu Lane, Knowledge City
              </li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.url}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full h-px bg-white/20 my-8"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60"
        >
          <div>
            © {new Date().getFullYear()} EduConnect. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </motion.div>
      </motion.footer>
    </div>
  );
};

export default Footer;
