import React, { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: any, label: string }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Earnings:</span>
            <span className="font-semibold text-green-600">
              ${data.value?.toLocaleString()}
            </span>
          </div>
          {data.payload.students && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Students:</span>
              <span className="font-medium text-blue-600">
                {data.payload.students}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Enhanced Earnings Chart Component
export function EarningsChart({ period = "month" }) {
  const [chartType, setChartType] = useState("area");
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [showComparison, setShowComparison] = useState(false);

  // Sample data with more details
  const earningsData = {
    week: [
      { name: "Mon", earnings: 1200, students: 45, previousYear: 1100 },
      { name: "Tue", earnings: 1450, students: 52, previousYear: 1300 },
      { name: "Wed", earnings: 1650, students: 58, previousYear: 1400 },
      { name: "Thu", earnings: 1800, students: 62, previousYear: 1550 },
      { name: "Fri", earnings: 2100, students: 71, previousYear: 1800 },
      { name: "Sat", earnings: 1900, students: 65, previousYear: 1650 },
      { name: "Sun", earnings: 1600, students: 55, previousYear: 1400 },
    ],
    month: [
      { name: "Jan", earnings: 4500, students: 180, previousYear: 4200 },
      { name: "Feb", earnings: 5200, students: 195, previousYear: 4800 },
      { name: "Mar", earnings: 6100, students: 220, previousYear: 5400 },
      { name: "Apr", earnings: 7800, students: 265, previousYear: 6900 },
      { name: "May", earnings: 8400, students: 285, previousYear: 7600 },
      { name: "Jun", earnings: 9200, students: 310, previousYear: 8100 },
    ],
    year: [
      { name: "2019", earnings: 45000, students: 1200, previousYear: 42000 },
      { name: "2020", earnings: 52000, students: 1350, previousYear: 45000 },
      { name: "2021", earnings: 68000, students: 1580, previousYear: 52000 },
      { name: "2022", earnings: 78000, students: 1820, previousYear: 68000 },
      { name: "2023", earnings: 84000, students: 2100, previousYear: 78000 },
      { name: "2024", earnings: 92000, students: 2350, previousYear: 84000 },
    ],
  };

  const data = earningsData[selectedPeriod as keyof typeof earningsData];

  // Calculate metrics
  const metrics = useMemo(() => {
    const currentTotal = data.reduce((sum, item) => sum + item.earnings, 0);
    const previousTotal = data.reduce(
      (sum, item) => sum + (item.previousYear || 0),
      0
    );
    const growth =
      previousTotal > 0
        ? ((currentTotal - previousTotal) / previousTotal) * 100
        : 0;
    const avgEarnings = currentTotal / data.length;
    const totalStudents = data.reduce(
      (sum, item) => sum + (item.students || 0),
      0
    );

    return {
      total: currentTotal,
      growth: growth,
      average: avgEarnings,
      students: totalStudents,
      trend: growth > 0 ? "up" : growth < 0 ? "down" : "stable",
    };
  }, [data]);

  const periodLabels = {
    week: "This Week",
    month: "Last 6 Months",
    year: "Last 6 Years",
  };

  const chartTypes = [
    { id: "area", label: "Area", icon: BarChart3 },
    { id: "line", label: "Line", icon: TrendingUp },
    { id: "bar", label: "Bar", icon: BarChart3 },
  ];

  const renderChart = () => {
    const commonProps = {
      data: data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
              {showComparison && (
                <linearGradient
                  id="comparisonGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
                </linearGradient>
              )}
            </defs>
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
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
            {showComparison && (
              <Area
                type="monotone"
                dataKey="previousYear"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#comparisonGradient)"
                name="Previous Year"
              />
            )}
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#earningsGradient)"
              name="Current Earnings"
            />
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
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
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
            {showComparison && (
              <Bar
                dataKey="previousYear"
                fill="#EF4444"
                opacity={0.6}
                name="Previous Year"
              />
            )}
            <Bar dataKey="earnings" fill="#3B82F6" name="Current Earnings" />
          </BarChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
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
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
            {showComparison && (
              <Line
                type="monotone"
                dataKey="previousYear"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#EF4444", strokeWidth: 2 }}
                name="Previous Year"
              />
            )}
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8, stroke: "#3B82F6", strokeWidth: 2 }}
              name="Current Earnings"
            />
          </LineChart>
        );
    }
  };

  const getTrendIcon = () => {
    switch (metrics.trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (metrics.trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader className="border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-xl">Earnings Overview</span>
                <CardDescription className="mt-1">
                  {periodLabels[selectedPeriod as keyof typeof periodLabels ]} • Total Students:{" "}
                  {metrics.students.toLocaleString()}
                </CardDescription>
              </div>
            </CardTitle>
          </div>

          <div className="flex items-center space-x-3">
            {/* Period Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {Object.entries(periodLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPeriod(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedPeriod === key
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {label.split(" ")[1] || label}
                </button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {chartTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id)}
                  className={`p-2 rounded-md transition-all ${
                    chartType === type.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title={`${type.label} Chart`}
                >
                  <type.icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`p-2 rounded-lg transition-all ${
                  showComparison
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Compare with previous period"
              >
                <Filter className="h-4 w-4" />
              </button>
              <button
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="Download report"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  ${metrics.total.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Growth Rate
                </p>
                <p
                  className={`text-2xl font-bold flex items-center ${getTrendColor()}`}
                >
                  {getTrendIcon()}
                  <span className="ml-1">
                    {Math.abs(metrics.growth).toFixed(1)}%
                  </span>
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Average</p>
                <p className="text-2xl font-bold text-purple-900">
                  ${Math.round(metrics.average).toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {showComparison && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">Current Period</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">Previous Year</span>
                </div>
              </div>
              <span className={`font-medium ${getTrendColor()}`}>
                {metrics.trend === "up"
                  ? "+"
                  : metrics.trend === "down"
                  ? "-"
                  : ""}
                {Math.abs(metrics.growth).toFixed(1)}% vs previous year
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
