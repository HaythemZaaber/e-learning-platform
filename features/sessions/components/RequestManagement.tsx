"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DollarSign,
  MessageSquare,
  MoreHorizontal,
  Check,
  X,
  CreditCard,
  Timer,
  TrendingUp,
  Search,
  Filter,
  Users,
  Clock,
  Star,
  Eye,
  ChevronRight,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  Briefcase,
  Award,
  Target,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// Mock data for demonstration
const mockRequests = [
  {
    id: "1",
    learnerName: "Alice Johnson",
    learnerAvatar: "/placeholder.svg",
    learnerEmail: "alice@example.com",
    learnerRating: 4.8,
    learnerCompletedSessions: 12,
    sessionId: "session-1",
    sessionTitle: "Advanced React Patterns",
    sessionDate: new Date("2024-12-15"),
    sessionTime: "14:00",
    sessionType: "individual",
    offeredPrice: 75,
    basePrice: 60,
    message:
      "I'm particularly interested in learning about advanced React hooks and state management patterns. I have experience with basic React but want to dive deeper.",
    status: "pending",
    paymentStatus: null,
    isHighestBid: true,
    submittedAt: new Date("2024-12-10T10:30:00"),
    expiresAt: new Date("2024-12-12T10:30:00"),
    learnerLocation: "New York, NY",
    learnerTimezone: "EST",
    priority: "high",
  },
  {
    id: "2",
    learnerName: "Bob Smith",
    learnerAvatar: "/placeholder.svg",
    learnerEmail: "bob@example.com",
    learnerRating: 4.2,
    learnerCompletedSessions: 8,
    sessionId: "session-2",
    sessionTitle: "Python Data Science",
    sessionDate: new Date("2024-12-16"),
    sessionTime: "10:00",
    sessionType: "group",
    offeredPrice: 45,
    basePrice: 50,
    message:
      "Looking to improve my data analysis skills with pandas and matplotlib.",
    status: "pending",
    paymentStatus: null,
    isHighestBid: false,
    submittedAt: new Date("2024-12-09T15:20:00"),
    expiresAt: new Date("2024-12-13T15:20:00"),
    learnerLocation: "San Francisco, CA",
    learnerTimezone: "PST",
    priority: "medium",
  },
  {
    id: "3",
    learnerName: "Carol Wilson",
    learnerAvatar: "/placeholder.svg",
    learnerEmail: "carol@example.com",
    learnerRating: 4.9,
    learnerCompletedSessions: 25,
    sessionId: "session-1",
    sessionTitle: "Advanced React Patterns",
    sessionDate: new Date("2024-12-15"),
    sessionTime: "14:00",
    sessionType: "individual",
    offeredPrice: 80,
    basePrice: 60,
    message:
      "I'm a senior developer looking to learn advanced React patterns for my team.",
    status: "accepted",
    paymentStatus: "awaiting",
    isHighestBid: false,
    submittedAt: new Date("2024-12-08T09:15:00"),
    expiresAt: new Date("2024-12-11T09:15:00"),
    learnerLocation: "Austin, TX",
    learnerTimezone: "CST",
    priority: "high",
  },
];

