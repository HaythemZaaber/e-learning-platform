import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  Bookmark,
  Play,
  Clock,
  Users,
  MapPin,
  Globe,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Instructor } from "@/data/instructorsData";
import Link from "next/link";

interface TeacherCardProps {
  instructor: Instructor;
  isSaved: boolean;
  onSave: (id: string) => void;
}

export function TeacherCard({ instructor, isSaved, onSave }: TeacherCardProps) {
  const {
    id,
    name,
    title,
    avatar,
    rating,
    reviewsCount,
    studentsCount,
    shortBio,
    isOnline,
    liveSessionsEnabled,
    nextAvailableSlot,
    location,
    languages,
    isVerified,
    coursesCount,
  } = instructor;

  return (
    <Card className="rounded-2xl pt-0 shadow-md overflow-hidden h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <Image
          src={avatar}
          alt={name}
          width={400}
          height={300}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => onSave(id)}
          >
            <Bookmark
              size={18}
              className={isSaved ? "fill-pink-600 text-pink-600" : ""}
            />
          </Button>
        </div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isOnline && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              Online
            </Badge>
          )}
          {isVerified && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs flex items-center gap-1">
              Verified
            </Badge>
          )}
          {liveSessionsEnabled && (
            <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-xs flex items-center gap-1">
              <Play className="h-3 w-3" />
              Live Sessions
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-6 py-0 text-left">
        <Link href={`/instructors/${id}`} className="hover:underline">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
        </Link>
        <p className="text-sm text-indigo-600 mb-2">{title}</p>

        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, idx) => (
            <Star
              key={idx}
              size={16}
              className={`${
                idx < Math.round(rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              } mr-1`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating.toFixed(1)} ({reviewsCount.toLocaleString()})
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {studentsCount.toLocaleString()} students
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{shortBio}</p>

        {liveSessionsEnabled && nextAvailableSlot && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-700">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Next: {nextAvailableSlot.time}</span>
              </div>
              <span className="font-medium text-purple-700">
                ${nextAvailableSlot.price}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {languages.map((lang) => (
            <Badge
              key={lang}
              variant="outline"
              className="text-xs"
            >
              {lang}
            </Badge>
          ))}
        </div>

        <Button className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 mt-2">
          {/* View Profile */}
          <Link href={`/instructors/${id}`} className="flex items-center gap-3">
            View Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
