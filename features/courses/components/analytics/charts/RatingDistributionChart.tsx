import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CourseRatingDistribution } from "@/types/courseAnalyticsTypes";

interface RatingDistributionChartProps {
  data: CourseRatingDistribution;
  averageRating: number;
  totalRatings: number;
  loading?: boolean;
  className?: string;
  variant?: "bar" | "pie" | "horizontal";
}

export const RatingDistributionChart: React.FC<
  RatingDistributionChartProps
> = ({
  data,
  averageRating,
  totalRatings,
  loading = false,
  className,
  variant = "horizontal",
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

  if (!data || totalRatings === 0) {
    return (
      <Card className={cn("h-[400px]", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-2">⭐</div>
            <p className="text-gray-500">No ratings available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for charts
  const chartData = [
    {
      name: "5 Stars",
      value: data.five,
      percentage: (data.five / totalRatings) * 100,
      color: "#10B981",
    },
    {
      name: "4 Stars",
      value: data.four,
      percentage: (data.four / totalRatings) * 100,
      color: "#3B82F6",
    },
    {
      name: "3 Stars",
      value: data.three,
      percentage: (data.three / totalRatings) * 100,
      color: "#F59E0B",
    },
    {
      name: "2 Stars",
      value: data.two,
      percentage: (data.two / totalRatings) * 100,
      color: "#EF4444",
    },
    {
      name: "1 Star",
      value: data.one,
      percentage: (data.one / totalRatings) * 100,
      color: "#DC2626",
    },
  ];

  const pieData = chartData.map((item) => ({
    ...item,
    fill: item.color,
  }));

  // Calculate positive ratings (4+ stars)
  const positiveRatings = data.four + data.five;
  const positivePercentage = (positiveRatings / totalRatings) * 100;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Count:</span> {data?.value || 0}
            </p>
            <p className="text-sm">
              <span className="font-medium">Percentage:</span>{" "}
              {data?.payload?.percentage?.toFixed(1) || 0}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderHorizontalBars = () => (
    <div className="space-y-3">
      {chartData.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">
                {item.value}
              </span>
              <span className="text-xs text-gray-500 w-12 text-right">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderBarChart = () => (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
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
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPieChart = () => (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <Card className={cn("h-[400px]", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Rating Distribution
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {positivePercentage.toFixed(1)}% Positive
          </Badge>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalRatings}
            </div>
            <div className="text-xs text-gray-500">Total Ratings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {positiveRatings}
            </div>
            <div className="text-xs text-gray-500">Positive (4+ Stars)</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {variant === "horizontal" && renderHorizontalBars()}
        {variant === "bar" && renderBarChart()}
        {variant === "pie" && renderPieChart()}
      </CardContent>
    </Card>
  );
};
