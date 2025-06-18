"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
} from "lucide-react";
import { useSessions } from "../context/sessionsContext";
import type { BookingRequest } from "../types/session.types";
import { format, formatDistanceToNow } from "date-fns";

export function RequestsDrawer() {
  const { state, dispatch, actions } = useSessions();
  const { requests, isRequestsDrawerOpen } = state;
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const acceptedRequests = requests.filter((req) => req.status === "accepted");

  const handleSelectRequest = (requestId: string, checked: boolean) => {
    if (checked) {
      setSelectedRequests((prev) => [...prev, requestId]);
    } else {
      setSelectedRequests((prev) => prev.filter((id) => id !== requestId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(pendingRequests.map((req) => req.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleBulkAction = (action: "accept" | "reject") => {
    const updates = {
      status: action === "accept" ? "accepted" : "rejected",
    } as const;
    actions.bulkUpdateRequests(selectedRequests, updates);
    setSelectedRequests([]);
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "awaiting":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const RequestRow = ({ request }: { request: BookingRequest }) => {
    const timeUntilExpiry = formatDistanceToNow(request.expiresAt, {
      addSuffix: true,
    });
    const isExpiringSoon =
      request.expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000;

    return (
      <TableRow key={request.id} className="hover:bg-muted/50">
        <TableCell className="w-12">
          {request.status === "pending" && (
            <Checkbox
              checked={selectedRequests.includes(request.id)}
              onCheckedChange={(checked) =>
                handleSelectRequest(request.id, checked as boolean)
              }
            />
          )}
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={request.learnerAvatar || "/placeholder.svg"} />
              <AvatarFallback>{request.learnerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{request.learnerName}</p>
              <p className="text-xs text-muted-foreground">
                {format(request.sessionDate, "MMM d")} • {request.sessionTime}
              </p>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <Badge variant="outline" className="text-xs">
            {request.sessionType}
          </Badge>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span className="font-medium">${request.offeredPrice}</span>
            {request.isHighestBid && (
              <Badge className="ml-1 h-4 px-1 text-xs bg-[#0E6E55]">
                <TrendingUp className="h-2 w-2" />
              </Badge>
            )}
          </div>
        </TableCell>

        <TableCell>
          {request.status === "pending" ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Timer className="h-3 w-3" />
              <span
                className={isExpiringSoon ? "text-red-600 font-medium" : ""}
              >
                {timeUntilExpiry}
              </span>
            </div>
          ) : request.paymentStatus ? (
            <Badge
              className={`text-xs ${getPaymentStatusColor(
                request.paymentStatus
              )}`}
            >
              <CreditCard className="h-2 w-2 mr-1" />
              {request.paymentStatus}
            </Badge>
          ) : (
            <Badge
              variant={request.status === "accepted" ? "default" : "secondary"}
              className="text-xs"
            >
              {request.status}
            </Badge>
          )}
        </TableCell>

        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {request.status === "pending" && (
                <>
                  <DropdownMenuItem
                    onClick={() => actions.acceptRequest(request.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => actions.rejectRequest(request.id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </DropdownMenuItem>
                  <Separator />
                </>
              )}
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                View Message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Sheet
      open={isRequestsDrawerOpen}
      onOpenChange={() => dispatch({ type: "TOGGLE_REQUESTS_DRAWER" })}
    >
      <SheetContent side="right" className="w-full sm:w-[600px] lg:w-[800px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Booking Requests
            <Badge className="bg-[#0E6E55]">
              {pendingRequests.length} pending
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Payment Status Banner */}
          {acceptedRequests.some((req) => req.paymentStatus === "awaiting") && (
            <Alert>
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                {
                  acceptedRequests.filter(
                    (req) => req.paymentStatus === "awaiting"
                  ).length
                }{" "}
                payment(s) pending. Learners have 24 hours to complete payment.
              </AlertDescription>
            </Alert>
          )}

          {/* Bulk Actions */}
          {selectedRequests.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedRequests.length} selected
              </span>
              <Button
                size="sm"
                className="bg-[#0E6E55] hover:bg-[#0E6E55]/90"
                onClick={() => handleBulkAction("accept")}
              >
                <Check className="h-4 w-4 mr-1" />
                Accept All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("reject")}
              >
                <X className="h-4 w-4 mr-1" />
                Reject All
              </Button>
            </div>
          )}

          {/* Requests Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedRequests.length === pendingRequests.length &&
                        pendingRequests.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Learner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Bid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No booking requests yet
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <RequestRow key={request.id} request={request} />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-lg font-bold">{pendingRequests.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-lg font-bold">
                $
                {pendingRequests.reduce(
                  (sum, req) => sum + req.offeredPrice,
                  0
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Potential Earnings
              </p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-lg font-bold">
                {Math.round(
                  pendingRequests.reduce(
                    (sum, req) => sum + req.offeredPrice,
                    0
                  ) / Math.max(pendingRequests.length, 1)
                )}
              </p>
              <p className="text-xs text-muted-foreground">Avg Bid</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
