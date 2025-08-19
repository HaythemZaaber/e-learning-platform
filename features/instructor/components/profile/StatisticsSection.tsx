"use client";

import { motion } from "framer-motion";
import { InstructorProfile } from "@/types/instructorTypes";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign, 
  Star, 
  Clock, 
  Target,
  Award,
  Calendar,
  MessageSquare,
  Video,
  FileText,
  CheckCircle,
  Activity,
  AlertCircle,
  TrendingDown,
  Zap,
  Heart,
  Brain,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StatisticsSectionProps {
  profile: InstructorProfile;
  isPreviewMode: boolean;
}

export default function StatisticsSection({ profile, isPreviewMode }: StatisticsSectionProps) {
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: profile.currency || 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPerformanceColor = (value: number, max: number = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (value: number, max: number = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return { 
      label: 'Excellent', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle
    };
    if (percentage >= 60) return { 
      label: 'Good', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: TrendingUp
    };
    return { 
      label: 'Needs Improvement', 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: TrendingDown
    };
  };

  const getOverallScore = () => {
    const metrics = [
      profile.courseCompletionRate || 0,
      profile.studentRetentionRate || 0,
      (profile.studentSatisfaction || 0) * 20, // Convert 5-point scale to 100-point
      Math.max(0, 100 - (profile.responseTime || 24) * 4) // Better response time = higher score
    ];
    
    return Math.round(metrics.reduce((sum, metric) => sum + metric, 0) / metrics.length);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: '🏆 Outstanding', color: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' };
    if (score >= 80) return { label: '⭐ Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { label: '👍 Good', color: 'bg-yellow-100 text-yellow-800' };
    return { label: '📈 Improving', color: 'bg-red-100 text-red-800' };
  };

  const overallScore = getOverallScore();
  const scoreBadge = getScoreBadge(overallScore);

  return (
    <div className="space-y-6">
      {/* Overall Performance Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Overall Performance Score
              </div>
              <Badge className={scoreBadge.color}>
                {scoreBadge.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                </div>
                <div className="text-lg text-gray-500 text-center">out of 100</div>
              </div>
            </div>
            
            <Progress value={overallScore} className="h-3 mb-4" />
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {overallScore >= 80 
                  ? "Outstanding performance! You're excelling across all metrics."
                  : overallScore >= 60
                  ? "Good work! Focus on improving weaker areas for better results."
                  : "There's room for improvement. Consider focusing on student engagement and content quality."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Metrics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                    {formatCurrency(profile.totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.revenueSharing || 70}% your share
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                    {(profile.totalStudents || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Across all courses
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                    {profile.totalCourses || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.totalLectures || 0} total lectures
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-3xl font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors">
                    {profile.averageCourseRating?.toFixed(1) || "0.0"}
                  </p>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= (profile.averageCourseRating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-colors">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Student Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Course Completion Rate</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getPerformanceColor(profile.courseCompletionRate || 0)}`}>
                      {(profile.courseCompletionRate || 0).toFixed(1)}%
                    </span>
                    {(() => {
                      const badge = getPerformanceBadge(profile.courseCompletionRate || 0);
                      const Icon = badge.icon;
                      return <Icon className="h-4 w-4 text-gray-500" />;
                    })()}
                  </div>
                </div>
                <Progress value={profile.courseCompletionRate || 0} className="h-2 mb-2" />
                <Badge variant="outline" className={getPerformanceBadge(profile.courseCompletionRate || 0).color}>
                  {getPerformanceBadge(profile.courseCompletionRate || 0).label}
                </Badge>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Student Retention Rate</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getPerformanceColor(profile.studentRetentionRate || 0)}`}>
                      {(profile.studentRetentionRate || 0).toFixed(1)}%
                    </span>
                    <Heart className="h-4 w-4 text-red-500" />
                  </div>
                </div>
                <Progress value={profile.studentRetentionRate || 0} className="h-2 mb-2" />
                <Badge variant="outline" className={getPerformanceBadge(profile.studentRetentionRate || 0).color}>
                  {getPerformanceBadge(profile.studentRetentionRate || 0).label}
                </Badge>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Student Satisfaction</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getPerformanceColor(profile.studentSatisfaction || 0, 5)}`}>
                      {(profile.studentSatisfaction || 0).toFixed(1)}/5.0
                    </span>
                    <Brain className="h-4 w-4 text-purple-500" />
                  </div>
                </div>
                <Progress value={((profile.studentSatisfaction || 0) / 5) * 100} className="h-2 mb-2" />
                <Badge variant="outline" className={getPerformanceBadge((profile.studentSatisfaction || 0) * 20, 100).color}>
                  {getPerformanceBadge((profile.studentSatisfaction || 0) * 20, 100).label}
                </Badge>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Response Time</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-600">
                      {profile.responseTime || 0}h
                    </span>
                    <Zap className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {(profile.responseTime || 0) <= 24 
                    ? '⚡ Excellent response time!' 
                    : '⏰ Consider improving response time'}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Content Creation Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Video className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{profile.totalLectures || 0}</div>
                  <div className="text-sm text-gray-600">Total Lectures</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{profile.totalVideoHours || 0}h</div>
                  <div className="text-sm text-gray-600">Video Content</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <FileText className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{profile.totalQuizzes || 0}</div>
                  <div className="text-sm text-gray-600">Quizzes Created</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <Target className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{profile.totalAssignments || 0}</div>
                  <div className="text-sm text-gray-600">Assignments</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Content Update Frequency</span>
                  <span className="text-sm text-gray-600">
                    Every {profile.contentUpdateFreq || 0} days
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {(profile.contentUpdateFreq || 0) <= 7 
                    ? '🚀 Excellent content freshness!' 
                    : (profile.contentUpdateFreq || 0) <= 30 
                    ? '✅ Good content maintenance' 
                    : '📅 Consider updating content more frequently'}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Recent Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Last Course Update</p>
                    <p className="text-sm text-blue-700">
                      {formatDate(profile.lastCourseUpdate || null)}
                    </p>
                  </div>
                </div>
                <Badge variant={profile.lastCourseUpdate ? "default" : "secondary"}>
                  {profile.lastCourseUpdate ? 'Updated' : 'No updates'}
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Last Student Reply</p>
                    <p className="text-sm text-green-700">
                      {formatDate(profile.lastStudentReply || null)}
                    </p>
                  </div>
                </div>
                <Badge variant={profile.lastStudentReply ? "default" : "secondary"}>
                  {profile.lastStudentReply ? 'Replied' : 'No replies'}
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Video className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Last Content Creation</p>
                    <p className="text-sm text-purple-700">
                      {formatDate(profile.lastContentCreation || null)}
                    </p>
                  </div>
                </div>
                <Badge variant={profile.lastContentCreation ? "default" : "secondary"}>
                  {profile.lastContentCreation ? 'Created' : 'No content'}
                </Badge>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verification & Compliance Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Verification & Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Verification Status</span>
                  <Badge variant={profile.isVerified ? "default" : "secondary"} className={
                    profile.isVerified ? "bg-green-600 text-white" : ""
                  }>
                    {profile.isVerified ? "✅ Verified" : "❌ Not Verified"}
                  </Badge>
                </div>
                
                {profile.verificationLevel && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Verification Level</span>
                    <Badge variant="outline" className="capitalize bg-purple-50 text-purple-700 border-purple-200">
                      {profile.verificationLevel.toLowerCase()}
                    </Badge>
                  </div>
                )}
                
                {profile.lastVerificationDate && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Last Verified</span>
                    <span className="text-sm text-gray-600">
                      {formatDate(profile.lastVerificationDate)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Compliance Status</span>
                  <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-200">
                    {profile.complianceStatus?.toLowerCase() || "Unknown"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Promotion Eligible</span>
                  <Badge variant={profile.isPromotionEligible ? "default" : "secondary"}>
                    {profile.isPromotionEligible ? "✅ Eligible" : "❌ Not Eligible"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Featured Instructor</span>
                  <Badge variant={profile.featuredInstructor ? "default" : "secondary"} className={
                    profile.featuredInstructor ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" : ""
                  }>
                    {profile.featuredInstructor ? "⭐ Featured" : "Not Featured"}
                  </Badge>
                </div>
              </div>
            </div>
            
            {profile.badgesEarned && profile.badgesEarned.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  Achievement Badges
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.badgesEarned.map((badge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + (index * 0.1) }}
                    >
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800 hover:from-amber-100 hover:to-yellow-100 transition-all"
                      >
                        <Award className="h-3 w-3" />
                        {badge.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Insights */}
      {overallScore < 70 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Performance Tip:</strong> Consider focusing on improving student engagement and course completion rates. 
              Regular content updates and quick responses to student questions can significantly boost your metrics.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}