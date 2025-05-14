"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "./ClientNavbar";

interface MenuItem {
  label: string;
  subItems: string[];
  badges?: { index: number; label: string }[];
}

const getMenuItemsByRole = (role: UserRole): MenuItem[] => {
  const baseMenuItems: MenuItem[] = [
    {
      label: "Find Teacher",
      subItems: ["Browse Teachers", "Search by Subject", "Top Rated"],
    },
  ];

  switch (role) {
    case "visitor":
      return [
        ...baseMenuItems,
        {
          label: "Become a Teacher",
          subItems: ["How It Works", "Requirements", "Apply Now"],
          badges: [{ index: 0, label: "New" }],
        },
        {
          label: "Group Classes",
          subItems: ["Browse Classes", "Popular Subjects", "Upcoming"],
        },
      ];
    case "student":
      return [
        ...baseMenuItems,
        {
          label: "My Learning",
          subItems: ["My Courses", "Schedule", "Progress"],
        },
        {
          label: "Group Classes",
          subItems: ["Browse Classes", "My Enrollments", "Upcoming"],
        },
      ];
    case "teacher":
      return [
        {
          label: "My Teaching",
          subItems: ["Dashboard", "My Students", "Schedule"],
          badges: [{ index: 0, label: "New" }],
        },
        {
          label: "Create Content",
          subItems: ["New Course", "New Class", "Resources"],
        },
        {
          label: "Earnings",
          subItems: ["Overview", "Payment History", "Set Rates"],
        },
      ];
    case "parent":
      return [
        ...baseMenuItems,
        {
          label: "My Children",
          subItems: ["Profiles", "Progress", "Schedule"],
        },
        {
          label: "Payment & Billing",
          subItems: ["Payment Methods", "Transaction History", "Invoices"],
        },
      ];
    default:
      return baseMenuItems;
  }
};

interface NavbarDesktopMenuProps {
  userRole: UserRole;
}

const NavbarDesktopMenu = ({ userRole }: NavbarDesktopMenuProps) => {
  const menuItems = getMenuItemsByRole(userRole);

  return (
    <ul className="flex space-x-8">
      {menuItems.map((item, index) => (
        <motion.li
          key={item.label}
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
                {item.label}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mt-1">
              {item.subItems.map((subItem, subIndex) => (
                <DropdownMenuItem key={subItem} className="cursor-pointer">
                  {subItem}
                  {item.badges?.some((badge) => badge.index === subIndex) && (
                    <Badge
                      className="ml-2 bg-accent text-white"
                      variant="secondary"
                    >
                      {
                        item.badges.find((badge) => badge.index === subIndex)
                          ?.label
                      }
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.li>
      ))}
    </ul>
  );
};

export default NavbarDesktopMenu;
