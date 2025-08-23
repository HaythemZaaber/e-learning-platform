"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Clock, 
  Star, 
  Calendar, 
  BarChart3,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  Activity,
  PieChart as PieChartIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

import { useSessionStats } from "@/features/sessions/hooks/useLiveSessions";
import { SessionStats } from "@/features/sessions/types/session.types";

interface SessionAnalyticsProps {
  user: any;
}

// Analytics data types
interface AnalyticsData {
  sessionsOverTime: Array<{
    date: string;
    sessions: number;
    earnings: number;
    students: number;
  }>;
  sessionTypes: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  performanceMetrics: Array<{
    metric: string;
    value: number;
    target: number;
    unit: string;
  }>;
  topStudents: Array<{
    name: string;
    sessions: number;
    totalSpent: number;
    rating: number;
  }>;
  revenueBreakdown: Array<{
    month: string;
    individual: number;
    group: number;
    workshop: number;
    masterclass: number;
  }>;
}

export function SessionAnalytics({ user }: SessionAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("30d");
  const [metric, setMetric] = useState("sessions");

  // Calculate date range based on timeRange
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }
    
    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange();

  // Fetch analytics data
  const { data: stats, isLoading: statsLoading } = useSessionStats(user?.id || "", startDate, endDate);

  // Mock analytics data for demonstration
  const mockAnalytics: AnalyticsData = {
    sessionsOverTime: [
      { date: "2024-01-01", sessions: 4, earnings: 120, students: 6 },
      { date: "2024-01-02", sessions: 6, earnings: 180, students: 8 },
      { date: "2024-01-03", sessions: 3, earnings: 90, students: 4 },
      { date: "2024-01-04", sessions: 7, earnings: 210, students: 9 },
      { date: "2024-01-05", sessions: 5, earnings: 150, students: 7 },
      { date: "2024-01-06", sessions: 8, earnings: 240, students: 10 },
      { date: "2024-01-07", sessions: 2, earnings: 60, students: 3 },
      { date: "2024-01-08", sessions: 9, earnings: 270, students: 12 },
      { date: "2024-01-09", sessions: 6, earnings: 180, students: 8 },
      { date: "2024-01-10", sessions: 4, earnings: 120, students: 6 },
    ],
    sessionTypes: [
      { name: "Individual", value: 45, color: "#3B82F6" },
      { name: "Group", value: 30, color: "#10B981" },
      { name: "Workshop", value: 15, color: "#F59E0B" },
      { name: "Masterclass", value: 10, color: "#8B5CF6" },
    ],
    performanceMetrics: [
      { metric: "Student Satisfaction", value: 4.8, target: 4.5, unit: "/5" },
      { metric: "Session Completion", value: 95, target: 90, unit: "%" },
      { metric: "Student Retention", value: 88, target: 85, unit: "%" },
      { metric: "Response Time", value: 2.3, target: 3.0, unit: "hrs" },
      { metric: "Booking Rate", value: 78, target: 75, unit: "%" },
    ],
    topStudents: [
      { name: "Sarah Johnson", sessions: 12, totalSpent: 900, rating: 5 },
      { name: "Mike Chen", sessions: 8, totalSpent: 640, rating: 4 },
      { name: "Emma Davis", sessions: 10, totalSpent: 800, rating: 5 },
      { name: "Alex Wilson", sessions: 6, totalSpent: 480, rating: 4 },
      { name: "Lisa Brown", sessions: 9, totalSpent: 720, rating: 5 },
    ],
    revenueBreakdown: [
      { month: "Jan", individual: 1200, group: 800, workshop: 400, masterclass: 300 },
      { month: "Feb", individual: 1400, group: 900, workshop: 500, masterclass: 350 },
      { month: "Mar", individual: 1300, group: 850, workshop: 450, masterclass: 320 },
      { month: "Apr", individual: 1600, group: 1000, workshop: 600, masterclass: 400 },
      { month: "May", individual: 1500, group: 950, workshop: 550, masterclass: 380 },
      { month: "Jun", individual: 1800, group: 1100, workshop: 650, masterclass: 450 },
    ]
  };

  // Use mock data since analytics hook doesn't exist yet
  const displayData: AnalyticsData = mockAnalytics;

  const isLoading = statsLoading;

  const getMetricData = () => {
    switch (metric) {
      case "sessions":
        return displayData.sessionsOverTime.map((item) => ({ date: item.date, value: item.sessions }));
      case "earnings":
        return displayData.sessionsOverTime.map((item) => ({ date: item.date, value: item.earnings }));
      case "students":
        return displayData.sessionsOverTime.map((item) => ({ date: item.date, value: item.students }));
      default:
        return displayData.sessionsOverTime.map((item) => ({ date: item.date, value: item.sessions }));
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case "sessions":
        return "Sessions";
      case "earnings":
        return "Earnings ($)";
      case "students":
        return "Students";
      default:
        return "Sessions";
    }
  };

  const getMetricColor = () => {
    switch (metric) {
      case "sessions":
        return "#3B82F6";
      case "earnings":
        return "#10B981";
      case "students":
        return "#8B5CF6";
      default:
        return "#3B82F6";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Session Analytics</h2>
          <p className="text-muted-foreground">
            Track your performance and optimize your teaching business
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalEarnings || 0}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating || 0}/5</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalStudents || 0} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Trend Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Performance Trends</CardTitle>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sessions">Sessions</SelectItem>
                  <SelectItem value="earnings">Earnings</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getMetricData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={getMetricColor()} 
                  strokeWidth={2}
                  name={getMetricLabel()}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Session Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={displayData.sessionTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {displayData.sessionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={displayData.performanceMetrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis />
              <Radar
                name="Current"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.1}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown by Session Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={displayData.revenueBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="individual" stackId="a" fill="#3B82F6" name="Individual" />
              <Bar dataKey="group" stackId="a" fill="#10B981" name="Group" />
              <Bar dataKey="workshop" stackId="a" fill="#F59E0B" name="Workshop" />
              <Bar dataKey="masterclass" stackId="a" fill="#8B5CF6" name="Masterclass" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Students */}
      <Card>
        <CardHeader>
          <CardTitle>Top Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayData.topStudents.map((student, index) => (
              <div key={student.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {student.sessions} sessions • ${student.totalSpent} spent
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{student.rating}</span>
                  </div>
                  <Badge variant="secondary">
                    Top Student
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Strong Performance</h4>
              <p className="text-sm text-green-700">
                Your session completion rate is 5% above target. Students are highly engaged with your content.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Growth Opportunity</h4>
              <p className="text-sm text-blue-700">
                Group sessions show 20% higher revenue per hour. Consider offering more group options.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Student Retention</h4>
              <p className="text-sm text-yellow-700">
                88% of students return for additional sessions. Focus on maintaining this high retention rate.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Revenue Growth</h4>
              <p className="text-sm text-purple-700">
                Monthly revenue has increased by 15% compared to last month. Keep up the excellent work!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
