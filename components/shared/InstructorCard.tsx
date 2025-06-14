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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Instructor } from "@/data/instructorsData";

interface EnhancedInstructorCardProps {
  instructor: Instructor;
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
    sessionPricing,
    location,
    isVerified,
    languages,
  } = instructor;

  if (view === "list") {
    return (
      <Card
        className={cn(
          "overflow-hidden hover:shadow-lg transition-all duration-300",
          className
        )}
      >
        <CardContent className="p-6 py-2">
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
                        <Award className="h-3 w-3 mr-1" />
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

              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">
                    ({reviewsCount.toLocaleString()})
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {studentsCount.toLocaleString()} students
                </div>
                <div className="text-muted-foreground">
                  {coursesCount} {coursesCount === 1 ? "course" : "courses"}
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {shortBio}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="text-xs bg-secondary/50"
                  >
                    {category}
                  </Badge>
                ))}
                {liveSessionsEnabled && (
                  <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-200">
                    <Play className="h-3 w-3 mr-1" />
                    Live Sessions
                  </Badge>
                )}
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {location}
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {languages.join(", ")}
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
              <Button asChild className="mt-4">
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
        "group overflow-hidden h-full hover:shadow-lg transition-all duration-300 cursor-pointer py-0",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={avatar || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOnline && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              Online
            </Badge>
          )}
          {isVerified && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs flex items-center gap-1">
              <Award className="h-3 w-3" />
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

        {/* Reels Indicator */}
        {reels.length > 0 && (
          <div className="absolute top-3 right-3">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Play className="h-3 w-3 text-white" />
              <span className="text-white text-xs">{reels.length}</span>
            </div>
          </div>
        )}

        {/* Hover overlay with blur effect */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
          <Button
            asChild
            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            <Link href={`/instructors/${id}`}>View Profile</Link>
          </Button>
          {nextAvailableSlot && (
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Book Now - ${nextAvailableSlot.price}
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="space-y-1">
            <Link href={`/instructors/${id}`} className="hover:underline">
              <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                {name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {title}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="font-medium text-sm">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({reviewsCount.toLocaleString()})
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
              title="Follow instructor"
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Follow instructor</span>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {shortBio}
          </p>

          {/* Live Session Info */}
          {liveSessionsEnabled && nextAvailableSlot && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-purple-700">
                  <Clock className="h-3 w-3" />
                  <span>Next: {nextAvailableSlot.time}</span>
                </div>
                <span className="font-medium text-purple-700">
                  ${nextAvailableSlot.price}
                </span>
              </div>
            </div>
          )}

          {/* Weekly Activity */}
          {weeklyBookings > 0 && (
            <div className="text-xs text-muted-foreground flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {weeklyBookings} sessions booked this week
            </div>
          )}

          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
            </div>
            <span>
              {coursesCount} {coursesCount === 1 ? "course" : "courses"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
