"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserRole } from "./ClientNavbar";

// Define mobile menu items based on user role
const getMenuItemsByRole = (role: UserRole) => {
  const baseMenuItems = ["Find Teacher"];

  switch (role) {
    case "visitor":
      return [...baseMenuItems, "Become a Teacher", "Group Classes"];
    case "student":
      return [...baseMenuItems, "My Courses", "My Schedule", "Group Classes"];
    case "teacher":
      return ["My Students", "My Schedule", "Create Content", "Earnings"];
    case "parent":
      return [...baseMenuItems, "My Children", "Payment & Billing"];
    default:
      return baseMenuItems;
  }
};

// Get CTA button based on role
const getCtaButton = (role: UserRole, isLoggedIn: boolean) => {
  if (!isLoggedIn) {
    return {
      label: "Get Started",
      action: () => console.log("Sign up clicked"),
    };
  }

  switch (role) {
    case "student":
      return {
        label: "Find New Course",
        action: () => console.log("Find course clicked"),
      };
    case "teacher":
      return {
        label: "Create New Course",
        action: () => console.log("Create course clicked"),
      };
    case "parent":
      return {
        label: "Monitor Progress",
        action: () => console.log("Monitor progress clicked"),
      };
    default:
      return {
        label: "Dashboard",
        action: () => console.log("Dashboard clicked"),
      };
  }
};

interface NavbarMobileMenuProps {
  userRole: UserRole;
  isLoggedIn: boolean;
}

const NavbarMobileMenu = ({ userRole, isLoggedIn }: NavbarMobileMenuProps) => {
  const menuItems = getMenuItemsByRole(userRole);
  const ctaButton = getCtaButton(userRole, isLoggedIn);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden overflow-hidden mt-3"
    >
      <ul className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
        {menuItems.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="block px-1 py-2 text-gray-700 hover:text-accent transition-colors"
            >
              {item}
            </a>
          </li>
        ))}
        <li className="!mt-4">
          <Button
            className="w-full bg-accent hover:bg-accent/90"
            onClick={ctaButton.action}
          >
            {ctaButton.label}
          </Button>
        </li>
      </ul>
    </motion.div>
  );
};

export default NavbarMobileMenu;
