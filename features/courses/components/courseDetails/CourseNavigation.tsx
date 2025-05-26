import { Button } from "@/components/ui/button";
import {
  FaInfoCircle,
  FaListUl,
  FaClipboardList,
  FaUser,
  FaStar,
} from "react-icons/fa";
import { useEffect, useRef } from "react";

interface CourseNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  {
    label: "Overview",
    icon: <FaInfoCircle />,
    key: "overview",
    id: "overview-section",
  },
  {
    label: "Course Content",
    icon: <FaListUl />,
    key: "content",
    id: "content-section",
  },
  {
    label: "Details",
    icon: <FaClipboardList />,
    key: "details",
    id: "details-section",
  },
  {
    label: "Instructor",
    icon: <FaUser />,
    key: "instructor",
    id: "instructor-section",
  },
  { label: "Review", icon: <FaStar />, key: "review", id: "review-section" },
];

export function CourseNavigation({
  activeSection,
  onSectionChange,
}: CourseNavigationProps) {
  const navRef = useRef<HTMLElement>(null);

  const handleSectionClick = (key: string, id: string) => {
    onSectionChange(key);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = navRef.current?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const navHeight = navRef.current?.offsetHeight || 0;
      const scrollPosition = window.scrollY + navHeight + 20;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.pageYOffset;
          const elementBottom = bottom + window.pageYOffset;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            if (activeSection !== section.key) {
              onSectionChange(section.key);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, onSectionChange]);

  return (
    <nav
      ref={navRef}
      className="flex overflow-x-auto gap-2 border-b shadow-md sticky top-16 bg-white z-20"
      aria-label="Course sections"
    >
      {/* Optional: Gradient fade for scroll hint */}
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white pointer-events-none z-10" />
      {sections.map(({ label, icon, key, id }) => (
        <Button
          key={key}
          variant="ghost"
          className={`rounded-none relative px-8 py-5 transition-all
            ${
              activeSection === key
                ? "border-b-2 border-blue-600 text-blue-600 font-bold bg-blue-50"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }
          `}
          aria-current={activeSection === key ? "page" : undefined}
          onClick={() => handleSectionClick(key, id)}
        >
          <span className="flex items-center gap-2 text-base">
            {icon}
            {label}
          </span>
        </Button>
      ))}
    </nav>
  );
}
