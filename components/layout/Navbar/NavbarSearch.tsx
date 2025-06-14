"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NavbarSearchProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const NavbarSearch = ({ isExpanded, setIsExpanded }: NavbarSearchProps) => {
  return (
    <motion.div
      className={cn(
        " items-center bg-white rounded-full overflow-hidden border hidden sm:flex",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-md hover:border-accent/50",
        isExpanded ? "border-accent shadow-lg" : "border-gray-200 shadow-sm"
      )}
      animate={{
        width: isExpanded ? 280 : 180,
        boxShadow: isExpanded
          ? "0 4px 20px rgba(0,0,0,0.1)"
          : "0 1px 3px rgba(0,0,0,0.1)",
      }}
      whileHover={{
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        borderColor: "rgba(99, 102, 241, 0.5)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      }}
    >
      <motion.div
        className="p-2 flex items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileTap={{ scale: 0.9 }}
      >
        <Search
          className={cn(
            "h-5 w-5 transition-all duration-200",
            isExpanded
              ? "text-accent scale-110"
              : "text-gray-500 hover:text-gray-700"
          )}
        />
      </motion.div>

      <Input
        placeholder={
          isExpanded ? "Search courses, teachers, or topics..." : "Search..."
        }
        className={cn(
          "border-0 bg-transparent h-9",
          "focus-visible:shadow-none focus-visible:ring-0",
          "transition-all duration-200",
          "placeholder-gray-400 focus:placeholder-gray-300"
        )}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => setIsExpanded(false)}
      />

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          className="pr-2"
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 hover:text-white rounded-full"
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            Search
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NavbarSearch;
