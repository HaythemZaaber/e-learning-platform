"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  CheckCheck,
  Trash2,
  RefreshCw,
  Bell,
  BellOff,
  Settings,
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
import { NotificationItem } from "./NotificationItem";
import { NotificationPagination } from "./NotificationPagination";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Notification,
  NotificationType,
  NotificationPriority,
} from "@/types/notificationTypes";

interface NotificationListProps {
  className?: string;
  maxHeight?: string;
  showFilters?: boolean;
  showTabs?: boolean;
  compact?: boolean;
  initialItemsPerPage?: number;
  showItemsPerPage?: boolean;
  showPagination?: boolean;
}

const notificationTypeIcons = {
  [NotificationType.COURSE_UPDATE]: BookOpen,
  [NotificationType.NEW_LECTURE]: BookOpen,
  [NotificationType.ASSIGNMENT_DUE]: AlertCircle,
  [NotificationType.CERTIFICATE_EARNED]: Award,
  [NotificationType.DISCUSSION_REPLY]: MessageSquare,
  [NotificationType.INSTRUCTOR_APPROVED]: GraduationCap,
  [NotificationType.SYSTEM_ANNOUNCEMENT]: Bell,
  [NotificationType.AI_RECOMMENDATION]: Star,
  [NotificationType.ENROLLMENT_CONFIRMATION]: CheckCheck,
  [NotificationType.PAYMENT_CONFIRMATION]: CreditCard,
  [NotificationType.BOOKING_RECEIVED]: Calendar,
  [NotificationType.BOOKING_ACCEPTED]: Calendar,
  [NotificationType.BOOKING_REJECTED]: Calendar,
  [NotificationType.SESSION_REMINDER]: Calendar,
  [NotificationType.SESSION_STARTING]: Calendar,
  [NotificationType.SESSION_COMPLETED]: Calendar,
  [NotificationType.PAYMENT_RECEIVED]: CreditCard,
  [NotificationType.PAYOUT_PROCESSED]: CreditCard,
  [NotificationType.TOPIC_APPROVAL_NEEDED]: AlertCircle,
  [NotificationType.SCHEDULE_CONFLICT]: AlertCircle,
  [NotificationType.NEW_FOLLOWER]: Users,
  [NotificationType.UNFOLLOWED]: Users,
};

export const NotificationList = ({
  className,
  maxHeight = "400px",
  showFilters = true,
  showTabs = true,
  compact = false,
  initialItemsPerPage = 20,
  showItemsPerPage = true,
  showPagination = true,
}: NotificationListProps) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCount,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getNotificationsByType,
    getUnreadNotifications,
  } = useNotifications();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<NotificationType | "all">(
    "all"
  );
  const [selectedPriority, setSelectedPriority] = useState<
    NotificationPriority | "all"
  >("all");
  const [activeTab, setActiveTab] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "all" || notification.type === selectedType;
    const matchesPriority =
      selectedPriority === "all" || notification.priority === selectedPriority;

    return matchesSearch && matchesType && matchesPriority;
  });

  // Get notifications by tab
  const getNotificationsByTab = (tab: string) => {
    switch (tab) {
      case "unread":
        return getUnreadNotifications();
      case "course":
        return getNotificationsByType(NotificationType.COURSE_UPDATE)
          .concat(getNotificationsByType(NotificationType.NEW_LECTURE))
          .concat(getNotificationsByType(NotificationType.ASSIGNMENT_DUE))
          .concat(getNotificationsByType(NotificationType.CERTIFICATE_EARNED));
      case "sessions":
        return getNotificationsByType(NotificationType.BOOKING_RECEIVED)
          .concat(getNotificationsByType(NotificationType.BOOKING_ACCEPTED))
          .concat(getNotificationsByType(NotificationType.SESSION_REMINDER))
          .concat(getNotificationsByType(NotificationType.SESSION_STARTING));
      case "payments":
        return getNotificationsByType(NotificationType.PAYMENT_CONFIRMATION)
          .concat(getNotificationsByType(NotificationType.PAYMENT_RECEIVED))
          .concat(getNotificationsByType(NotificationType.PAYOUT_PROCESSED));
      case "system":
        return getNotificationsByType(
          NotificationType.SYSTEM_ANNOUNCEMENT
        ).concat(getNotificationsByType(NotificationType.AI_RECOMMENDATION));
      default:
        return filteredNotifications;
    }
  };

  const currentNotifications = getNotificationsByTab(activeTab);

  // Load notifications on mount and when itemsPerPage changes
  useEffect(() => {
    fetchNotifications(1, itemsPerPage);
  }, [itemsPerPage]);

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleRefresh = () => {
    fetchNotifications(currentPage, itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    fetchNotifications(page, itemsPerPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  };

  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionUrl) {
      window.open(notification.actionUrl, "_blank");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as any)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(NotificationType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedPriority}
              onValueChange={(value) => setSelectedPriority(value as any)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {Object.values(NotificationPriority).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Tabs */}
      {showTabs && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="course">Course</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Notifications List */}
      <div
      // className={maxHeight ? "overflow-y-auto" : ""}
      // style={maxHeight ? { maxHeight } : {}}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading notifications...
            </span>
          </div>
        ) : currentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <BellOff className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No notifications found
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-1 p-2">
              {currentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markNotificationAsRead}
                  onDelete={deleteNotification}
                  onActionClick={handleNotificationAction}
                  compact={compact}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {showPagination && (
        <NotificationPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          isLoading={isLoading}
          showItemsPerPage={showItemsPerPage}
        />
      )}
    </div>
  );
};
