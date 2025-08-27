"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Clock, 
  Star,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SessionStatsOverviewProps {
  stats: any;
  isLoading: boolean;
}

export function SessionStatsOverview({ stats, isLoading }: SessionStatsOverviewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No statistics available
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100) / 100}%`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalSessions || 0}
          </div>
          <div className="text-sm text-blue-800">Total Sessions</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {stats.completedSessions || 0}
          </div>
          <div className="text-sm text-green-800">Completed</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {stats.scheduledSessions || 0}
          </div>
          <div className="text-sm text-orange-800">Scheduled</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {stats.cancelledSessions || 0}
          </div>
          <div className="text-sm text-red-800">Cancelled</div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Completion Rate</span>
          <span className="text-sm text-muted-foreground">
            {formatPercentage(stats.completionRate || 0)}
          </span>
        </div>
        <Progress value={stats.completionRate || 0} className="h-2" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="w-3 h-3" />
          <span>{stats.completedSessions || 0} completed</span>
          <span>•</span>
          <XCircle className="w-3 h-3" />
          <span>{stats.cancelledSessions || 0} cancelled</span>
        </div>
      </div>

      {/* Revenue Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenue || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.pendingPayouts || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Pending Payouts</div>
            </div>
          </div>
          
          {stats.averageRevenuePerSession && (
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground">Average per Session</div>
              <div className="text-lg font-semibold">
                {formatCurrency(stats.averageRevenuePerSession)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {stats.averageRating || 0}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {stats.totalStudents || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
            </div>
          </div>

          {stats.averageSessionDuration && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {Math.round(stats.averageSessionDuration)} min
                  </div>
                  <div className="text-sm text-muted-foreground">Average Duration</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="p-1 bg-primary/10 rounded">
                    {activity.type === 'session_completed' && <CheckCircle className="w-3 h-3 text-green-600" />}
                    {activity.type === 'session_cancelled' && <XCircle className="w-3 h-3 text-red-600" />}
                    {activity.type === 'new_booking' && <Users className="w-3 h-3 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
