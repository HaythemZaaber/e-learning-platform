import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthFormContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const AuthFormContainer = ({
  title,
  subtitle,
  children,
}: AuthFormContainerProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
      {title}
    </h2>
    {subtitle && <p className="text-gray-600 mb-6 text-center">{subtitle}</p>}
    {children}
  </motion.div>
);
