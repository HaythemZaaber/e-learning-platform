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
  Award,
  GraduationCap,
  Calendar,
  DollarSign,
  MessageCircle,
  CheckCircle,
  Zap,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TransformedInstructor } from "@/types/instructorGraphQLTypes";
import Link from "next/link";
import { FollowButton } from "@/components/shared/FollowButton";

interface TeacherCardProps {
  instructor: TransformedInstructor;
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
    experience,
    education,
    skills,
    categories,
    responseTime,
    completionRate,
    priceRange,
  } = instructor;

  // Calculate availability status
  const getAvailabilityStatus = () => {
    if (isOnline)
      return { status: "Online Now", color: "bg-green-500", icon: "🟢" };
    if (nextAvailableSlot)
      return { status: "Available Today", color: "bg-blue-500", icon: "📅" };
    return { status: "Available Soon", color: "bg-gray-500", icon: "⏰" };
  };

  const availability = getAvailabilityStatus();

  return (
    <Card className="rounded-2xl pt-0 shadow-md overflow-hidden h-full border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <Image
          src={avatar}
          alt={name}
          width={400}
          height={300}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <FollowButton
            instructorId={id}
            size="icon"
            variant="outline"
            className="bg-white/80 backdrop-blur-sm hover:bg-white cursor-pointer"
            initialIsFollowing={instructor.follow?.isFollowing}
          />
        </div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge
            className={`${availability.color} hover:${availability.color} text-white text-xs flex items-center gap-1`}
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            {availability.status}
          </Badge>
          {isVerified && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
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
      <CardContent className="p-4 py-3 text-left">
        <Link href={`/instructors/${id}`} className="hover:underline">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        </Link>
        <p className="text-sm text-indigo-600 mb-2">{title}</p>

        {/* Rating and Key Stats in one row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={14}
                className={`${
                  idx < Math.round(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                } mr-0.5`}
              />
            ))}
            <span className="ml-1 text-xs text-gray-600">
              {rating.toFixed(1)} ({reviewsCount.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {studentsCount.toLocaleString()}
            </div>
            {typeof instructor.follow?.totalFollowers === "number" && (
              <div className="flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                {instructor.follow.totalFollowers.toLocaleString()}
              </div>
            )}
            <div className="flex items-center">
              <GraduationCap className="h-3 w-3 mr-1" />
              {coursesCount}
            </div>
          </div>
        </div>

        {/* Bio - shorter */}
        <p className="text-xs text-gray-700 mb-3 line-clamp-2">{shortBio}</p>

        {/* Expertise - compact */}
        {skills && skills.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 2).map((skill, index) => (
                <Badge
                  key={`${skill.name}-${index}`}
                  variant="outline"
                  className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700 px-2 py-0.5"
                >
                  {skill.name}
                </Badge>
              ))}
              {skills.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs text-gray-500 px-2 py-0.5"
                >
                  +{skills.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Session Pricing - compact */}
        {liveSessionsEnabled && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-2 mb-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-purple-700">
                <DollarSign className="h-3 w-3" />
                <span className="font-medium">Session Rates</span>
              </div>
              <div className="text-purple-600">
                ${priceRange?.min || 50} - ${priceRange?.max || 200}
              </div>
            </div>
          </div>
        )}

        {/* Next Available Slot - compact */}
        {liveSessionsEnabled && nextAvailableSlot && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-green-700">
                <Clock className="h-3 w-3" />
                <span>Next: {nextAvailableSlot.time}</span>
              </div>
              <span className="font-medium text-green-700">
                ${nextAvailableSlot.price}
              </span>
            </div>
          </div>
        )}

        {/* Languages - compact */}
        {languages && languages.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {languages.slice(0, 2).map((lang, index) => {
                const languageText =
                  typeof lang === "string"
                    ? lang
                    : (lang as any).language || (lang as any).name || "Unknown";
                return (
                  <Badge
                    key={`${languageText}-${index}`}
                    variant="outline"
                    className="text-xs bg-green-50 border-green-200 text-green-700 px-2 py-0.5"
                  >
                    <Globe className="h-2 w-2 mr-1" />
                    {languageText}
                  </Badge>
                );
              })}
              {languages.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs text-gray-500 px-2 py-0.5"
                >
                  +{languages.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Categories - compact */}
        {categories && categories.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {categories.slice(0, 3).map((category, index) => (
                <Badge
                  key={`${category}-${index}`}
                  variant="outline"
                  className="text-xs bg-orange-50 border-orange-200 text-orange-700 px-2 py-0.5"
                >
                  {category}
                </Badge>
              ))}
              {categories.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs text-gray-500 px-2 py-0.5"
                >
                  +{categories.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 mt-2 py-2">
          <Link
            href={`/instructors/${id}`}
            className="flex items-center gap-3 w-full justify-center"
          >
            View Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
