import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EnrollmentTrend } from "@/types/courseAnalyticsTypes";

interface EnrollmentTrendChartProps {
  data: EnrollmentTrend[];
  loading?: boolean;
  className?: string;
}

export const EnrollmentTrendChart: React.FC<EnrollmentTrendChartProps> = ({
  data,
  loading = false,
  className,
}) => {
  if (loading) {
    return (
      <Card className={cn("h-[400px]", className)}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={cn("h-[400px]", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Enrollment Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-2">📊</div>
            <p className="text-gray-500">No enrollment data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate growth metrics
  const totalEnrollments = data.reduce(
    (sum, item) => sum + item.enrollments,
    0
  );
  const firstDayEnrollments = data[0]?.enrollments || 0;
  const lastDayEnrollments = data[data.length - 1]?.enrollments || 0;
  const peakDay = data.reduce((max, item) =>
    item.enrollments > max.enrollments ? item : max
  );

  const growthRate =
    firstDayEnrollments > 0
      ? ((lastDayEnrollments - firstDayEnrollments) / firstDayEnrollments) * 100
      : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="space-y-1">
            <p className="text-blue-600">
              <span className="font-medium">New Enrollments:</span>{" "}
              {payload[0]?.value || 0}
            </p>
            <p className="text-green-600">
              <span className="font-medium">Total:</span>{" "}
              {payload[1]?.value || 0}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("h-[400px]", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Enrollment Trend
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={growthRate >= 0 ? "default" : "destructive"}
              className={cn(
                "flex items-center gap-1",
                growthRate >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {growthRate >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(growthRate).toFixed(1)}%
            </Badge>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalEnrollments}
            </div>
            <div className="text-xs text-gray-500">Total New</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {peakDay.enrollments}
            </div>
            <div className="text-xs text-gray-500">Peak Day</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {data[data.length - 1]?.cumulative || 0}
            </div>
            <div className="text-xs text-gray-500">Total Cumulative</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="enrollmentGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="cumulativeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="enrollments"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#enrollmentGradient)"
                name="New Enrollments"
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Total Cumulative"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
