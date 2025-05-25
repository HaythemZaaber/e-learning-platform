import { Button } from "@/components/ui/button"

export function CourseNavigation() {
  return (
    <div className="flex overflow-x-auto gap-2 border-b pb-1">
      <Button variant="ghost" className="rounded-none border-b-2 border-blue-600 text-blue-600">
        Overview
      </Button>
      <Button variant="ghost" className="rounded-none">
        Course Content
      </Button>
      <Button variant="ghost" className="rounded-none">
        Details
      </Button>
      <Button variant="ghost" className="rounded-none">
        Instructor
      </Button>
      <Button variant="ghost" className="rounded-none">
        Review
      </Button>
    </div>
  )
}
