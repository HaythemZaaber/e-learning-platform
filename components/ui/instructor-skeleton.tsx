import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// =============================================================================
// INSTRUCTOR CARD SKELETON
// =============================================================================

export const InstructorCardSkeleton = ({ view = "grid" }: { view?: "grid" | "list" }) => {
  if (view === "list") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6 py-2">
          <div className="flex gap-6">
            {/* Avatar */}
            <div className="relative">
              <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-3">
              {/* Name and Title */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              
              {/* Stats */}
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              
              {/* Bio */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              
              {/* Categories */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
              
              {/* Location and Languages */}
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            
            {/* Action */}
            <div className="hidden lg:flex flex-col items-end justify-between min-w-[150px]">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Skeleton className="w-full h-full" />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          {/* Name and Title */}
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Rating and Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Bio */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          {/* Live Session Info */}
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between text-xs pt-2 border-t">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// INSTRUCTOR GRID SKELETON
// =============================================================================

export const InstructorGridSkeleton = ({ 
  count = 6, 
  view = "grid" 
}: { 
  count?: number; 
  view?: "grid" | "list" 
}) => {
  return (
    <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
      {Array.from({ length: count }).map((_, index) => (
        <InstructorCardSkeleton key={index} view={view} />
      ))}
    </div>
  );
};

// =============================================================================
// HERO STATS SKELETON
// =============================================================================

export const HeroStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg text-center">
          <Skeleton className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" />
          <Skeleton className="h-8 w-16 mx-auto mb-1" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// FEATURED INSTRUCTOR HERO SKELETON
// =============================================================================

export const FeaturedInstructorHeroSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 pr-8">
        {/* Image */}
        <div className="relative">
          <Skeleton className="w-full h-full min-h-[400px]" />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col justify-center p-5 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32" />
          
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
          
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// FILTER SIDEBAR SKELETON
// =============================================================================

export const FilterSidebarSkeleton = () => {
  return (
    <div className="hidden lg:block w-80 border-r bg-background">
      <div className="p-6">
        <Skeleton className="h-6 w-16 mb-6" />
        
        <div className="space-y-6">
          {/* Search */}
          <Skeleton className="h-10 w-full" />
          
          {/* Filter Sections */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, itemIndex) => (
                  <Skeleton key={itemIndex} className="h-7 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// INSTRUCTOR PAGE HEADER SKELETON
// =============================================================================

export const InstructorPageHeaderSkeleton = () => {
  return (
    <div className="border-b bg-white/50 backdrop-blur-sm">
      <div className="container py-6 px-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-5 w-48" />
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-32" />
            </div>
            
            <div className="flex border-2 rounded-lg overflow-hidden">
              <Skeleton className="h-9 w-12" />
              <Skeleton className="h-9 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// PAGINATION SKELETON
// =============================================================================

export const PaginationSkeleton = () => {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Skeleton className="h-10 w-10 rounded" />
      <Skeleton className="h-10 w-10 rounded" />
      <Skeleton className="h-10 w-10 rounded" />
      <Skeleton className="h-10 w-10 rounded" />
      <Skeleton className="h-10 w-10 rounded" />
    </div>
  );
};

// =============================================================================
// INSTRUCTOR PROFILE SKELETON
// =============================================================================

export const InstructorProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="text-center">
            <Skeleton className="h-8 w-16 mx-auto mb-1" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>
      
      {/* Bio */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Skills */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// LOADING OVERLAY
// =============================================================================

export const LoadingOverlay = ({ 
  isLoading, 
  children 
}: { 
  isLoading: boolean; 
  children: React.ReactNode 
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ERROR STATE
// =============================================================================

export const ErrorState = ({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4 max-w-md">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
};

// =============================================================================
// EMPTY STATE
// =============================================================================

export const EmptyState = ({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description: string; 
  action?: React.ReactNode 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{description}</p>
      {action}
    </div>
  );
};
