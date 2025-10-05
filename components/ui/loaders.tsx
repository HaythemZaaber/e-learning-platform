import React from "react";
import { Loader2, BookOpen, GraduationCap, Sparkles } from "lucide-react";

// Main Page Loader - Premium animated loader
export const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main loader content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Logo animation */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Animated text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            {message}
          </h2>

          {/* Loading dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full animate-loading-bar"></div>
        </div>

        {/* Sparkle effects */}
        <div className="flex items-center justify-center gap-4 text-gray-400">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Preparing your experience</span>
          <Sparkles className="w-4 h-4 animate-pulse animation-delay-300" />
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

// Compact Loader - For smaller sections
export const CompactLoader = ({
  size = "default",
  message,
}: {
  size?: "sm" | "default" | "lg";
  message?: string;
}) => {
  const sizeClasses: Record<"sm" | "default" | "lg", string> = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`${sizeClasses[size]} border-4 border-transparent border-r-purple-600 rounded-full animate-spin-reverse`}
          ></div>
        </div>
      </div>
      {message && (
        <p className="text-sm text-gray-600 animate-pulse">{message}</p>
      )}

      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Skeleton Loader - For content loading
export const SkeletonLoader = ({ type = "default" }) => {
  if (type === "card") {
    return (
      <div className="w-full space-y-4 p-6 bg-white rounded-lg shadow-sm">
        <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-shimmer bg-[length:200%_100%]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-5/6 animate-shimmer bg-[length:200%_100%]"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/6 animate-shimmer bg-[length:200%_100%]"></div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

// Demo Component showing all loaders
export default function LoaderShowcase() {
  const [showPageLoader, setShowPageLoader] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Enhanced Loaders</h1>
          <p className="text-gray-600">
            Beautiful loading states for your application
          </p>
        </div>

        {/* Page Loader Demo */}
        <section className="bg-white rounded-xl shadow-lg p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Full Page Loader
          </h2>
          <p className="text-gray-600">
            Premium animated loader for page transitions
          </p>
          <button
            onClick={() => setShowPageLoader(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Show Page Loader
          </button>
          {showPageLoader && (
            <div className="relative">
              <PageLoader message="Loading your dashboard..." />
              <button
                onClick={() => setShowPageLoader(false)}
                className="fixed top-4 right-4 z-[60] px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Close
              </button>
            </div>
          )}
        </section>

        {/* Compact Loaders */}
        <section className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Compact Loaders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-gray-200 rounded-lg">
              <CompactLoader size="sm" message="Small" />
            </div>
            <div className="border-2 border-gray-200 rounded-lg">
              <CompactLoader size="default" message="Default" />
            </div>
            <div className="border-2 border-gray-200 rounded-lg">
              <CompactLoader size="lg" message="Large" />
            </div>
          </div>
        </section>

        {/* Skeleton Loaders */}
        <section className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Skeleton Loaders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonLoader type="card" />
            <div className="p-6 bg-gray-50 rounded-lg">
              <SkeletonLoader type="default" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
