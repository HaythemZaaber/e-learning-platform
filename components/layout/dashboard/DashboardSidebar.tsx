"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Users,
  Wallet,
  Video,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: Users,
    },
    {
      name: "Courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      name: "Live Sessions",
      href: "/sessions",
      icon: Video,
    },
    {
      name: "Content Studio",
      href: "/content",
      icon: FileText,
    },
    {
      name: "Students",
      href: "/students",
      icon: Users,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Finances",
      href: "/finances",
      icon: Wallet,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageSquare,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              EA
            </div>
            <span>EduAI</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.name}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <span>Quick Access</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/calendar">
                          <Calendar className="h-4 w-4" />
                          <span>Calendar</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/tasks">
                          <FileText className="h-4 w-4" />
                          <span>Tasks</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Pro Plan</p>
              <p className="text-xs text-muted-foreground">12 days remaining</p>
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
