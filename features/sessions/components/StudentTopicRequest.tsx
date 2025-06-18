"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import type { Session, TopicRequest } from "../types/session.types";
import { format } from "date-fns";

interface StudentTopicRequestProps {
  session: Session;
  onSubmitRequest: (request: Omit<TopicRequest, "id" | "createdAt">) => void;
}

export function StudentTopicRequest({
  session,
  onSubmitRequest,
}: StudentTopicRequestProps) {
  const [topicRequest, setTopicRequest] = useState({
    suggestedTopic: "",
    description: "",
    priority: 3,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock current user data
  const currentUser = {
    id: "current_learner",
    name: "Current Student",
  };

  // Get popular topics from existing requests
  const getPopularTopics = () => {
    if (!session.topicRequests) return [];

    const topicCounts = session.topicRequests.reduce((acc, req) => {
      const topic = req.suggestedTopic.toLowerCase();
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([topic, count]) => ({ topic, count }));
  };

  const handleSubmit = async () => {
    if (!topicRequest.suggestedTopic.trim()) return;

    setIsSubmitting(true);

    const request: Omit<TopicRequest, "id" | "createdAt"> = {
      sessionId: session.id,
      learnerId: currentUser.id,
      learnerName: currentUser.name,
      suggestedTopic: topicRequest.suggestedTopic,
      description: topicRequest.description,
      priority: topicRequest.priority,
    };

    try {
      await onSubmitRequest(request);

      // Reset form
      setTopicRequest({
        suggestedTopic: "",
        description: "",
        priority: 3,
      });
    } catch (error) {
      console.error("Failed to submit topic request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const popularTopics = getPopularTopics();
  const hasExistingRequest = session.topicRequests?.some(
    (req) => req.learnerId === currentUser.id
  );

  if (session.topicType !== "flexible") {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-semibold mb-2">Fixed Topic Session</h3>
          <p className="text-muted-foreground mb-4">
            This session covers: <strong>{session.fixedTopic}</strong>
          </p>
          <Button className="bg-[#0E6E55] hover:bg-[#0E6E55]/90">
            Book Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (hasExistingRequest) {
    const userRequest = session.topicRequests?.find(
      (req) => req.learnerId === currentUser.id
    );

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Topic Request Submitted</h3>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">
                Your suggested topic:
              </Label>
              <p className="text-muted-foreground">
                {userRequest?.suggestedTopic}
              </p>
            </div>

            {userRequest?.description && (
              <div>
                <Label className="text-sm font-medium">Description:</Label>
                <p className="text-muted-foreground text-sm">
                  {userRequest.description}
                </p>
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Awaiting instructor confirmation. You'll be notified once the
                topic is finalized. Payment will be processed after
                confirmation.
              </AlertDescription>
            </Alert>

            {popularTopics.length > 0 && (
              <div className="pt-2">
                <Label className="text-sm font-medium mb-2 block">
                  Other popular requests:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {popularTopics.map(({ topic, count }) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Suggest a Topic
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          This is a flexible session in <strong>{session.domain}</strong>.
          Suggest a specific topic you'd like to learn about.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Popular Topics Display */}
        {popularTopics.length > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="font-medium text-sm">
                Popular requests so far:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTopics.map(({ topic, count }) => (
                <Button
                  key={topic}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() =>
                    setTopicRequest((prev) => ({
                      ...prev,
                      suggestedTopic: topic,
                    }))
                  }
                >
                  {topic} ({count})
                  <Users className="w-3 h-3 ml-1" />
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click to use a popular topic, or suggest your own below
            </p>
          </div>
        )}

        {/* Topic Request Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="suggested-topic">Suggested Topic *</Label>
            <Input
              id="suggested-topic"
              placeholder={`e.g., ${
                session.domain === "Data Science"
                  ? "Pandas Data Manipulation"
                  : "Advanced React Hooks"
              }`}
              value={topicRequest.suggestedTopic}
              onChange={(e) =>
                setTopicRequest((prev) => ({
                  ...prev,
                  suggestedTopic: e.target.value,
                }))
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="topic-description">
              Why this topic? (Optional)
            </Label>
            <Textarea
              id="topic-description"
              placeholder="Brief explanation of what you want to learn or your current level..."
              value={topicRequest.description}
              onChange={(e) =>
                setTopicRequest((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select
              value={topicRequest.priority.toString()}
              onValueChange={(value) =>
                setTopicRequest((prev) => ({
                  ...prev,
                  priority: Number.parseInt(value),
                }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Nice to have</SelectItem>
                <SelectItem value="2">2 - Interested</SelectItem>
                <SelectItem value="3">3 - Important</SelectItem>
                <SelectItem value="4">4 - Very important</SelectItem>
                <SelectItem value="5">5 - Critical for my project</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Session Details */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            <strong>Session:</strong>{" "}
            {format(session.start, "MMM d, yyyy 'at' h:mm a")}
          </p>
          <p>
            <strong>Duration:</strong>{" "}
            {Math.round(
              (session.end.getTime() - session.start.getTime()) / (1000 * 60)
            )}{" "}
            minutes
          </p>
          <p>
            <strong>Price:</strong> ${session.basePrice} (payment after topic
            confirmation)
          </p>
          <p>
            <strong>Deadline:</strong> Topic will be finalized{" "}
            {session.topicDeadline
              ? format(session.topicDeadline, "MMM d 'at' h:mm a")
              : "24 hours before session"}
          </p>
        </div>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>How it works:</strong> The instructor will review all topic
            suggestions and either choose the most popular one or split into
            multiple focused sessions. Payment is only processed after topic
            confirmation.
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleSubmit}
          disabled={!topicRequest.suggestedTopic.trim() || isSubmitting}
          className="w-full bg-[#0E6E55] hover:bg-[#0E6E55]/90"
        >
          {isSubmitting ? "Submitting..." : "Submit Topic Request"}
        </Button>
      </CardContent>
    </Card>
  );
}
