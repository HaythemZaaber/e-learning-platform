import Link from "next/link"
import Image from "next/image"
import { Star, Heart, Calendar, Users, Play, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Instructor } from "@/lib/data/instructorsData"

interface EnhancedInstructorCardProps {
  instructor: Instructor
  view?: "grid" | "list"
}

export function EnhancedInstructorCard({ instructor, view = "grid" }: EnhancedInstructorCardProps) {
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
  } = instructor

  if (view === "list") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative">
              <div className="w-20 h-20 md:w-28 md:h-28 relative rounded-full overflow-hidden">
                <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
              </div>
              {isOnline && (
                <span className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/instructors/${id}`} className="hover:underline">
                    <h3 className="text-lg font-semibold">{name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{title}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  title="Follow instructor"
                >
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Follow instructor</span>
                </Button>
              </div>

              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">({reviewsCount.toLocaleString()})</span>
                </div>
                <div className="text-muted-foreground">{studentsCount.toLocaleString()} students</div>
                <div className="text-muted-foreground">
                  {coursesCount} {coursesCount === 1 ? "course" : "courses"}
                </div>
              </div>

              <p className="mt-2 text-sm line-clamp-2">{shortBio}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category} variant="outline" className="text-xs bg-secondary/50">
                    {category}
                  </Badge>
                ))}
                {liveSessionsEnabled && (
                  <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-200">🔴 Live Sessions</Badge>
                )}
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-end justify-between min-w-[130px]">
              <div></div>
              <Button asChild>
                <Link href={`/instructors/${id}`}>View Profile</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={avatar || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOnline && <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">🔴 Online</Badge>}
          {liveSessionsEnabled && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">Live Sessions</Badge>
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2">
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

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <Link href={`/instructors/${id}`} className="hover:underline">
              <h3 className="font-semibold text-lg leading-tight line-clamp-1">{name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-1">{title}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="font-medium text-sm">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviewsCount.toLocaleString()})</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              title="Follow instructor"
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Follow instructor</span>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{shortBio}</p>

          {/* Live Session Info */}
          {liveSessionsEnabled && nextAvailableSlot && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-green-700">
                  <Clock className="h-3 w-3" />
                  <span>Next: {nextAvailableSlot.time}</span>
                </div>
                <span className="font-medium text-green-700">${nextAvailableSlot.price}</span>
              </div>
            </div>
          )}

          {/* Weekly Activity */}
          {weeklyBookings > 0 && (
            <div className="text-xs text-muted-foreground">
              <Users className="h-3 w-3 inline mr-1" />
              {weeklyBookings} sessions booked this week
            </div>
          )}

          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>{studentsCount.toLocaleString()} students</span>
            <span>
              {coursesCount} {coursesCount === 1 ? "course" : "courses"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
