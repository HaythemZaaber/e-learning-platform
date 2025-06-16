"use client";

import { Activity, Award, BarChart3, TrendingUp, User, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

interface StudentStatsProps {
  detailed?: boolean;
}

export function StudentStats({ detailed = false }: StudentStatsProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const stats = [
    {
      title: "Total Students",
      value: "2,845",
      change: "+18%",
      changeText: "from last month",
      icon: Users,
      trend: "up",
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      percentage: 18,
    },
    {
      title: "Active Students",
      value: "1,962",
      change: "+5%",
      changeText: "from last month",
      icon: Activity,
      trend: "up",
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
      percentage: 5,
    },
    {
      title: "Course Completion",
      value: "76%",
      change: "+4%",
      changeText: "from last month",
      icon: Award,
      trend: "up",
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      percentage: 4,
    },
    {
      title: "Satisfaction Rate",
      value: "4.8/5",
      change: "1,245 reviews",
      changeText: "this month",
      icon: TrendingUp,
      trend: "stable",
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
      percentage: 0,
    },
  ];

  const filters = [
    { id: "all", label: "All Time" },
    { id: "month", label: "This Month" },
    { id: "week", label: "This Week" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Student Analytics
        </h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeFilter === filter.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
          >
            {/* Background decoration */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 ${stat.lightColor} rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity`}
            ></div>

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.lightColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center space-x-2">
                    {stat.trend === "up" && (
                      <div
                        className={`flex items-center px-2 py-1 rounded-full ${stat.lightColor}`}
                      >
                        <TrendingUp
                          className={`h-3 w-3 ${stat.textColor} mr-1`}
                        />
                        <span
                          className={`text-xs font-medium ${stat.textColor}`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    )}
                    {stat.trend === "stable" && (
                      <span className="text-xs text-gray-500">
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.changeText}
                  </p>
                </div>

                {/* Progress indicator for trending stats */}
                {stat.trend === "up" && (
                  <div className="w-12 h-12 relative">
                    <svg
                      className="w-12 h-12 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={stat.color
                          .replace("bg-", "")
                          .replace("-500", "")}
                        strokeWidth="2"
                        strokeDasharray={`${stat.percentage}, 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
