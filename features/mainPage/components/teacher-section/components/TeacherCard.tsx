import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Bookmark } from "lucide-react";
import Image from "next/image";
import { Teacher } from "../../../types/teacher";

interface TeacherCardProps {
  teacher: Teacher;
  isSaved: boolean;
  onSave: (id: number) => void;
}

export function TeacherCard({ teacher, isSaved, onSave }: TeacherCardProps) {
  return (
    <Card className="rounded-2xl shadow-md overflow-hidden h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <Image
          src={teacher.image}
          alt={teacher.name}
          width={400}
          height={300}
          className="w-full h-56 object-cover"
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={() => onSave(teacher.id)}
        >
          <Bookmark
            size={18}
            className={isSaved ? "fill-pink-600 text-pink-600" : ""}
          />
        </Button>
      </div>
      <CardContent className="p-6 text-left">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {teacher.name}
        </h3>
        <p className="text-sm text-indigo-600 mb-2">{teacher.subject}</p>
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, idx) => (
            <Star
              key={idx}
              size={16}
              className={`${
                idx < Math.round(teacher.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              } mr-1`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {teacher.rating.toFixed(1)}
          </span>
        </div>

        {teacher.availability && (
          <div className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Available: </span>
            {teacher.availability}
          </div>
        )}

        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{teacher.bio}</p>

        <Button className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 mt-2">
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
