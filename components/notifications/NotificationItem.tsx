"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Clock,
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
} from "lucide-react";
import {
  Notification,
  NotificationType,
  NotificationPriority,
} from "@/types/notificationTypes";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onActionClick?: (notification: Notification) => void;
  compact?: boolean;
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
      return Check;
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

const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case NotificationPriority.URGENT:
      return "text-red-600 bg-red-50 border-red-200";
    case NotificationPriority.HIGH:
      return "text-orange-600 bg-orange-50 border-orange-200";
    case NotificationPriority.NORMAL:
      return "text-blue-600 bg-blue-50 border-blue-200";
    case NotificationPriority.LOW:
      return "text-gray-600 bg-gray-50 border-gray-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getTypeColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.COURSE_UPDATE:
    case NotificationType.NEW_LECTURE:
      return "text-blue-600";
    case NotificationType.ASSIGNMENT_DUE:
      return "text-red-600";
    case NotificationType.CERTIFICATE_EARNED:
      return "text-green-600";
    case NotificationType.DISCUSSION_REPLY:
      return "text-purple-600";
    case NotificationType.INSTRUCTOR_APPROVED:
      return "text-green-600";
    case NotificationType.SYSTEM_ANNOUNCEMENT:
      return "text-yellow-600";
    case NotificationType.AI_RECOMMENDATION:
      return "text-indigo-600";
    case NotificationType.ENROLLMENT_CONFIRMATION:
      return "text-green-600";
    case NotificationType.PAYMENT_CONFIRMATION:
      return "text-green-600";
    case NotificationType.BOOKING_RECEIVED:
    case NotificationType.BOOKING_ACCEPTED:
    case NotificationType.BOOKING_REJECTED:
      return "text-blue-600";
    case NotificationType.SESSION_REMINDER:
    case NotificationType.SESSION_STARTING:
    case NotificationType.SESSION_COMPLETED:
      return "text-blue-600";
    case NotificationType.PAYMENT_RECEIVED:
    case NotificationType.PAYOUT_PROCESSED:
      return "text-green-600";
    case NotificationType.TOPIC_APPROVAL_NEEDED:
      return "text-orange-600";
    case NotificationType.SCHEDULE_CONFLICT:
      return "text-red-600";
    case NotificationType.NEW_FOLLOWER:
    case NotificationType.UNFOLLOWED:
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  onActionClick,
  compact = false,
}: NotificationItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = getNotificationIcon(notification.type);
  const priorityColor = getPriorityColor(notification.priority);
  const typeColor = getTypeColor(notification.type);

  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick(notification);
    }
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    onDelete(notification.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "relative transition-all duration-200 cursor-pointer group",
          !notification.isRead && "bg-blue-50/50 border-blue-200",
          isHovered && "shadow-md",
          compact && "p-2"
        )}
        onClick={handleActionClick}
      >
        <CardContent className={cn("p-4", compact && "p-2")}>
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                priorityColor
              )}
            >
              <Icon className={cn("w-5 h-5", typeColor)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4
                    className={cn(
                      "font-medium text-sm leading-tight",
                      !notification.isRead && "font-semibold"
                    )}
                  >
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                </div>

                {/* Unread indicator */}
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {notification.priority}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead();
                      }}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  )}

                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead();
                        }}
                        disabled={notification.isRead}
                      >
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Mark as Read
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Action URL */}
              {notification.actionUrl && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(notification.actionUrl, "_blank");
                    }}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
