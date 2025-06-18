"use client";

// features/dashboard/components/DashboardSidebar.tsx

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { SidebarProps, useNavigation } from "../";

export function DashboardSidebar({
  userRole = "teacher",
  className,
  isOpen = true,
}: SidebarProps) {
  const pathname = usePathname();
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const { navigation, roleInfo } = useNavigation(userRole);

  return (
    <div
      className={cn(
        "w-64 bg-background border-r flex flex-col h-full transition-all duration-300",
        !isOpen && "w-0 opacity-0",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-16 items-center border-b px-4",
          !isOpen && "hidden"
        )}
      >
        <Link
          href={`/${userRole}/dashboard/overview`}
          className="flex items-center gap-3 font-semibold group"
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-white transition-all group-hover:scale-105",
              roleInfo.color
            )}
          >
            <roleInfo.icon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">{roleInfo.title}</span>
            <span className="text-xs text-muted-foreground">
              {roleInfo.subtitle}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Content */}
      <div className={cn("flex-1 overflow-y-auto py-4", !isOpen && "hidden")}>
        {/* Main Navigation */}
        <div className="px-3 mb-6">
          <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </h3>
          <nav className="space-y-1">
            {navigation.main.map((item) => {
              const isActive = pathname.includes(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent group",
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-white"
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className="text-xs px-1.5 py-0.5 h-5"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Access */}
        {navigation.quick.length > 0 && (
          <div className="px-3 mb-6">
            <Collapsible
              open={isQuickAccessOpen}
              onOpenChange={setIsQuickAccessOpen}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                <span>Quick Access</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    isQuickAccessOpen && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2">
                {navigation.quick.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent group",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Tools & Features */}
        {navigation.tools.length > 0 && (
          <div className="px-3 mb-6">
            <Collapsible open={isToolsOpen} onOpenChange={setIsToolsOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                <span>Tools & Features</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    isToolsOpen && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2">
                {navigation.tools.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent group",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0.5 h-5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 text-sm mb-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-white",
              roleInfo.color
            )}
          >
            <roleInfo.icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="font-medium capitalize">{userRole} Pro</p>
            <p className="text-xs text-muted-foreground">
              Premium features enabled
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8"
          >
            <Settings className="mr-2 h-3 w-3" />
            Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8"
          >
            <HelpCircle className="mr-2 h-3 w-3" />
            Help & Support
          </Button>
        </div>
      </div>
    </div>
  );
}
