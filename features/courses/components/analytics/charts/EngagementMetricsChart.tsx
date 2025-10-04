import React from "react";
import { motion } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Eye,
  Users,
  Clock,
  TrendingUp,
  Target,
  MessageSquare,
  Activity,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { EngagementMetrics } from "@/types/courseAnalyticsTypes";

interface EngagementMetricsChartProps {
  data: EngagementMetrics;
  loading?: boolean;
  className?: string;
}

export const EngagementMetricsChart: React.FC<EngagementMetricsChartProps> = ({
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

  if (!data) {
    return (
      <Card className={cn("h-[400px]", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Engagement Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-2">📊</div>
            <p className="text-gray-500">No engagement data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate engagement score (0-100)
  const engagementScore = Math.min(
    data.averageProgressRate * 0.4 +
      Math.min(data.averageSessionDuration / 60, 1) * 30 +
      Math.min(data.totalViews / 1000, 1) * 30,
    100
  );

  // Prepare data for radial chart
  const radialData = [
    {
      name: "Progress Rate",
      value: data.averageProgressRate,
      fill: "#3B82F6",
    },
    {
      name: "Session Duration",
      value: Math.min((data.averageSessionDuration / 60) * 100, 100),
      fill: "#10B981",
    },
    {
      name: "View Engagement",
      value: Math.min((data.totalViews / 1000) * 100, 100),
      fill: "#F59E0B",
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">
            {data?.name || "Metric"}
          </p>
          <p className="text-sm text-blue-600">
            {data?.value?.toFixed(1) || 0}%
          </p>
        </div>
      );
    }
    return null;
  };

  const metrics = [
    {
      label: "Total Views",
      value: data.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      label: "Unique Viewers",
      value: data.uniqueViewers.toLocaleString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      label: "Session Duration",
      value: `${data.averageSessionDuration.toFixed(1)}m`,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      label: "Progress Rate",
      value: `${data.averageProgressRate.toFixed(1)}%`,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+3%",
      changeType: "positive" as const,
    },
  ];

  return (
    <Card className={cn("h-[400px]", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Engagement Metrics
          </CardTitle>
          <Badge
            variant="secondary"
            className={cn(
              "flex items-center gap-1",
              engagementScore >= 70
                ? "bg-green-50 text-green-700"
                : engagementScore >= 50
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
            )}
          >
            <Zap className="h-3 w-3" />
            {engagementScore.toFixed(0)}% Engagement
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radial Chart */}
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="80%"
                data={radialData}
              >
                <RadialBar dataKey="value" cornerRadius={10} fill="#3B82F6" />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-2">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn("p-3 py-2 rounded-lg border", metric.bgColor)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className={cn("h-4 w-4", metric.color)} />
                      <span className="text-sm font-medium text-gray-700">
                        {metric.label}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        metric.changeType === "positive"
                          ? "border-green-200 text-green-700 bg-green-50"
                          : "border-red-200 text-red-700 bg-red-50"
                      )}
                    >
                      {metric.changeType === "positive" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                      )}
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {metric.value}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
