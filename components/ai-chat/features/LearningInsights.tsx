"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Target,
  BookOpen,
  Clock,
  Award,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Calendar,
  Users,
  Star,
} from "lucide-react";
import { LearningInsightsDto } from "@/types/aiChatTypes";
import { useAIChatStore } from "@/stores/aiChat.store";

interface LearningInsightsProps {
  onClose?: () => void;
}

export const LearningInsights: React.FC<LearningInsightsProps> = ({
  onClose,
}) => {
  const { getLearningInsights, learningInsights, isLoading } = useAIChatStore();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      getLearningInsights();
      setHasLoaded(true);
    }
  }, [getLearningInsights, hasLoaded]);

  const handleRefresh = () => {
    setHasLoaded(false);
    getLearningInsights();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Analyzing your learning data...
          </p>
        </div>
      </div>
    );
  }

  if (!learningInsights) {
    return (
      <div className="text-center p-8">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-medium mb-2">No insights available</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Complete some courses to get personalized learning insights
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Learning Insights</h2>
            <p className="text-sm text-muted-foreground">
              Personalized analysis of your learning journey
            </p>
          </div>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Motivation Quote */}
      {learningInsights.motivation && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Daily Motivation</h4>
                <p className="text-sm text-muted-foreground italic">
                  "{learningInsights.motivation}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {learningInsights.strengths && learningInsights.strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {learningInsights.strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200"
                >
                  <Award className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {strength}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Areas for Improvement */}
      {learningInsights.improvements &&
        learningInsights.improvements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {learningInsights.improvements.map((improvement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200"
                  >
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      {improvement}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Recommendations */}
      {learningInsights.recommendations &&
        learningInsights.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Lightbulb className="w-5 h-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {learningInsights.recommendations.map(
                  (recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm text-blue-800">
                        {recommendation}
                      </span>
                    </motion.div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Next Steps */}
      {learningInsights.nextSteps && learningInsights.nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <TrendingUp className="w-5 h-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {learningInsights.nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-purple-800">
                      {step}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button className="flex-1">
          <BookOpen className="w-4 h-4 mr-2" />
          Browse Courses
        </Button>
        <Button variant="outline" className="flex-1">
          <Target className="w-4 h-4 mr-2" />
          Set Goals
        </Button>
      </div>
    </div>
  );
};
