'use client'

import { motion } from 'framer-motion'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import Link from 'next/link'

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 text-white px-6 py-12"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div>
          <h2 className="text-xl font-semibold mb-4">EduConnect</h2>
          <p className="text-sm text-gray-400">
            Your global destination for expert-led courses. Learn anything, anytime, anywhere.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-medium mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/courses">Courses</Link></li>
            <li><Link href="/teachers">Teachers</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-medium mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-gray-400">
            <a href="https://facebook.com" target="_blank"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-medium mb-3">Contact</h3>
          <p className="text-sm text-gray-400">Email: support@educonnect.com</p>
          <p className="text-sm text-gray-400">Phone: +1 (555) 123-4567</p>
          <p className="text-sm text-gray-400">Address: 123 Edu Lane, Knowledge City</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} EduConnect. All rights reserved.
      </div>
    </motion.footer>
  )
}

export default Footer
