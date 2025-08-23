"use client";

import { useState } from "react";
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Target, 
  AlertCircle, 
  Lightbulb, 
  BarChart3, 
  Clock, 
  DollarSign,
  Users,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

import { AIInsight, InsightType, InsightPriority } from "@/features/sessions/types/session.types";

interface AIInsightsPanelProps {
  insights?: AIInsight[];
  compact?: boolean;
  className?: string;
}

export function AIInsightsPanel({ insights = [], compact = false, className = "" }: AIInsightsPanelProps) {
  const [openInsights, setOpenInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock insights data for demonstration
  const mockInsights: AIInsight[] = [
    {
      id: "1",
      type: InsightType.PERFORMANCE_ANALYSIS,
      title: "High Student Satisfaction",
      description: "Your recent sessions have received excellent ratings. Students particularly appreciate your clear explanations and interactive approach.",
      priority: InsightPriority.HIGH,
      confidence: 0.95,
      metrics: {
        averageRating: 4.8,
        studentRetention: 0.92,
        sessionCompletion: 0.98
      },
      recommendations: [
        "Continue using interactive examples in your sessions",
        "Consider creating more advanced content for returning students",
        "Share your teaching methodology with other instructors"
      ],
      action: "View Analytics",
      impact: 9,
      actionable: true,
      category: "student_satisfaction",
      createdAt: new Date("2024-01-15T10:00:00Z"),
      expiresAt: new Date("2024-02-15T10:00:00Z")
    },
    {
      id: "2",
      type: InsightType.PRICING_SUGGESTION,
      title: "Pricing Optimization Opportunity",
      description: "Analysis shows you could increase your session prices by 15-20% without affecting demand, based on your expertise level and market rates.",
      priority: InsightPriority.MEDIUM,
      confidence: 0.87,
      metrics: {
        currentPrice: 75,
        suggestedPrice: 90,
        marketAverage: 85,
        demandElasticity: 0.3
      },
      recommendations: [
        "Gradually increase prices by 10% over the next month",
        "Monitor booking rates after price changes",
        "Consider offering premium packages for advanced topics"
      ],
      action: "Update Pricing",
      impact: 7,
      actionable: true,
      category: "pricing",
      createdAt: new Date("2024-01-14T15:30:00Z"),
      expiresAt: new Date("2024-02-14T15:30:00Z")
    },
    {
      id: "3",
      type: InsightType.SCHEDULE_OPTIMIZATION,
      title: "Session Cancellation Rate",
      description: "Your session cancellation rate has increased by 25% in the last month. This may affect your reliability score and student trust.",
      priority: InsightPriority.HIGH,
      confidence: 0.78,
      metrics: {
        cancellationRate: 0.12,
        previousRate: 0.09,
        impact: -0.15
      },
      recommendations: [
        "Review your cancellation policy and communicate it clearly",
        "Set up automated reminders 24 hours before sessions",
        "Consider offering makeup sessions for legitimate cancellations"
      ],
      action: "Review Policy",
      impact: 6,
      actionable: true,
      category: "reliability",
      createdAt: new Date("2024-01-13T09:15:00Z"),
      expiresAt: new Date("2024-02-13T09:15:00Z")
    },
    {
      id: "4",
      type: InsightType.DEMAND_PREDICTION,
      title: "New Topic Demand",
      description: "There's growing demand for 'Advanced TypeScript Patterns' sessions. Students are actively searching for this content.",
      priority: InsightPriority.MEDIUM,
      confidence: 0.82,
      metrics: {
        searchVolume: 150,
        growthRate: 0.35,
        competition: 0.4
      },
      recommendations: [
        "Create a new session offering for Advanced TypeScript",
        "Research competitor pricing for similar sessions",
        "Prepare sample content to test student interest"
      ],
      action: "Create Session",
      impact: 8,
      actionable: true,
      category: "content_opportunity",
      createdAt: new Date("2024-01-12T14:20:00Z"),
      expiresAt: new Date("2024-02-12T14:20:00Z")
    }
  ];

  const displayInsights = insights.length > 0 ? insights : mockInsights;

  const toggleInsight = (insightId: string) => {
    setOpenInsights(prev => 
      prev.includes(insightId) 
        ? prev.filter(id => id !== insightId)
        : [...prev, insightId]
    );
  };

  const handleAction = async (insight: AIInsight) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (insight.action) {
        case "View Analytics":
          toast.success("Opening analytics dashboard...");
          break;
        case "Update Pricing":
          toast.success("Redirecting to pricing settings...");
          break;
        case "Review Policy":
          toast.success("Opening cancellation policy settings...");
          break;
        case "Create Session":
          toast.success("Opening session creation form...");
          break;
        default:
          toast.success("Action completed successfully!");
      }
    } catch (error) {
      toast.error("Failed to complete action");
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: InsightType) => {
    switch (type) {
      case InsightType.PERFORMANCE_ANALYSIS:
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case InsightType.PRICING_SUGGESTION:
        return <Target className="h-5 w-5 text-blue-600" />;
      case InsightType.SCHEDULE_OPTIMIZATION:
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case InsightType.DEMAND_PREDICTION:
        return <BarChart3 className="h-5 w-5 text-purple-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getPriorityBadge = (priority: InsightPriority) => {
    switch (priority) {
      case InsightPriority.HIGH:
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case InsightPriority.MEDIUM:
        return <Badge variant="secondary" className="text-xs">Medium Priority</Badge>;
      case InsightPriority.LOW:
        return <Badge variant="outline" className="text-xs">Low Priority</Badge>;
      default:
        return null;
    }
  };

  const getImpactIcon = (impact: number) => {
    if (impact > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (impact < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    } else {
      return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-yellow-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayInsights.slice(0, 2).map((insight) => (
              <div
                key={insight.id}
                className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {insight.description}
                    </p>
                    {insight.action && (
                      <Button size="sm" variant="outline" className="text-xs">
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {displayInsights.length > 2 && (
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View {displayInsights.length - 2} more insights
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          AI Insights & Recommendations
          <Badge variant="secondary" className="ml-auto">
            {displayInsights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayInsights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No insights available yet</p>
              <p className="text-sm">AI insights will appear as you conduct more sessions</p>
            </div>
          ) : (
            displayInsights.map((insight) => (
              <Collapsible
                key={insight.id}
                open={openInsights.includes(insight.id)}
                onOpenChange={() => toggleInsight(insight.id)}
              >
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-start justify-between cursor-pointer">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                            {getPriorityBadge(insight.priority)}
                            {getImpactIcon(insight.impact)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {insight.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              Confidence: {Math.round(insight.confidence * 100)}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(insight.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {insight.action && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(insight);
                            }}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : null}
                            {insight.action}
                          </Button>
                        )}
                        {openInsights.includes(insight.id) ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-4 space-y-4">
                    {/* Metrics */}
                    {insight.metrics && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-2">Key Metrics</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(insight.metrics).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-lg font-bold">
                                {typeof value === 'number' && value < 1 
                                  ? `${Math.round(value * 100)}%` 
                                  : typeof value === 'number' && key.includes('Price')
                                  ? `$${value}`
                                  : value
                                }
                              </div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {insight.recommendations && insight.recommendations.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2">Recommendations</h5>
                        <ul className="space-y-2">
                          {insight.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Confidence and Expiry */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-4">
                        <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                        <span>Category: {insight.category.replace(/_/g, ' ')}</span>
                      </div>
                      <span>
                        Expires: {insight.expiresAt && new Date(insight.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
