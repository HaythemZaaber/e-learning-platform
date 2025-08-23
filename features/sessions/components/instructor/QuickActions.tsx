"use client";

import { useState } from "react";
import { 
  Plus, 
  Calendar, 
  Clock, 
  Settings, 
  MessageSquare, 
  BarChart3, 
  DollarSign,
  Users,
  BookOpen,
  Zap,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

interface QuickActionsProps {
  user: any;
}

export function QuickActions({ user }: QuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAction = (action: string) => {
    toast.success(`${action} action triggered`);
    // Add actual navigation or action logic here
  };

  const primaryActions = [
    {
      label: "Create Session",
      icon: Plus,
      action: "create-session",
      description: "Schedule a new live session",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      label: "Set Availability",
      icon: Calendar,
      action: "set-availability",
      description: "Update your teaching schedule",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      label: "View Requests",
      icon: MessageSquare,
      action: "view-requests",
      description: "Check booking requests",
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  const secondaryActions = [
    {
      label: "Analytics",
      icon: BarChart3,
      action: "analytics",
      description: "View performance metrics"
    },
    {
      label: "Earnings",
      icon: DollarSign,
      action: "earnings",
      description: "Check your income"
    },
    {
      label: "Students",
      icon: Users,
      action: "students",
      description: "Manage student list"
    },
    {
      label: "Courses",
      icon: BookOpen,
      action: "courses",
      description: "View your courses"
    },
    {
      label: "Settings",
      icon: Settings,
      action: "settings",
      description: "Configure preferences"
    },
    {
      label: "AI Assistant",
      icon: Zap,
      action: "ai-assistant",
      description: "Get AI-powered help"
    }
  ];

  return (
    <div className="relative">
      {/* Compact View */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("create-session")}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          New Session
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleAction("set-availability")}>
              <Calendar className="mr-2 h-4 w-4" />
              Set Availability
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("view-requests")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              View Requests
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction("analytics")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("earnings")}>
              <DollarSign className="mr-2 h-4 w-4" />
              Earnings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction("settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Expanded View (for larger screens) */}
      <div className="hidden lg:block">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
            >
              Quick Actions
              {isExpanded ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Primary Actions */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 text-muted-foreground">
                      Primary Actions
                    </h4>
                    <div className="space-y-2">
                      {primaryActions.map((action) => (
                        <Button
                          key={action.action}
                          variant="outline"
                          className="w-full justify-start h-auto p-3"
                          onClick={() => handleAction(action.action)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${action.color} text-white`}>
                              <action.icon className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">{action.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {action.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-3 text-muted-foreground">
                      Quick Access
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {secondaryActions.map((action) => (
                        <Button
                          key={action.action}
                          variant="ghost"
                          size="sm"
                          className="justify-start h-auto p-2"
                          onClick={() => handleAction(action.action)}
                        >
                          <div className="flex items-center gap-2">
                            <action.icon className="h-4 w-4" />
                            <span className="text-sm">{action.label}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-3 text-muted-foreground">
                      Quick Stats
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">3</div>
                        <div className="text-xs text-blue-800">Pending Requests</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">$450</div>
                        <div className="text-xs text-green-800">This Week</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
