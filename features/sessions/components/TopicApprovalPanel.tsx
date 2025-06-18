"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Users,
  Brain,
  CheckCircle,
  XCircle,
  Split,
  AlertTriangle,
  MessageSquare,
  Zap,
} from "lucide-react";
import { useSessions } from "../context/sessionsContext";
import type { Session } from "../types/session.types";
import { format, formatDistanceToNow } from "date-fns";

export function TopicApprovalPanel() {
  const { state, actions } = useSessions();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [splitDialogOpen, setSplitDialogOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");

  // Filter sessions that need topic approval
  const pendingTopicSessions = state.sessions.filter(
    (session) =>
      session.topicType === "flexible" &&
      session.status === "pending" &&
      session.topicRequests &&
      session.topicRequests.length > 0 &&
      !session.finalizedTopic
  );

  const handleAcceptMostPopular = async (session: Session) => {
    if (!session.topicClusters || session.topicClusters.length === 0) return;

    const mostPopularCluster = session.topicClusters.reduce((prev, current) =>
      current.learnerCount > prev.learnerCount ? current : prev
    );

    // TODO: Integrate with backend API
    console.log(
      `Accepting most popular topic: ${mostPopularCluster.mainTopic}`
    );

    // Update session with finalized topic
    actions.updateSession(session.id, {
      finalizedTopic: {
        id: `topic_${Date.now()}`,
        sessionId: session.id,
        finalTopic: mostPopularCluster.mainTopic,
        status: "confirmed",
        confirmedAt: new Date(),
        zoomLink: `https://zoom.us/j/${Math.random().toString().substr(2, 10)}`,
      },
      status: "booked",
      title: `${session.domain}: ${mostPopularCluster.mainTopic}`,
    });

    // TODO: Trigger payment processing and notifications
    console.log("Processing payments and sending notifications...");
  };

  const handleSplitIntoGroups = (session: Session) => {
    setSelectedSession(session);
    setSplitDialogOpen(true);
  };

  const handleRejectAll = async (session: Session) => {
    // TODO: Integrate with backend API
    console.log(`Rejecting all topics for session: ${session.id}`);

    actions.updateSession(session.id, {
      status: "available",
      topicRequests: [],
      topicClusters: [],
    });

    // TODO: Refund held payments and notify learners
    console.log("Refunding payments and notifying learners...");
  };

  const executeSplit = () => {
    if (!selectedSession || !selectedSession.topicClusters) return;

    selectedSession.topicClusters.forEach((cluster, index) => {
      if (index === 0) {
        // Update original session with first cluster
        actions.updateSession(selectedSession.id, {
          finalizedTopic: {
            id: `topic_${Date.now()}_${index}`,
            sessionId: selectedSession.id,
            finalTopic: cluster.mainTopic,
            status: "confirmed",
            confirmedAt: new Date(),
          },
          status: "booked",
          title: `${selectedSession.domain}: ${cluster.mainTopic}`,
          capacity: cluster.learnerCount,
        });
      } else {
        // Create new session for additional clusters
        const newSession = {
          ...selectedSession,
          id: `${selectedSession.id}_split_${index}`,
          title:
            newSessionTitle ||
            `${selectedSession.domain}: ${cluster.mainTopic}`,
          capacity: cluster.learnerCount,
          finalizedTopic: {
            id: `topic_${Date.now()}_${index}`,
            sessionId: `${selectedSession.id}_split_${index}`,
            finalTopic: cluster.mainTopic,
            status: "confirmed" as const,
            confirmedAt: new Date(),
          },
          status: "booked" as const,
        };
        actions.createSession(newSession);
      }
    });

    setSplitDialogOpen(false);
    setSelectedSession(null);
    setNewSessionTitle("");
  };

  const getUrgencyColor = (deadline?: Date) => {
    if (!deadline) return "text-muted-foreground";

    const hoursUntilDeadline =
      (deadline.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilDeadline < 6) return "text-red-600";
    if (hoursUntilDeadline < 24) return "text-yellow-600";
    return "text-green-600";
  };

  const SessionTopicCard = ({ session }: { session: Session }) => {
    const timeUntilDeadline = session.topicDeadline
      ? formatDistanceToNow(session.topicDeadline, { addSuffix: true })
      : null;

    const isUrgent = session.topicDeadline
      ? session.topicDeadline.getTime() - Date.now() < 6 * 60 * 60 * 1000
      : false;

    return (
      <Card className={`${isUrgent ? "border-red-200 bg-red-50/50" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{session.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {format(session.start, "MMM d, yyyy 'at' h:mm a")} •{" "}
                {session.capacity} seats
              </p>
            </div>
            {timeUntilDeadline && (
              <Badge
                variant={isUrgent ? "destructive" : "outline"}
                className="flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                {timeUntilDeadline}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* AI Clustering Results */}
          {session.topicClusters && session.topicClusters.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-sm">AI Topic Clustering</span>
                <Badge variant="outline" className="text-xs">
                  {session.topicClusters.length} clusters
                </Badge>
              </div>

              {session.topicClusters.map((cluster) => (
                <div key={cluster.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{cluster.mainTopic}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#0E6E55] text-xs">
                        <Users className="w-2 h-2 mr-1" />
                        {cluster.learnerCount}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(cluster.confidence * 100)}% match
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Related: {cluster.relatedTopics.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Individual Topic Requests */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-sm">Student Requests</span>
              <Badge variant="outline" className="text-xs">
                {session.topicRequests?.length || 0} requests
              </Badge>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {session.topicRequests?.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start gap-2 p-2 bg-background rounded border"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {request.learnerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{request.learnerName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {request.suggestedTopic}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    P{request.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Conflict Alerts */}
          {session.topicClusters && session.topicClusters.length > 2 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                High topic diversity detected. Consider splitting into{" "}
                {session.topicClusters.length} separate sessions.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="bg-[#0E6E55] hover:bg-[#0E6E55]/90 flex-1"
              onClick={() => handleAcceptMostPopular(session)}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Accept Most Popular
            </Button>

            {session.topicClusters && session.topicClusters.length > 1 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSplitIntoGroups(session)}
              >
                <Split className="w-4 h-4 mr-1" />
                Split Groups
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRejectAll(session)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject All
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Topic Approval</h2>
          <p className="text-sm text-muted-foreground">
            Review and finalize topics for flexible sessions
          </p>
        </div>
        <Badge className="bg-[#0E6E55]">
          {pendingTopicSessions.length} pending
        </Badge>
      </div>

      {/* AI Insights */}
      <Card className="border-[#0E6E55]/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#0E6E55]" />
            AI Topic Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-[#0E6E55]/5 rounded-lg">
              <p className="text-lg font-bold text-[#0E6E55]">85%</p>
              <p className="text-xs text-muted-foreground">
                Clustering Accuracy
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-lg font-bold text-blue-700">3.2</p>
              <p className="text-xs text-muted-foreground">
                Avg Topics/Session
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-lg font-bold text-green-700">92%</p>
              <p className="text-xs text-muted-foreground">
                Student Satisfaction
              </p>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-700">
              Trending Topics
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Pandas, React Hooks, Machine Learning are seeing increased demand
              this week
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pending Sessions */}
      {pendingTopicSessions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              No topics pending approval
            </p>
            <p className="text-sm">
              All flexible sessions have been finalized or are awaiting student
              requests.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingTopicSessions.map((session) => (
            <SessionTopicCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {/* Split Session Dialog */}
      <Dialog open={splitDialogOpen} onOpenChange={setSplitDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Split Into Multiple Sessions</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              This will create separate sessions for each topic cluster. The
              original session will be updated with the first cluster.
            </p>

            {selectedSession?.topicClusters?.map((cluster, index) => (
              <div key={cluster.id} className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {cluster.mainTopic}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {cluster.learnerCount} students
                  </Badge>
                </div>
                {index > 0 && (
                  <div className="mt-2">
                    <Label
                      htmlFor={`session-title-${index}`}
                      className="text-xs"
                    >
                      New Session Title
                    </Label>
                    <Input
                      id={`session-title-${index}`}
                      placeholder={`${selectedSession.domain}: ${cluster.mainTopic}`}
                      className="mt-1 text-sm"
                      value={newSessionTitle}
                      onChange={(e) => setNewSessionTitle(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setSplitDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={executeSplit}
                className="bg-[#0E6E55] hover:bg-[#0E6E55]/90"
              >
                Create Sessions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
