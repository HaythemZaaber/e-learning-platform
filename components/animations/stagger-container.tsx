"use client"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerChildren?: number
}

export function StaggerContainer({ 
  children, 
  className, 
  staggerChildren = 0.1 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}