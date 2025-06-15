
import { Button } from "@/components/ui/button";
import { CourseList } from "@/features/courses/shared/CourseList";
import { Plus } from "lucide-react";

export default function CoursesPage() {
  const handleCourseAction = (action: string, courseId: string) => {
    console.log(`${action} course:`, courseId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Course Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your courses
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      <CourseList
        variant="grid"
        cardVariant="detailed"
        showFilters={true}
        showActions={true}
     
      />
    </div>
  );
}
