"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
  User,
  Award,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { showToast } from "@/utils/toast";
import { testimonials as initialTestimonials } from "@/features/mainPage/data/testimonialsData";
import { Testimonial } from "@/features/mainPage/types/testimonialsTypes";

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

// Testimonial Card Component
const TestimonialCard = ({
  testimonial,
  onEdit,
  onDelete,
  onView,
}: {
  testimonial: Testimonial;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: number) => void;
  onView: (testimonial: Testimonial) => void;
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-200 text-yellow-400"
            : "text-slate-300"
        }`}
      />
    ));
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {testimonial.fallback}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-slate-900">
                {testimonial.name}
              </h3>
              <p className="text-sm text-slate-500">
                {testimonial.date || "No date"}
              </p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onView(testimonial)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(testimonial)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(testimonial.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center space-x-1 mb-2">
            {renderStars(testimonial.rating)}
            <span className="text-sm font-medium text-slate-700 ml-2">
              {testimonial.rating}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">{testimonial.course}</p>
        </div>

        <p className="text-slate-700 line-clamp-3 mb-3">{testimonial.review}</p>

        {testimonial.featured && (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

// Edit/Create Dialog Component
const TestimonialDialog = ({
  testimonial,
  isOpen,
  onClose,
  onSave,
}: {
  testimonial: Testimonial | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (testimonial: Testimonial) => void;
}) => {
  const [formData, setFormData] = useState<Testimonial>(
    testimonial || {
      id: Date.now(),
      name: "",
      avatar: "",
      fallback: "",
      review: "",
      course: "",
      rating: 5,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      featured: false,
    }
  );

  const handleSubmit = () => {
    if (!formData.name || !formData.review || !formData.course) {
      showToast(
        "error",
        "Validation Error",
        "Please fill in all required fields"
      );
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
          <DialogDescription>
            Fill in the testimonial details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Student name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fallback">Initials *</Label>
              <Input
                id="fallback"
                value={formData.fallback}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fallback: e.target.value.toUpperCase(),
                  })
                }
                placeholder="AB"
                maxLength={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course/Subject *</Label>
            <Input
              id="course"
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
              placeholder="e.g., Mathematics for Middle School"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Review *</Label>
            <Textarea
              id="review"
              value={formData.review}
              onChange={(e) =>
                setFormData({ ...formData, review: e.target.value })
              }
              placeholder="Write the testimonial..."
              rows={5}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5) *</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                placeholder="April 15, 2025"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
              placeholder="/avatars/student.jpg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Mark as Featured (will appear on homepage)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {testimonial ? "Save Changes" : "Add Testimonial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingTestimonial, setViewingTestimonial] =
    useState<Testimonial | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    const total = testimonials.length;
    const featured = testimonials.filter((t) => t.featured).length;
    const avgRating =
      testimonials.reduce((acc, t) => acc + t.rating, 0) / total;
    const fiveStars = testimonials.filter((t) => t.rating === 5).length;

    return {
      total,
      featured,
      avgRating: avgRating.toFixed(1),
      fiveStars,
    };
  }, [testimonials]);

  // Filter testimonials
  const filteredTestimonials = useMemo(() => {
    let filtered = [...testimonials];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tab
    if (activeTab === "featured") {
      filtered = filtered.filter((t) => t.featured);
    } else if (activeTab === "high-rated") {
      filtered = filtered.filter((t) => t.rating >= 4.5);
    }

    return filtered;
  }, [testimonials, searchTerm, activeTab]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
      showToast("success", "Refreshed", "Testimonials data has been updated");
    }, 1000);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
      showToast("success", "Deleted", "Testimonial has been removed");
    }
  };

  const handleView = (testimonial: Testimonial) => {
    setViewingTestimonial(testimonial);
  };

  const handleSave = (testimonial: Testimonial) => {
    if (editingTestimonial) {
      // Update existing
      setTestimonials(
        testimonials.map((t) => (t.id === testimonial.id ? testimonial : t))
      );
      showToast("success", "Updated", "Testimonial has been updated");
    } else {
      // Add new
      setTestimonials([testimonial, ...testimonials]);
      showToast("success", "Added", "New testimonial has been added");
    }
    setIsDialogOpen(false);
    setEditingTestimonial(null);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Testimonials Management
              </h1>
              <p className="text-slate-600 mt-1">
                Manage student reviews and testimonials
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Testimonials"
            value={stats.total}
            icon={MessageSquare}
            color="blue"
          />
          <StatsCard
            title="Featured"
            value={stats.featured}
            icon={Star}
            color="amber"
          />
          <StatsCard
            title="Average Rating"
            value={stats.avgRating}
            icon={TrendingUp}
            color="emerald"
          />
          <StatsCard
            title="5-Star Reviews"
            value={stats.fiveStars}
            icon={Award}
            color="purple"
          />
        </div>

        {/* Testimonials List */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">All Testimonials</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search testimonials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
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
                  All Testimonials
                  <Badge variant="secondary" className="ml-2">
                    {testimonials.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  Featured
                  <Badge variant="secondary" className="ml-2">
                    {stats.featured}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="high-rated"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  High Rated (4.5+)
                  <Badge variant="secondary" className="ml-2">
                    {testimonials.filter((t) => t.rating >= 4.5).length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                {filteredTestimonials.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      No testimonials found
                    </h3>
                    <p className="text-slate-600">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Get started by adding your first testimonial"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTestimonials.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Showing {filteredTestimonials.length} of {testimonials.length}{" "}
          testimonials
        </div>
      </div>

      {/* Edit/Create Dialog */}
      <TestimonialDialog
        testimonial={editingTestimonial}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTestimonial(null);
        }}
        onSave={handleSave}
      />

      {/* View Dialog */}
      <Dialog
        open={!!viewingTestimonial}
        onOpenChange={() => setViewingTestimonial(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Testimonial Details</DialogTitle>
          </DialogHeader>
          {viewingTestimonial && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={viewingTestimonial.avatar}
                    alt={viewingTestimonial.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                    {viewingTestimonial.fallback}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {viewingTestimonial.name}
                  </h3>
                  <p className="text-slate-500">{viewingTestimonial.date}</p>
                </div>
              </div>

              <div>
                <Label>Course/Subject</Label>
                <p className="text-slate-700 mt-1">
                  {viewingTestimonial.course}
                </p>
              </div>

              <div>
                <Label>Rating</Label>
                <div className="flex items-center space-x-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(viewingTestimonial.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-medium">
                    {viewingTestimonial.rating}
                  </span>
                </div>
              </div>

              <div>
                <Label>Review</Label>
                <p className="text-slate-700 mt-2 leading-relaxed">
                  {viewingTestimonial.review}
                </p>
              </div>

              {viewingTestimonial.featured && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  <Star className="w-3 h-3 mr-1" />
                  Featured on Homepage
                </Badge>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
