"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  BellRing,
  CheckCheck,
  Settings,
  ExternalLink,
  AlertCircle,
  Info,
  Star,
  MessageSquare,
  Calendar,
  CreditCard,
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Clock,
} from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import {
  useNotifications,
  useNotificationCount,
} from "@/hooks/useNotifications";
import { Notification, NotificationType } from "@/types/notificationTypes";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface NotificationDropdownProps {
  className?: string;
  maxItems?: number;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.COURSE_UPDATE:
    case NotificationType.NEW_LECTURE:
      return BookOpen;
    case NotificationType.ASSIGNMENT_DUE:
      return AlertCircle;
    case NotificationType.CERTIFICATE_EARNED:
      return Award;
    case NotificationType.DISCUSSION_REPLY:
      return MessageSquare;
    case NotificationType.INSTRUCTOR_APPROVED:
      return GraduationCap;
    case NotificationType.SYSTEM_ANNOUNCEMENT:
      return BellRing;
    case NotificationType.AI_RECOMMENDATION:
      return Star;
    case NotificationType.ENROLLMENT_CONFIRMATION:
      return CheckCheck;
    case NotificationType.PAYMENT_CONFIRMATION:
      return CreditCard;
    case NotificationType.BOOKING_RECEIVED:
    case NotificationType.BOOKING_ACCEPTED:
    case NotificationType.BOOKING_REJECTED:
      return Calendar;
    case NotificationType.SESSION_REMINDER:
    case NotificationType.SESSION_STARTING:
    case NotificationType.SESSION_COMPLETED:
      return Clock;
    case NotificationType.PAYMENT_RECEIVED:
    case NotificationType.PAYOUT_PROCESSED:
      return CreditCard;
    case NotificationType.TOPIC_APPROVAL_NEEDED:
      return AlertCircle;
    case NotificationType.SCHEDULE_CONFLICT:
      return AlertCircle;
    case NotificationType.NEW_FOLLOWER:
    case NotificationType.UNFOLLOWED:
      return Users;
    default:
      return Bell;
  }
};

export const NotificationDropdown = ({
  className,
  maxItems = 5,
}: NotificationDropdownProps) => {
  const { user } = useAuth();
  const { unreadCount, isConnected } = useNotificationCount();
  const {
    notifications,
    isLoading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    fetchNotifications,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications(1, 10);
    }
  }, [isOpen, notifications.length, fetchNotifications]);

  const recentNotifications = notifications.slice(0, maxItems);
  const hasMore = notifications.length > maxItems;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleViewAll = () => {
    // Navigate to role-specific notifications page
    const userRole = (user?.role || "student").toLowerCase();
    window.location.href = `/${userRole}/notifications`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative hover:text-black hover:bg-primary/10",
            className
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={5}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="font-medium text-sm">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="w-3 h-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleViewAll}
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="px-4 py-2 bg-yellow-50 border-b">
            <div className="flex items-center gap-2 text-xs text-yellow-700">
              <AlertCircle className="w-3 h-3" />
              <span>Notifications may be delayed</span>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="p-2">
              <AnimatePresence>
                {recentNotifications.map((notification, index) => {
                  const Icon = getNotificationIcon(notification.type);

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="mb-2 last:mb-0"
                    >
                      <div
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                          !notification.isRead && "bg-blue-50/50"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                            !notification.isRead
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4
                                className={cn(
                                  "text-sm font-medium leading-tight",
                                  !notification.isRead && "font-semibold"
                                )}
                              >
                                {notification.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>

                            {/* Unread indicator */}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>

                          {/* Time */}
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                { addSuffix: true }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {hasMore && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-xs"
              onClick={handleViewAll}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
