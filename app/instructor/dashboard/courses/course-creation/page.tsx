import CourseCreation from "@/features/course-creation/components/CourseCreation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="py-16 md:py-20  w-[90vw] mx-auto">
        <CourseCreation />
      </div>
    </div>
  );
}
