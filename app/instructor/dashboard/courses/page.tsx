import { Button } from "@/components/ui/button";
import { InstructorCourseList } from "@/features/courses/components/instructor/InstructorCourseList";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
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
        <Link href="/instructor/dashboard/courses/course-creation">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      <InstructorCourseList
        variant="grid"
        showFilters={true}
      />
    </div>
  );
}
