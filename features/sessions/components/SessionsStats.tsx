"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  Zap,
} from "lucide-react";
import { useSessions } from "../context/sessionsContext";

export function SessionsStats() {
  const { state, dispatch } = useSessions();
  const { stats } = state;

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-lg font-bold">{stats.pendingRequests}</p>
              </div>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Upcoming</p>
                <p className="text-lg font-bold">{stats.upcomingSessions}</p>
              </div>
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Total Earnings</span>
            </div>
            <Badge variant="outline" className="text-xs">
              +12% this month
            </Badge>
          </div>
          <p className="text-2xl font-bold">
            ${stats.totalEarnings.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Avg bid: ${stats.averageBid}
          </p>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Completion Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <span className="text-sm font-bold">{stats.completionRate}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Popular Time Slots */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Popular Times
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {stats.popularTimeSlots.map((time: string, index: number) => (
              <div key={time} className="flex items-center justify-between">
                <span className="text-sm">{time}</span>
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => dispatch({ type: "TOGGLE_PRICE_RULES_MODAL" })}
        >
          <Settings className="h-4 w-4 mr-2" />
          Price Rules
        </Button>

        <Button variant="outline" size="sm" className="w-full justify-start">
          <Users className="h-4 w-4 mr-2" />
          Learner Analytics
        </Button>
      </div>

      {/* AI Insights */}
      <Card className="border-[#0E6E55]/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#0E6E55]" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            <div className="p-3 bg-[#0E6E55]/5 rounded-lg">
              <p className="text-xs font-medium text-[#0E6E55]">
                High Demand Alert
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Consider raising prices for 2-4 PM slots this week
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-blue-700">
                Schedule Optimization
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add more weekend sessions for 23% higher engagement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
