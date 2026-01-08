"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Mail,
  Calendar,
  User,
  Shield,
  GraduationCap,
  BookOpen,
  UserCheck,
  UserX,
  Activity,
  AlertCircle,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { showToast } from "@/utils/toast";
import { GET_ALL_USERS } from "@/graphql/queries/user";
import { User as UserType } from "@/types/userTypes";

// Stats Card Component
const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
}: {
  title: string;
  value: number | string;
  icon: any;
  color?: string;
  trend?: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {trend && <p className="text-sm text-emerald-600 mt-1">{trend}</p>}
          </div>
          <div
            className={`p-3 rounded-xl border ${
              colorClasses[color as keyof typeof colorClasses]
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// User Card Component
const UserCard = ({
  user,
  onEdit,
  onView,
  onAction,
}: {
  user: UserType;
  onEdit: (user: UserType) => void;
  onView: (user: UserType) => void;
  onAction: (user: UserType, action: string) => void;
}) => {
  const getRoleBadge = (role: string) => {
    const roleColors = {
      ADMIN: "bg-red-100 text-red-800 border-red-200",
      INSTRUCTOR: "bg-blue-100 text-blue-800 border-blue-200",
      STUDENT: "bg-green-100 text-green-800 border-green-200",
      PARENT: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return (
      roleColors[role as keyof typeof roleColors] ||
      "bg-slate-100 text-slate-800 border-slate-200"
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4 mr-1" />;
      case "INSTRUCTOR":
        return <GraduationCap className="w-4 h-4 mr-1" />;
      case "STUDENT":
        return <BookOpen className="w-4 h-4 mr-1" />;
      case "PARENT":
        return <Users className="w-4 h-4 mr-1" />;
      default:
        return <User className="w-4 h-4 mr-1" />;
    }
  };

  const getInitials = () => {
    return (
      `${user.firstName?.charAt(0) || ""}${
        user.lastName?.charAt(0) || ""
      }`.toUpperCase() || "U"
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={user.profileImage || ""}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-slate-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-slate-500 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {user.email}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(user)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onAction(user, "suspend")}
                className="text-amber-600"
              >
                <UserX className="w-4 h-4 mr-2" />
                Suspend User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction(user, "delete")}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 mb-4">
          <Badge className={`border ${getRoleBadge(user.role)}`}>
            {getRoleIcon(user.role)}
            {user.role}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Activity className="w-3 h-3 mr-1" />
            <span>ID: {user.id.substring(0, 8)}...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// User Detail Dialog
const UserDetailDialog = ({
  user,
  isOpen,
  onClose,
}: {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!user) return null;

  const getInitials = () => {
    return (
      `${user.firstName?.charAt(0) || ""}${
        user.lastName?.charAt(0) || ""
      }`.toUpperCase() || "U"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={user.profileImage || ""}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-slate-500">{user.email}</p>
              <Badge className="mt-2">{user.role}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-600">User ID</Label>
              <p className="text-slate-900 font-mono text-sm mt-1">{user.id}</p>
            </div>
            <div>
              <Label className="text-slate-600">Clerk ID</Label>
              <p className="text-slate-900 font-mono text-sm mt-1">
                {user.clerkId || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-slate-600">Created At</Label>
              <p className="text-slate-900 mt-1">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-slate-600">Last Updated</Label>
              <p className="text-slate-900 mt-1">
                {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-slate-600">Role</Label>
            <p className="text-slate-900 mt-1">{user.role}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [viewingUser, setViewingUser] = useState<UserType | null>(null);
  const [sortBy, setSortBy] = useState("createdAt");

  // Fetch users from GraphQL
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const users: UserType[] = data?.users || [];

  // Calculate stats
  const stats = useMemo(() => {
    const total = users.length;
    const students = users.filter((u) => u.role === "STUDENT").length;
    const instructors = users.filter((u) => u.role === "INSTRUCTOR").length;
    const parents = users.filter((u) => u.role === "PARENT").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;

    return {
      total,
      students,
      instructors,
      parents,
      admins,
    };
  }, [users]);

  // Filter users
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((u) => u.role === activeTab.toUpperCase());
    }

    // Sort users
    filtered.sort((a, b) => {
      if (sortBy === "createdAt") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "name") {
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      }
      return 0;
    });

    return filtered;
  }, [users, searchTerm, activeTab, sortBy]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      setLastUpdated(new Date());
      showToast("success", "Refreshed", "Users data has been updated");
    } catch (err) {
      showToast("error", "Error", "Failed to refresh users data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEdit = (user: UserType) => {
    showToast(
      "info",
      "Coming Soon",
      "User editing feature is under development"
    );
  };

  const handleView = (user: UserType) => {
    setViewingUser(user);
  };

  const handleAction = (user: UserType, action: string) => {
    if (action === "delete") {
      if (
        confirm(
          `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
        )
      ) {
        showToast(
          "info",
          "Coming Soon",
          "User deletion feature is under development"
        );
      }
    } else if (action === "suspend") {
      showToast(
        "info",
        "Coming Soon",
        "User suspension feature is under development"
      );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-medium text-slate-900">
            Failed to load users
          </h3>
          <p className="text-slate-600">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Users Management
              </h1>
              <p className="text-slate-600 mt-1">Manage all platform users</p>
              <p className="text-xs text-slate-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                variant="outline"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshing || loading ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing || loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.total}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Students"
            value={stats.students}
            icon={BookOpen}
            color="emerald"
          />
          <StatsCard
            title="Instructors"
            value={stats.instructors}
            icon={GraduationCap}
            color="purple"
          />
          <StatsCard
            title="Parents"
            value={stats.parents}
            icon={Users}
            color="amber"
          />
          <StatsCard
            title="Admins"
            value={stats.admins}
            icon={Shield}
            color="red"
          />
        </div>

        {/* Users List */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">All Users</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Sort by Date</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  All Users
                  <Badge variant="secondary" className="ml-2">
                    {stats.total}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="student"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  Students
                  <Badge variant="secondary" className="ml-2">
                    {stats.students}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="instructor"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  Instructors
                  <Badge variant="secondary" className="ml-2">
                    {stats.instructors}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="parent"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  Parents
                  <Badge variant="secondary" className="ml-2">
                    {stats.parents}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  Admins
                  <Badge variant="secondary" className="ml-2">
                    {stats.admins}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                {loading && !data ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-slate-600">
                      Loading users...
                    </span>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      No users found
                    </h3>
                    <p className="text-slate-600">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : `No users in ${activeTab} category`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onEdit={handleEdit}
                        onView={handleView}
                        onAction={handleAction}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!loading && (
          <div className="mt-6 text-center text-sm text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>

      {/* View User Dialog */}
      <UserDetailDialog
        user={viewingUser}
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
      />
    </div>
  );
}
