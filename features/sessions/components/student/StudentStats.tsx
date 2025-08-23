"use client";

import { 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Star, 
  Target,
  Award,
  Calendar,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface StudentStatsProps {
  stats?: {
    totalSessions: number;
    completedSessions: number;
    totalHours: number;
    averageRating: number;
    totalSpent: number;
    learningStreak: number;
    favoriteInstructor?: string;
    topSubject?: string;
    unreadNotifications?: number;
  };
}

export function StudentStats({ stats }: StudentStatsProps) {
  // Mock stats for demonstration
  const mockStats = {
    totalSessions: 12,
    completedSessions: 10,
    totalHours: 8.5,
    averageRating: 4.7,
    totalSpent: 450,
    learningStreak: 5,
    favoriteInstructor: "Sarah Johnson",
    topSubject: "React Development",
    unreadNotifications: 3
  };

  const displayStats = stats || mockStats;
  const completionRate = (displayStats.completedSessions / displayStats.totalSessions) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>Learning Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Sessions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {displayStats.completedSessions}/{displayStats.totalSessions}
            </p>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">
              {completionRate.toFixed(0)}% completion rate
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Hours</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {displayStats.totalHours.toFixed(1)}h
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Total learning time
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Average Rating</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {displayStats.averageRating.toFixed(1)}/5
            </p>
            <p className="text-xs text-gray-500">
              {displayStats.completedSessions} sessions rated
            </p>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Learning Streak</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {displayStats.learningStreak} days
            </p>
            <p className="text-xs text-gray-500">
              Keep it up!
            </p>
          </div>
        </div>

        {/* Total Investment */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Total Investment</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              ${displayStats.totalSpent}
            </p>
            <p className="text-xs text-gray-500">
              In your learning
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-2">
          {displayStats.favoriteInstructor && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Favorite Instructor:</span>
              <span className="font-medium text-gray-900">{displayStats.favoriteInstructor}</span>
            </div>
          )}
          
          {displayStats.topSubject && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Top Subject:</span>
              <Badge variant="outline" className="text-xs">
                {displayStats.topSubject}
              </Badge>
            </div>
          )}
        </div>

        {/* Notifications */}
        {displayStats.unreadNotifications && displayStats.unreadNotifications > 0 && (
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Notifications</span>
            </div>
            <Badge variant="destructive" className="text-xs">
              {displayStats.unreadNotifications} new
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
