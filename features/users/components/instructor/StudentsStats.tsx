"use client";

import { BarChart3, TrendingUp, User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentStatsProps {
  detailed?: boolean;
}

export function StudentStats({ detailed = false }: StudentStatsProps) {
  const stats = [
    {
      title: "Total Students",
      value: "2,845",
      change: "+18% from last month",
      icon: Users,
      trend: "up",
    },
    {
      title: "Active Students",
      value: "1,962",
      change: "+5% from last month",
      icon: User,
      trend: "up",
    },
    {
      title: "Average Completion",
      value: "76%",
      change: "+4% from last month",
      icon: BarChart3,
      trend: "up",
    },
    {
      title: "Student Satisfaction",
      value: "4.8/5",
      change: "Based on 1,245 ratings",
      icon: TrendingUp,
      trend: "stable",
    },
  ];

  if (detailed) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.trend === "up"
                    ? "text-green-500"
                    : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
