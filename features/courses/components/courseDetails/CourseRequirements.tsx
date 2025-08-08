import { Course } from "@/types/courseTypes";

interface CourseRequirementsProps {
  course: Course;
}

export function CourseRequirements({ course }: CourseRequirementsProps) {
  const requirements = course.requirements || [];

  if (requirements.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Requirements</h2>
      <ul className="space-y-2">
        {requirements.map((req, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            <span>{req}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
