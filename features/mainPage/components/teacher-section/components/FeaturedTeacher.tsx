import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Bookmark } from "lucide-react";
import Image from "next/image";
import { Teacher } from "../../../types/teacherTypes";

interface FeaturedTeacherProps {
  teacher: Teacher;
  isSaved: boolean;
  onSave: (id: number) => void;
}

export function FeaturedTeacher({
  teacher,
  isSaved,
  onSave,
}: FeaturedTeacherProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-64 md:h-auto overflow-hidden">
          <div className="h-full w-full">
            <Image
              src={teacher.image}
              alt={teacher.name}
              fill
              className="object-cover"
            />
            {teacher.featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                  Featured Teacher
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {teacher.name}
          </h3>
          <p className="text-indigo-600 font-medium mb-3">{teacher.subject}</p>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={18}
                className={`${
                  idx < Math.round(teacher.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                } mr-1`}
              />
            ))}
            <span className="ml-2 text-gray-600">
              {teacher.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-gray-700 mb-6">{teacher.bio}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {teacher.achievements?.map((achievement, i) => (
              <Badge key={i} variant="secondary" className="bg-gray-100">
                {achievement}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Book a Session <ArrowRight size={16} className="ml-2" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onSave(teacher.id)}
                className={isSaved ? "text-pink-600" : ""}
              >
                <Bookmark
                  size={18}
                  className={isSaved ? "fill-pink-600" : ""}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
