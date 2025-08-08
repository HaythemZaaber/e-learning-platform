import { Course } from "@/types/courseTypes";

interface CourseDescriptionProps {
  course: Course;
}

export function CourseDescription({ course }: CourseDescriptionProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Description</h2>
      <div className="space-y-4 text-gray-700">
        <p>{course.description}</p>
        {course.shortDescription && course.shortDescription !== course.description && (
          <p>{course.shortDescription}</p>
        )}
      </div>
    </div>
  );
}
