"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  CreditCard,
  Banknote,
  Wallet,
  Target,
  BarChart3,
  PieChart,
  Clock,
  Award,
  Users,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const mockEarnings = {
  overview: {
    totalEarnings: 45680,
    thisMonth: 8200,
    lastMonth: 7800,
    pendingPayout: 2400,
    totalPayouts: 43280,
  },
  monthlyData: [
    { month: "Jan", earnings: 3200, students: 120, courses: 8 },
    { month: "Feb", earnings: 3800, students: 135, courses: 9 },
    { month: "Mar", earnings: 4200, students: 142, courses: 10 },
    { month: "Apr", earnings: 4800, students: 158, courses: 11 },
    { month: "May", earnings: 5200, students: 165, courses: 12 },
    { month: "Jun", earnings: 5600, students: 172, courses: 12 },
  ],
  recentTransactions: [
    {
      id: "1",
      type: "course_sale",
      title: "Advanced React Patterns",
      amount: 1250,
      date: "2024-01-15",
      status: "completed",
      students: 25,
    },
    {
      id: "2",
      type: "course_sale",
      title: "JavaScript Deep Dive",
      amount: 990,
      date: "2024-01-14",
      status: "completed",
      students: 20,
    },
    {
      id: "3",
      type: "live_session",
      title: "1-on-1 Session",
      amount: 150,
      date: "2024-01-13",
      status: "completed",
      students: 1,
    },
    {
      id: "4",
      type: "course_sale",
      title: "Node.js Mastery",
      amount: 780,
      date: "2024-01-12",
      status: "pending",
      students: 15,
    },
  ],
  topEarningCourses: [
    {
      title: "Advanced React Patterns",
      earnings: 12250,
      students: 245,
      price: 50,
    },
    { title: "JavaScript Deep Dive", earnings: 9900, students: 198, price: 50 },
    { title: "Node.js Mastery", earnings: 7800, students: 156, price: 50 },
    {
      title: "TypeScript Fundamentals",
      earnings: 6700,
      students: 134,
      price: 50,
    },
  ],
};

export default function InstructorEarningsPage() {
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "course_sale":
        return BookOpen;
      case "live_session":
        return Users;
      case "payout":
        return CreditCard;
      default:
        return DollarSign;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "course_sale":
        return "text-green-600 bg-green-100";
      case "live_session":
        return "text-blue-600 bg-blue-100";
      case "payout":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Earnings Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Track your teaching income and financial performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Total Earnings
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      ${mockEarnings.overview.totalEarnings.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">
                        +5.1% from last month
                      </span>
                    </div>
                  </div>
                  <DollarSign className="w-12 h-12 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      This Month
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      ${mockEarnings.overview.thisMonth.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">
                        +5.1% from last month
                      </span>
                    </div>
                  </div>
                  <Calendar className="w-12 h-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">
                      Pending Payout
                    </p>
                    <p className="text-3xl font-bold text-purple-900">
                      ${mockEarnings.overview.pendingPayout.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <Clock className="w-4 h-4 text-purple-600 mr-1" />
                      <span className="text-sm text-purple-600">
                        Next payout: Jan 31
                      </span>
                    </div>
                  </div>
                  <Wallet className="w-12 h-12 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">
                      Total Payouts
                    </p>
                    <p className="text-3xl font-bold text-orange-900">
                      ${mockEarnings.overview.totalPayouts.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <CreditCard className="w-4 h-4 text-orange-600 mr-1" />
                      <span className="text-sm text-orange-600">All time</span>
                    </div>
                  </div>
                  <Banknote className="w-12 h-12 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Earnings Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Earnings Chart</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      +23% Growth
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Compared to last period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Earning Courses */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Earning Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEarnings.topEarningCourses.map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">
                            {course.title}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {course.students} students • ${course.price}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ${course.earnings.toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEarnings.recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          getTransactionColor(transaction.type)
                        )}
                      >
                        {(() => {
                          const Icon = getTransactionIcon(transaction.type);
                          return <Icon className="w-5 h-5" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="font-semibold">{transaction.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                          <span>{transaction.students} students</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${transaction.amount.toLocaleString()}
                        </p>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
