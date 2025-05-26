import { Button } from "@/components/ui/button";
import {
  FaInfoCircle,
  FaListUl,
  FaClipboardList,
  FaUser,
  FaStar,
} from "react-icons/fa";

interface CourseNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { label: "Overview", icon: <FaInfoCircle />, key: "overview" },
  { label: "Course Content", icon: <FaListUl />, key: "content" },
  { label: "Details", icon: <FaClipboardList />, key: "details" },
  { label: "Instructor", icon: <FaUser />, key: "instructor" },
  { label: "Review", icon: <FaStar />, key: "review" },
];

export function CourseNavigation({
  activeSection,
  onSectionChange,
}: CourseNavigationProps) {
  return (
    <nav
      className="flex overflow-x-auto gap-2 border-b pb-1 sticky top-16 bg-white "
      aria-label="Course sections"
    >
      {/* Optional: Gradient fade for scroll hint */}
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white pointer-events-none z-10" />
      {sections.map(({ label, icon, key }) => (
        <Button
          key={key}
          variant="ghost"
          className={`rounded-none relative px-4 py-2 transition-all
            ${
              activeSection === key
                ? "border-b-2 border-blue-600 text-blue-600 font-bold bg-blue-50"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }
          `}
          aria-current={activeSection === key ? "page" : undefined}
          onClick={() => onSectionChange(key)}
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
