import Image from "next/image"
import { Star } from "lucide-react"
import { CourseInstructor } from "@/types/courseTypes"

export function InstructorCard({ instructor }: { instructor: CourseInstructor }) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Instructor</h2>

      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={instructor.profileImage || "/placeholder.svg?height=80&width=80"}
            alt={`${instructor.firstName} ${instructor.lastName}`}
            width={80}
            height={80}
            className="object-cover"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-blue-600">
            {instructor.firstName} {instructor.lastName}
          </h3>

          {instructor.title && (
            <p className="text-sm text-gray-600 mt-1">{instructor.title}</p>
          )}

          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(instructor.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-sm">{instructor.averageRating || 0} Instructor Rating</span>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>{instructor.totalStudentsTaught || 0} Students</span>
            <span>{instructor.totalCourses || 0} Courses</span>
            <span>{instructor.experience || 0} years experience</span>
          </div>

          {instructor.instructorBio && (
            <p className="mt-3 text-gray-700">
              {instructor.instructorBio}
            </p>
          )}

          {instructor.expertise && instructor.expertise.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Expertise:</p>
              <div className="flex flex-wrap gap-1">
                {instructor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button className="p-1 border rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </button>
            <button className="p-1 border rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </button>
            <button className="p-1 border rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
