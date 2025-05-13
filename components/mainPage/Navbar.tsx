"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, Menu, X, Bell, BookOpen, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Navbar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Demo state for auth status

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav
      className={cn(
        "w-full z-50 transition-all duration-300 ease-in-out",
        isSticky
          ? "sticky top-0 bg-white/95 backdrop-blur-sm shadow-md py-3"
          : "relative bg-gradient-to-r from-primary/5 to-primary/10 py-4"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className=" w-[90vw] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <BookOpen className="h-6 w-6 text-accent" />
              <span className="font-bold text-2xl bg-gradient-to-r from-accent to-blue-600 bg-clip-text text-transparent">
                ELearning
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-10">
              <ul className="flex space-x-8">
                {["Become a teacher", "Find Teacher", "Group Class"].map(
                  (item, index) => (
                    <motion.li
                      key={item}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-1 text-gray-700 hover:text-accent transition-colors font-medium focus:outline-none">
                            {item}
                            <ChevronDown className="h-4 w-4 opacity-70" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-56 mt-1"
                        >
                          {[1, 2, 3].map((subItem) => (
                            <DropdownMenuItem
                              key={subItem}
                              className="cursor-pointer"
                            >
                              {`${item} Option ${subItem}`}
                              {subItem === 1 && index === 0 && (
                                <Badge
                                  className="ml-2 bg-accent text-white"
                                  variant="secondary"
                                >
                                  New
                                </Badge>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.li>
                  )
                )}
              </ul>
            </div>
          </motion.div>

          {/* Right Section: Search, Auth, etc. */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Search Bar */}
            {isSticky && (
              <motion.div
                className={cn(
                  "flex items-center bg-white rounded-full overflow-hidden border",
                  "transition-all duration-300 ease-in-out",
                  "hover:shadow-md hover:border-accent/50",
                  isSearchExpanded
                    ? "border-accent shadow-lg"
                    : "border-gray-200 shadow-sm"
                )}
                animate={{
                  width: isSearchExpanded ? 280 : isSticky ? 180 : 200,
                  boxShadow: isSearchExpanded
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
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  whileTap={{ scale: 0.9 }}
                >
                  <Search
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isSearchExpanded
                        ? "text-accent scale-110"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  />
                </motion.div>

                <Input
                  placeholder={
                    isSearchExpanded
                      ? "Search courses, teachers, or topics..."
                      : "Search..."
                  }
                  className={cn(
                    "border-0 bg-transparent h-9",
                    "focus-visible:shadow-none focus-visible:ring-0",
                    "transition-all duration-200",
                    "placeholder-gray-400 focus:placeholder-gray-300"
                  )}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => setIsSearchExpanded(false)}
                />

                {isSearchExpanded && (
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
                        // Add your search logic here
                        setIsSearchExpanded(false);
                      }}
                    >
                      Search
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Auth Buttons or User Menu */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative cursor-pointer"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    3
                  </span>
                </motion.div>

                {/* User Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer transition-transform hover:scale-110">
                      <AvatarFallback className="bg-accent text-white">
                        US
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>My Profile</DropdownMenuItem>
                    <DropdownMenuItem>My Courses</DropdownMenuItem>
                    <DropdownMenuItem>Account Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:inline-flex border-2 border-primary/20 bg-transparent hover:bg-primary/10 hover:border-primary/30 group transition-all duration-300 relative overflow-hidden"
                    onClick={() => setIsLoggedIn(true)}
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Sign Up
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button
                    size="sm"
                    className="relative bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-lg hover:shadow-primary/30 transition-all duration-300 group overflow-hidden"
                    onClick={() => setIsLoggedIn(true)}
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                      </svg>
                      Sign In
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-1.5 rounded-md bg-accent/10 text-gray-700"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden mt-3"
            >
              <ul className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
                {["Become a teacher", "Find Teacher", "Group Class"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="block px-1 py-2 text-gray-700 hover:text-accent transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
                <li className="!mt-4">
                  <Button
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={() => setIsLoggedIn(true)}
                  >
                    Get Started
                  </Button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