interface RequestsManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestsManagement({
  isOpen,
  onClose,
}: RequestsManagementProps) {
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Enhanced filtering and sorting
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = mockRequests.filter((request) => {
      const matchesSearch =
        request.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "pending" && request.status === "pending") ||
        (activeTab === "accepted" && request.status === "accepted") ||
        (activeTab === "high-value" &&
          request.offeredPrice > request.basePrice);

      return matchesSearch && matchesStatus && matchesTab;
    });

    // Sort requests
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return b.offeredPrice - a.offeredPrice;
        case "rating":
          return b.learnerRating - a.learnerRating;
        case "expires":
          return a.expiresAt.getTime() - b.expiresAt.getTime();
        default:
          return b.submittedAt.getTime() - a.submittedAt.getTime();
      }
    });

    return filtered;
  }, [mockRequests, searchTerm, statusFilter, sortBy, activeTab]);

  const pendingRequests = mockRequests.filter(
    (req) => req.status === "pending"
  );
  const acceptedRequests = mockRequests.filter(
    (req) => req.status === "accepted"
  );
  const highValueRequests = mockRequests.filter(
    (req) => req.offeredPrice > req.basePrice
  );

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        color: "bg-amber-500",
        bgColor: "bg-amber-50 border-amber-200",
        textColor: "text-amber-700",
        badge: "secondary",
      },
      accepted: {
        color: "bg-green-500",
        bgColor: "bg-green-50 border-green-200",
        textColor: "text-green-700",
        badge: "default",
      },
      rejected: {
        color: "bg-red-500",
        bgColor: "bg-red-50 border-red-200",
        textColor: "text-red-700",
        badge: "destructive",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: { color: "text-red-600", bg: "bg-red-50" },
      medium: { color: "text-amber-600", bg: "bg-amber-50" },
      low: { color: "text-green-600", bg: "bg-green-50" },
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const handleSelectRequest = useCallback(
    (requestId: string, checked: boolean) => {
      setSelectedRequests((prev) =>
        checked ? [...prev, requestId] : prev.filter((id) => id !== requestId)
      );
    },
    []
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedRequests(checked ? pendingRequests.map((req) => req.id) : []);
    },
    [pendingRequests]
  );

  const handleBulkAction = useCallback(
    (action: "accept" | "reject") => {
      console.log(`${action} requests:`, selectedRequests);
      setSelectedRequests([]);
    },
    [selectedRequests]
  );

  const isExpiringSoon = (expiresAt: Date) => {
    return expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Booking Requests Management
              </DialogTitle>
            </DialogHeader>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {pendingRequests.length}
                      </p>
                    </div>
                    <Timer className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Accepted
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {acceptedRequests.length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        High Value
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        {highValueRequests.length}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700">
                        Potential Revenue
                      </p>
                      <p className="text-2xl font-bold text-amber-900">
                        $
                        {pendingRequests.reduce(
                          (sum, req) => sum + req.offeredPrice,
                          0
                        )}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-amber-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Status Alert */}
            {acceptedRequests.some(
              (req) => req.paymentStatus === "awaiting"
            ) && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>
                    {
                      acceptedRequests.filter(
                        (req) => req.paymentStatus === "awaiting"
                      ).length
                    }
                  </strong>{" "}
                  payment(s) pending. Learners have 24 hours to complete
                  payment.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 p-6 bg-white border-b">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by learner name, session, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
                <SelectItem value="expires">Sort by Expiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedRequests.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border-b">
              <span className="text-sm font-medium text-blue-900">
                {selectedRequests.length} request
                {selectedRequests.length > 1 ? "s" : ""} selected
              </span>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleBulkAction("accept")}
              >
                <Check className="w-4 h-4 mr-1" />
                Accept All
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => handleBulkAction("reject")}
              >
                <X className="w-4 h-4 mr-1" />
                Reject All
              </Button>
            </div>
          )}

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="border-b px-6">
              <TabsList className="bg-transparent border-none h-auto p-0">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3"
                >
                  All Requests ({mockRequests.length})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3"
                >
                  Pending ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger
                  value="accepted"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3"
                >
                  Accepted ({acceptedRequests.length})
                </TabsTrigger>
                <TabsTrigger
                  value="high-value"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3"
                >
                  High Value ({highValueRequests.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Request List */}
            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value={activeTab} className="mt-0 space-y-4">
                {filteredAndSortedRequests.length === 0 ? (
                  <Card className="border-dashed border-2">
                    <CardContent className="p-12 text-center">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h4 className="font-semibold text-lg mb-2">
                        No requests found
                      </h4>
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== "all"
                          ? "Try adjusting your filters or search terms"
                          : "New booking requests will appear here"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAndSortedRequests.map((request) => {
                    const statusConfig = getStatusConfig(request.status);
                    const priorityConfig = getPriorityConfig(request.priority);
                    const timeUntilExpiry = formatDistanceToNow(
                      request.expiresAt,
                      { addSuffix: true }
                    );
                    const expiringSoon = isExpiringSoon(request.expiresAt);

                    return (
                      <Card
                        key={request.id}
                        className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${statusConfig.bgColor}`}
                        style={{
                          borderLeftColor: statusConfig.color.replace(
                            "bg-",
                            "#"
                          ),
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              {request.status === "pending" && (
                                <Checkbox
                                  checked={selectedRequests.includes(
                                    request.id
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleSelectRequest(
                                      request.id,
                                      checked as boolean
                                    )
                                  }
                                  className="mt-1"
                                />
                              )}

                              <Avatar className="h-12 w-12">
                                <AvatarImage src={request.learnerAvatar} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100">
                                  {request.learnerName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-lg">
                                        {request.learnerName}
                                      </h4>
                                      <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">
                                          {request.learnerRating}
                                        </span>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${priorityConfig.color} ${priorityConfig.bg}`}
                                      >
                                        {request.priority} priority
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {request.learnerCompletedSessions}{" "}
                                      completed sessions •{" "}
                                      {request.learnerLocation}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" />
                                        {request.sessionTitle}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {format(
                                          request.sessionDate,
                                          "MMM d"
                                        )} • {request.sessionTime}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {request.sessionType}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="text-right space-y-2">
                                    <div className="flex items-center gap-2">
                                      <div className="text-right">
                                        <div className="flex items-center gap-1">
                                          <DollarSign className="w-4 h-4" />
                                          <span className="text-xl font-bold text-green-600">
                                            ${request.offeredPrice}
                                          </span>
                                          {request.isHighestBid && (
                                            <Badge className="ml-1 bg-green-100 text-green-800">
                                              <TrendingUp className="w-3 h-3 mr-1" />
                                              Highest
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          Base: ${request.basePrice}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant={statusConfig.badge as any}
                                        className="capitalize"
                                      >
                                        {request.status}
                                      </Badge>

                                      {request.status === "pending" && (
                                        <div
                                          className={`text-xs flex items-center gap-1 ${
                                            expiringSoon
                                              ? "text-red-600 font-medium"
                                              : "text-muted-foreground"
                                          }`}
                                        >
                                          <Timer className="w-3 h-3" />
                                          {timeUntilExpiry}
                                        </div>
                                      )}

                                      {request.paymentStatus && (
                                        <Badge
                                          className={`text-xs ${
                                            request.paymentStatus === "awaiting"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : request.paymentStatus === "paid"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          <CreditCard className="w-3 h-3 mr-1" />
                                          {request.paymentStatus}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Message Preview */}
                                <div className="bg-white/50 rounded-lg p-3 border">
                                  <p className="text-sm text-gray-700 line-clamp-2">
                                    {request.message}
                                  </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-3 border-t">
                                  <div className="flex items-center gap-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setSelectedRequest(request)
                                      }
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      View Details
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <MessageSquare className="w-4 h-4 mr-1" />
                                      Message
                                    </Button>
                                  </div>

                                  {request.status === "pending" && (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        Reject
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <Check className="w-4 h-4 mr-1" />
                                        Accept
                                      </Button>
                                    </div>
                                  )}

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuItem>
                                        <User className="w-4 h-4 mr-2" />
                                        View Profile
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Email
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-red-600">
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Block Learner
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Request Details Modal */}
        {selectedRequest && (
          <Dialog
            open={!!selectedRequest}
            onOpenChange={() => setSelectedRequest(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedRequest.learnerAvatar} />
                    <AvatarFallback>
                      {selectedRequest.learnerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  Request from {selectedRequest.learnerName}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Learner Information
                      </Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{selectedRequest.learnerRating} rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span>
                            {selectedRequest.learnerCompletedSessions} completed
                            sessions
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedRequest.learnerLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Session Details
                      </Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <span>{selectedRequest.sessionTitle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {format(selectedRequest.sessionDate, "PPP")} at{" "}
                            {selectedRequest.sessionTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedRequest.sessionType}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Pricing
                      </Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span>Base Price:</span>
                          <span>${selectedRequest.basePrice}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Offered Price:</span>
                          <span className="text-green-600">
                            ${selectedRequest.offeredPrice}
                          </span>
                        </div>
                        {selectedRequest.offeredPrice >
                          selectedRequest.basePrice && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Premium:</span>
                            <span>
                              +$
                              {selectedRequest.offeredPrice -
                                selectedRequest.basePrice}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Message
                  </Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      {selectedRequest.message}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Submitted
                    </Label>
                    <p className="text-sm mt-1">
                      {format(selectedRequest.submittedAt, "PPp")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Expires
                    </Label>
                    <p className="text-sm mt-1">
                      {format(selectedRequest.expiresAt, "PPp")}
                    </p>
                  </div>
                </div>

                {selectedRequest.status === "pending" && (
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
