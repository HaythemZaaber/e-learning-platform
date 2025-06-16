"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  User,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  BookOpen,
  ChevronRight,
  Bell,
  Settings,
  Award,
  Clock,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentStats } from "@/features/users/components/instructor/StudentsStats";    
import { InstructorCoursesOverview } from "@/features/courses/components/instructor/InstructorCoursesOverview";
import { SessionCalendar } from "@/features/sessions/components/SessionCalendar";
import { EarningsChart } from "@/features/analytics/components/EarningsChart";
import { RecentMessages } from "@/features/messages/components/RecentMessages";


// Mock components for the dashboard
// const InstructorCoursesOverview = ({ limit, showCreateButton }) => (
//   <Card className="hover:shadow-md transition-shadow">
//     <CardHeader>
//       <div className="flex items-center justify-between">
//         <CardTitle className="flex items-center">
//           <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
//           My Courses
//         </CardTitle>
//         {showCreateButton && (
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
//             Create Course
//           </button>
//         )}
//       </div>
//     </CardHeader>
//     <CardContent>
//       <div className="space-y-4">
//         {[1, 2, 3, 4].slice(0, limit).map((i) => (
//           <div
//             key={i}
//             className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//           >
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-semibold text-sm">C{i}</span>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">Course {i} Title</h4>
//                 <p className="text-sm text-gray-500">
//                   {150 + i * 25} students enrolled
//                 </p>
//               </div>
//             </div>
//             <ChevronRight className="h-5 w-5 text-gray-400" />
//           </div>
//         ))}
//       </div>
//     </CardContent>
//   </Card>
// );

// const SessionCalendar = ({ view, limit }) => (
//   <Card className="hover:shadow-md transition-shadow">
//     <CardHeader>
//       <CardTitle className="flex items-center">
//         <Calendar className="h-5 w-5 mr-2 text-green-600" />
//         Upcoming Sessions
//       </CardTitle>
//     </CardHeader>
//     <CardContent>
//       <div className="space-y-3">
//         {[1, 2, 3, 4, 5].slice(0, limit).map((i) => (
//           <div
//             key={i}
//             className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex flex-col items-center justify-center">
//               <span className="text-xs text-green-600 font-medium">JUN</span>
//               <span className="text-sm font-bold text-green-700">{16 + i}</span>
//             </div>
//             <div className="flex-1">
//               <h4 className="font-medium text-gray-900">Session {i}</h4>
//               <p className="text-sm text-gray-500">
//                 {10 + i}:00 AM - {11 + i}:00 AM
//               </p>
//             </div>
//             <Clock className="h-4 w-4 text-gray-400" />
//           </div>
//         ))}
//       </div>
//     </CardContent>
//   </Card>
// );

// const EarningsChart = ({ period }) => (
//   <Card className="hover:shadow-md transition-shadow">
//     <CardContent className="p-6">
//       <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
//         <div className="text-center">
//           <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Earnings Chart ({period})</p>
//           <p className="text-2xl font-bold text-gray-900 mt-2">$12,450</p>
//           <p className="text-sm text-green-600 mt-1">+23% from last month</p>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// const RecentMessages = ({ limit }) => (
//   <Card className="hover:shadow-md transition-shadow">
//     <CardContent className="p-6">
//       <div className="space-y-4">
//         {[1, 2, 3, 4, 5].slice(0, limit).map((i) => (
//           <div
//             key={i}
//             className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
//           >
//             <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//               <span className="text-white text-xs font-semibold">U{i}</span>
//             </div>
//             <div className="flex-1 min-w-0">
//               <h4 className="font-medium text-gray-900 text-sm">Student {i}</h4>
//               <p className="text-xs text-gray-500 truncate">
//                 Message preview content here...
//               </p>
//               <p className="text-xs text-gray-400 mt-1">{i}h ago</p>
//             </div>
//             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//           </div>
//         ))}
//       </div>
//     </CardContent>
//   </Card>
// );

// Main Dashboard Component
export default function EnhancedDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, Jessica! 👋
              </h1>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <Settings className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              Here's what's happening with your courses today.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span>
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Student Stats */}
        <StudentStats detailed={true} />

        {/* Main Content Grid */}
        <div className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <InstructorCoursesOverview limit={4} showCreateButton />
            <SessionCalendar view="upcoming" limit={5} />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Earnings Overview
              </h2>
              <EarningsChart period="month" />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Recent Messages
              </h2>
              <RecentMessages limit={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
