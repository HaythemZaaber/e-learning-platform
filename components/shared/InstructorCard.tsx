import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Heart,
  Calendar,
  Users,
  Play,
  Clock,
  Award,
  Globe,
  MapPin,
  GraduationCap,
  DollarSign,
  MessageCircle,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TransformedInstructor } from "@/types/instructorGraphQLTypes";

interface EnhancedInstructorCardProps {
  instructor: TransformedInstructor;
  view?: "grid" | "list";
  className?: string;
}

export function InstructorCard({
  instructor,
  view = "grid",
  className,
}: EnhancedInstructorCardProps) {
  const {
    id,
    name,
    title,
    avatar,
    rating,
    reviewsCount,
    studentsCount,
    coursesCount,
    shortBio,
    categories,
    isOnline,
    liveSessionsEnabled,
    nextAvailableSlot,
    weeklyBookings,
    reels,
    contentEngagement,
    location,
    isVerified,
    languages,
    skills,
    experience,
    priceRange,
    completionRate,
  } = instructor;

  console.log("instructor", instructor);

  // Calculate availability status
  const getAvailabilityStatus = () => {
    if (isOnline) return { status: "Online Now", color: "bg-green-500", icon: "🟢" };
    if (nextAvailableSlot) return { status: "Available Today", color: "bg-blue-500", icon: "📅" };
    return { status: "Available Soon", color: "bg-gray-500", icon: "⏰" };
  };

  const availability = getAvailabilityStatus();

  if (view === "list") {
    return (
      <Card
        className={cn(
          "overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100",
          className
        )}
      >
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden ring-2 ring-primary/10">
                <Image
                  src={avatar || "/placeholder.svg"}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
              {isOnline && (
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/instructors/${id}`}
                      className="hover:underline"
                    >
                      <h3 className="text-xl font-semibold">{name}</h3>
                    </Link>
                    {isVerified && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{title}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                  title="Follow instructor"
                >
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Follow instructor</span>
                </Button>
              </div>

              {/* Rating and Key Stats */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">
                      ({reviewsCount.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {studentsCount.toLocaleString()}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    {coursesCount}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Award className="h-4 w-4 mr-1" />
                    {experience} years
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {shortBio}
              </p>

              {/* Skills and Categories */}
              <div className="mt-4 flex flex-wrap gap-2">
                {skills && skills.slice(0, 3).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700 px-2 py-0.5"
                  >
                    {skill.name}
                  </Badge>
                ))}
                {categories && categories.slice(0, 2).map((category, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-orange-50 border-orange-200 text-orange-700 px-2 py-0.5"
                  >
                    {category}
                  </Badge>
                ))}
                {liveSessionsEnabled && (
                  <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-2 py-0.5">
                    <Play className="h-3 w-3 mr-1" />
                    Live Sessions
                  </Badge>
                )}
              </div>

              {/* Session Pricing */}
              {liveSessionsEnabled && (
                <div className="mt-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-2">
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

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {location}
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {languages.slice(0, 2).map(lang => typeof lang === 'string' ? lang : (lang as any).language || (lang as any).name || 'Unknown').join(", ")}
                </div>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-end justify-between min-w-[150px]">
              {nextAvailableSlot && (
                <div className="text-right">
                  <p className="text-sm font-medium">Next Available</p>
                  <p className="text-sm text-muted-foreground">
                    {nextAvailableSlot.time}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    ${nextAvailableSlot.price}
                  </p>
                </div>
              )}
              <Button asChild className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                <Link href={`/instructors/${id}`}>View Profile</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1 relative min-h-[600px]",
        className
      )}
    >
      <div className="relative">
        <Image
          src={avatar || "/placeholder.svg"}
          alt={name}
          width={400}
          height={300}
          className="w-full h-56 object-cover"
        />
        
        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className={`${availability.color} hover:${availability.color} text-white text-xs flex items-center gap-1`}>
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

        {/* Save Button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Reels Indicator */}
        {reels && reels.length > 0 && (
          <div className="absolute top-4 right-16">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Play className="h-3 w-3 text-white" />
              <span className="text-white text-xs">{reels.length}</span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4 py-3 text-left pb-32">
        <div className="space-y-3">
          <div className="space-y-1">
            <Link href={`/instructors/${id}`} className="hover:underline">
              <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                {name}
              </h3>
            </Link>
            <p className="text-sm text-indigo-600 line-clamp-1">
              {title}
            </p>
          </div>

          {/* Rating and Key Stats in one row */}
          <div className="flex items-center justify-between">
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
              <div className="flex items-center">
                <GraduationCap className="h-3 w-3 mr-1" />
                {coursesCount}
              </div>
            </div>
          </div>

          {/* Bio - shorter */}
          <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
            {shortBio}
          </p>

          {/* Skills - compact */}
          {skills && skills.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 2).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700 px-2 py-0.5"
                  >
                    {skill.name}
                  </Badge>
                ))}
                {skills.length > 2 && (
                  <Badge variant="outline" className="text-xs text-gray-500 px-2 py-0.5">
                    +{skills.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Session Pricing - compact */}
          {liveSessionsEnabled && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-2">
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
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

          {/* Categories - compact */}
          {categories && categories.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1">
                {categories.slice(0, 2).map((category, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-orange-50 border-orange-200 text-orange-700 px-2 py-0.5"
                  >
                    {category}
                  </Badge>
                ))}
                {categories.length > 2 && (
                  <Badge variant="outline" className="text-xs text-gray-500 px-2 py-0.5">
                    +{categories.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Languages - compact */}
          {languages && languages.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1">
                {languages.slice(0, 2).map((lang, index) => {
                  const languageText = typeof lang === 'string' ? lang : 
                    (lang as any).language || (lang as any).name || 'Unknown';
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
                  <Badge variant="outline" className="text-xs text-gray-500 px-2 py-0.5">
                    +{languages.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Completion Rate */}
          {completionRate > 0 && (
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <span className="text-xs text-blue-700">Course Completion Rate</span>
              <span className="text-sm font-semibold text-blue-700">{completionRate}%</span>
            </div>
          )}
        </div>

        {/* Bottom section - absolutely positioned */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex justify-between text-xs text-muted-foreground pb-3 border-t pt-2">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
            </div>
            <span>
              {coursesCount} {coursesCount === 1 ? "course" : "courses"}
            </span>
          </div>

          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 py-2">
            <Link href={`/instructors/${id}`} className="flex items-center gap-3 w-full justify-center">
              View Profile <Calendar className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
