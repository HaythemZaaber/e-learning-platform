"use client";

import type React from "react";

import { useEffect } from "react";
import { toast } from "sonner";
import { useSessions } from "../context/sessionsContext";


export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useSessions();

  useEffect(() => {
    // TODO: Implement WebSocket connection for real-time notifications
    // This would listen for new booking requests, payment updates, etc.

    // Mock notification for demo
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        // 5% chance every 5 seconds
        toast.success("New booking request received!", {
          description: "A learner wants to book your JavaScript session.",
          action: {
            label: "View",
            onClick: () => {
              // Open requests drawer
            },
          },
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Listen for payment status changes
  useEffect(() => {
    const paidRequests = state.requests.filter(
      (req) => req.paymentStatus === "paid"
    );
    // TODO: Show toast notifications for payment confirmations
  }, [state.requests]);

  return <>{children}</>;
}
