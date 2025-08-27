import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function InstructorPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        
        <div className="h-80 md:h-96 relative">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="container relative w-[90vw]">
          <div className="-mt-60 pb-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Profile Section Skeleton */}
              <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
                <div className="relative">
                  <Skeleton className="w-36 h-36 md:w-44 md:h-44 rounded-2xl" />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <Skeleton className="h-12 w-64 mb-2" />
                    <Skeleton className="h-6 w-48 mb-4" />

                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm">
                          <Skeleton className="h-8 w-16 mx-auto mb-1" />
                          <Skeleton className="h-4 w-20 mx-auto" />
                        </div>
                      ))}
                    </div>

                    {/* Tags Skeleton */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-20 rounded-full" />
                      ))}
                    </div>

                    {/* Location & Languages Skeleton */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Social Links Skeleton */}
                    <div className="flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-10 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-col gap-3 min-w-[200px]">
                <Skeleton className="h-12 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 w-[90vw]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            {/* Navigation Skeleton */}
            <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl mb-8 shadow-lg p-4">
              <div className="grid grid-cols-6 gap-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg rounded-2xl overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg rounded-2xl overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

