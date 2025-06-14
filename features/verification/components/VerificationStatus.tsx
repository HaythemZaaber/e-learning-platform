"use client";

import { CheckCircle, Clock, AlertCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface VerificationStatusProps {
  data: any;
}

export function VerificationStatus({ data }: VerificationStatusProps) {
  const getOverallProgress = () => {
    const stages = Object.values(data);
    const completedStages = stages.filter(
      (stage: any) => stage.verificationStatus === "completed"
    ).length;
    return (completedStages / stages.length) * 100;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Complete</Badge>;
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">
                {Math.round(getOverallProgress())}%
              </span>
            </div>
            <Progress value={getOverallProgress()} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(data.identity?.verificationStatus)}
                <span className="text-sm">Identity</span>
              </div>
              {getStatusBadge(data.identity?.verificationStatus)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(data.professional?.verificationStatus)}
                <span className="text-sm">Professional</span>
              </div>
              {getStatusBadge(data.professional?.verificationStatus)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(data.skills?.verificationStatus)}
                <span className="text-sm">Skills</span>
              </div>
              {getStatusBadge(data.skills?.verificationStatus)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(data.background?.verificationStatus)}
                <span className="text-sm">Background</span>
              </div>
              {getStatusBadge(data.background?.verificationStatus)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-primary mt-1">1.</span>
              <span>Complete all verification stages</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary mt-1">2.</span>
              <span>Wait for admin review (24-48 hours)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary mt-1">3.</span>
              <span>Receive verification confirmation</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary mt-1">4.</span>
              <span>Start creating your first course</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Need help with verification?</p>
          <p className="mt-2">
            Contact our support team at{" "}
            <a
              href="mailto:support@platform.com"
              className="text-primary hover:underline"
            >
              support@platform.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
