"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { Menu, MessageSquareText, X } from "lucide-react";
import NavbarBrand from "./NavbarBrand";
import NavbarDesktopMenu from "./NavbarDesktopMenu";
import NavbarSearch from "./NavbarSearch";
import UserProfileMenu from "./UserProfileMenu";
import NavbarMobileMenu from "./NavbarMobileMenu";
import RoleSwitcher from "./RoleSwitcher";
import { useSearchStore } from "@/store/search.store";
import { AiAssistant } from "@/components/shared/AiAssistant";
import { Button } from "@/components/ui/button";

export type UserRole = "visitor" | "student" | "teacher" | "parent";

export interface NavbarProps {
  userRole?: UserRole;
  userName?: string;
  userInitials?: string;
  notificationCount?: number;
  onAiAssistantToggle?: () => void;
}

const ClientNavbar = ({
  userRole = "visitor",
  userName = "",
  userInitials = "",
  notificationCount = 0,
  onAiAssistantToggle = () => {},
}: NavbarProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const showNavbarSearch = useSearchStore((state) => state.showNavbarSearch);

  const isLoggedIn = userRole !== "visitor";

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
          : "relative  bg-primary/10  py-4"
      )}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-[90vw] mx-auto">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <NavbarBrand />

            <div className="hidden md:flex ml-10">
              <NavbarDesktopMenu userRole={userRole} />
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {isSticky && showNavbarSearch && (
              <NavbarSearch
                isExpanded={isSearchExpanded}
                setIsExpanded={setIsSearchExpanded}
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onAiAssistantToggle}
            >
              <MessageSquareText className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                AI
              </span>
              <span className="sr-only">Open AI Assistant</span>
            </Button>

            <RoleSwitcher />

            <UserProfileMenu
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              userInitials={userInitials}
              notificationCount={notificationCount}
            />

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

        <AnimatePresence>
          {isMobileMenuOpen && (
            <NavbarMobileMenu userRole={userRole} isLoggedIn={isLoggedIn} />
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default ClientNavbar;
