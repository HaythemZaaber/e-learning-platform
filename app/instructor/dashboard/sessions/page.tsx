"use client";

import { Suspense } from "react";
import { SessionsCalendar } from "@/features/sessions/components/SessionsCalendar";
import { SessionsStats } from "@/features/sessions/components/SessionsStats";
import RequestsManagement from "@/features/sessions/components/RequestManagement";
import { PriceRulesModal } from "@/features/sessions/components/PriceRulesModal";
import { NotificationProvider } from "@/features/sessions/components/NotificationProvider";
import { SessionsProvider } from "@/features/sessions/context/sessionsContext";
import { TopicApprovalPanel } from "@/features/sessions/components/TopicApprovalPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSessions } from "@/features/sessions/context/sessionsContext";
import { useState } from "react";

// Create a separate component that uses the context
function SessionsContent() {
  // This component is rendered inside the SessionsProvider
  // so it's safe to use the useSessions hook here
  const { state } = useSessions();
  const [requestsOpen, setRequestsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <aside className="w-80 border-r bg-card p-6 hidden lg:block">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sessions</h1>
            <p className="text-sm text-muted-foreground">
              Manage your availability and bookings
            </p>
          </div>

          <Suspense
            fallback={
              <div className="animate-pulse h-32 bg-muted rounded-lg" />
            }
          >
            <SessionsStats />
          </Suspense>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b">
          {/* Manage Requests Button */}
          <div className="flex justify-end px-6 pt-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
              onClick={() => setRequestsOpen(true)}
              type="button"
            >
              Manage Requests
            </button>
          </div>
          <Tabs defaultValue="calendar" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="topics" className="relative">
                  Topic Approval
                  {state.sessions.filter(
                    (s) =>
                      s.topicType === "flexible" &&
                      s.status === "pending" &&
                      s.topicRequests &&
                      s.topicRequests.length > 0 &&
                      !s.finalizedTopic
                  ).length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                      {
                        state.sessions.filter(
                          (s) =>
                            s.topicType === "flexible" &&
                            s.status === "pending" &&
                            s.topicRequests &&
                            s.topicRequests.length > 0 &&
                            !s.finalizedTopic
                        ).length
                      }
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calendar" className="flex-1 p-6 mt-0">
              <SessionsCalendar />
            </TabsContent>

            <TabsContent value="topics" className="flex-1 p-6 mt-0">
              <TopicApprovalPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Requests Drawer */}
      <RequestsManagement
        isOpen={requestsOpen}
        onClose={() => setRequestsOpen(false)}
      />

      {/* Modals */}
      <PriceRulesModal />
    </div>
  );
}

// Main page component that provides the context
export default function SessionsPage() {
  return (
    <SessionsProvider>
      <NotificationProvider>
        <SessionsContent />
      </NotificationProvider>
    </SessionsProvider>
  );
}
