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
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RevenueStats } from "@/types/courseAnalyticsTypes";

interface RevenueChartProps {
  data: RevenueStats;
  loading?: boolean;
  className?: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
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
            <DollarSign className="h-5 w-5" />
            Revenue Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-2">💰</div>
            <p className="text-gray-500">No revenue data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for revenue trend (in real app, this would come from backend)
  const revenueTrend = [
    {
      month: "Jan",
      revenue: data.totalRevenue * 0.2,
      conversions: Math.floor(data.totalPaidEnrollments * 0.2),
    },
    {
      month: "Feb",
      revenue: data.totalRevenue * 0.3,
      conversions: Math.floor(data.totalPaidEnrollments * 0.3),
    },
    {
      month: "Mar",
      revenue: data.totalRevenue * 0.4,
      conversions: Math.floor(data.totalPaidEnrollments * 0.4),
    },
    {
      month: "Apr",
      revenue: data.totalRevenue * 0.5,
      conversions: Math.floor(data.totalPaidEnrollments * 0.5),
    },
    {
      month: "May",
      revenue: data.totalRevenue * 0.7,
      conversions: Math.floor(data.totalPaidEnrollments * 0.7),
    },
    {
      month: "Jun",
      revenue: data.totalRevenue,
      conversions: data.totalPaidEnrollments,
    },
  ];

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="space-y-1">
            <p className="text-green-600">
              <span className="font-medium">Revenue:</span>{" "}
              {formatCurrency(payload[0]?.value || 0)}
            </p>
            <p className="text-blue-600">
              <span className="font-medium">Conversions:</span>{" "}
              {payload[1]?.value || 0}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const metrics = [
    {
      label: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+18%",
      changeType: "positive" as const,
    },
    {
      label: "Avg Revenue per Student",
      value: formatCurrency(data.averageRevenuePerStudent),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      label: "Paid Enrollments",
      value: data.totalPaidEnrollments.toLocaleString(),
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      label: "Conversion Rate",
      value: `${data.conversionRate.toFixed(1)}%`,
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
            <DollarSign className="h-5 w-5" />
            Revenue Analytics
          </CardTitle>
          <Badge
            variant="secondary"
            className={cn(
              "flex items-center gap-1",
              data.conversionRate >= 20
                ? "bg-green-50 text-green-700"
                : data.conversionRate >= 10
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
            )}
          >
            {data.conversionRate >= 20 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {data.conversionRate.toFixed(1)}% Conversion
          </Badge>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={metric.label} className="text-center">
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2",
                    metric.bgColor
                  )}
                >
                  <IconComponent className={cn("h-4 w-4", metric.color)} />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {metric.value}
                </div>
                <div className="text-xs text-gray-500">{metric.label}</div>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="conversionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
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
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Conversions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
