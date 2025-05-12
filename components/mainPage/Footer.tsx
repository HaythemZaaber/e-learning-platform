"use client";

import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-gradient-to-br from-secondary to-primary text-white">
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-[90vw] container pb-10"
      >
        <div className=" grid grid-cols-1 md:grid-cols-4 gap-10 font-semibold">
          {/* Logo & About */}
          <div>
            <h2 className="text-xl font-semibold mb-4">EduConnect</h2>
            <p className="text-sm ">
              Your global destination for expert-led courses. Learn anything,
              anytime, anywhere.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-medium mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/courses">Courses</Link>
              </li>
              <li>
                <Link href="/teachers">Teachers</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-medium mb-3">Follow Us</h3>
            <div className="flex space-x-4 ">
              <a href="https://facebook.com" target="_blank">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-medium mb-3">Contact</h3>
            <p className="text-sm ">Email: support@educonnect.com</p>
            <p className="text-sm ">Phone: +1 (555) 123-4567</p>
            <p className="text-sm ">Address: 123 Edu Lane, Knowledge City</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center text-sm mt-10 font-semibold">
          © {new Date().getFullYear()} EduConnect. All rights reserved.
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;
