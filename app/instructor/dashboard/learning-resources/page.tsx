"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  Users,
  TrendingUp,
  Award,
  Download,
  ExternalLink,
  Play,
  FileText,
  Video,
  Headphones,
  SlidersHorizontal,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Mock data for demonstration
const mockResources = [
  {
    id: "1",
    title: "React Best Practices Guide",
    description:
      "Comprehensive guide covering React best practices, patterns, and performance optimization techniques.",
    type: "PDF",
    category: "Web Development",
    author: "React Team",
    rating: 4.9,
    downloads: 15420,
    size: "2.3 MB",
    duration: "45 min read",
    tags: ["React", "JavaScript", "Best Practices"],
    isFree: true,
    isFeatured: true,
    isNew: false,
    url: "/resources/react-best-practices.pdf",
    thumbnail: "/images/resource-1.jpg",
  },
  {
    id: "2",
    title: "Machine Learning Fundamentals Video Series",
    description:
      "Complete video series covering ML concepts from basics to advanced implementations.",
    type: "Video",
    category: "Data Science",
    author: "Dr. Sarah Chen",
    rating: 4.8,
    downloads: 8920,
    size: "1.2 GB",
    duration: "8 hours",
    tags: ["Machine Learning", "Python", "AI"],
    isFree: false,
    isFeatured: true,
    isNew: true,
    url: "/resources/ml-fundamentals-series",
    thumbnail: "/images/resource-2.jpg",
  },
  {
    id: "3",
    title: "Node.js Architecture Patterns",
    description:
      "Deep dive into Node.js architecture patterns for building scalable applications.",
    type: "Article",
    category: "Backend Development",
    author: "Alex Rodriguez",
    rating: 4.7,
    downloads: 6540,
    size: "850 KB",
    duration: "25 min read",
    tags: ["Node.js", "Architecture", "Backend"],
    isFree: true,
    isFeatured: false,
    isNew: false,
    url: "/resources/nodejs-architecture",
    thumbnail: "/images/resource-3.jpg",
  },
  {
    id: "4",
    title: "TypeScript Advanced Types",
    description:
      "Master TypeScript's advanced type system with practical examples and use cases.",
    type: "Interactive",
    category: "Web Development",
    author: "Emma Wilson",
    rating: 4.6,
    downloads: 4320,
    size: "1.5 MB",
    duration: "2 hours",
    tags: ["TypeScript", "Types", "Advanced"],
    isFree: false,
    isFeatured: false,
    isNew: true,
    url: "/resources/typescript-advanced",
    thumbnail: "/images/resource-4.jpg",
  },
  {
    id: "5",
    title: "Data Science with Python Podcast",
    description:
      "Weekly podcast covering data science topics, interviews with experts, and industry insights.",
    type: "Audio",
    category: "Data Science",
    author: "Data Science Weekly",
    rating: 4.8,
    downloads: 5670,
    size: "45 MB",
    duration: "1 hour",
    tags: ["Data Science", "Python", "Podcast"],
    isFree: true,
    isFeatured: false,
    isNew: false,
    url: "/resources/data-science-podcast",
    thumbnail: "/images/resource-5.jpg",
  },
  {
    id: "6",
    title: "AWS Cloud Architecture Blueprint",
    description:
      "Comprehensive blueprint for designing and implementing cloud architectures on AWS.",
    type: "Template",
    category: "Cloud Computing",
    author: "James Thompson",
    rating: 4.5,
    downloads: 3210,
    size: "3.2 MB",
    duration: "1.5 hours",
    tags: ["AWS", "Cloud", "Architecture"],
    isFree: false,
    isFeatured: false,
    isNew: false,
    url: "/resources/aws-architecture-blueprint",
    thumbnail: "/images/resource-6.jpg",
  },
];

const categories = [
  "All Categories",
  "Web Development",
  "Data Science",
  "Backend Development",
  "Cloud Computing",
  "Mobile Development",
  "Design",
  "Business",
];

const resourceTypes = [
  "All Types",
  "PDF",
  "Video",
  "Article",
  "Interactive",
  "Audio",
  "Template",
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "PDF":
    case "Article":
      return FileText;
    case "Video":
      return Video;
    case "Audio":
      return Headphones;
    case "Interactive":
      return Play;
    case "Template":
      return Award;
    default:
      return BookOpen;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "PDF":
    case "Article":
      return "text-red-600 bg-red-100";
    case "Video":
      return "text-blue-600 bg-blue-100";
    case "Audio":
      return "text-purple-600 bg-purple-100";
    case "Interactive":
      return "text-green-600 bg-green-100";
    case "Template":
      return "text-orange-600 bg-orange-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export default function InstructorLearningResourcesPage() {
  const router = useRouter();

  // UI State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [savedResources, setSavedResources] = useState<string[]>([]);

  // Filter resources based on search and filters
  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      searchTerm === "" ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All Categories" ||
      resource.category === selectedCategory;

    const matchesType =
      selectedType === "All Types" || resource.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort resources
  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.downloads - a.downloads;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.isNew ? 1 : -1;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleViewResource = (resourceId: string) => {
    const resource = mockResources.find((r) => r.id === resourceId);
    if (resource) {
      router.push(resource.url);
    }
  };

  const handleDownloadResource = (resourceId: string) => {
    const resource = mockResources.find((r) => r.id === resourceId);
    if (resource) {
      // TODO: Implement actual download
      console.log("Downloading resource:", resource.title);
    }
  };

  const handleToggleSave = (resourceId: string) => {
    setSavedResources((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleShareResource = (resource: any) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: `${window.location.origin}${resource.url}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}${resource.url}`);
      // TODO: Show toast notification
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Learning Resources
              </h1>
              <p className="text-gray-600 mt-1">
                Access educational materials, guides, and tools to enhance your
                learning
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search resources, topics, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Price
                  </label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Free Only
                    </Button>
                    <Button variant="outline" size="sm">
                      Paid Only
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Duration
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Under 30 min</SelectItem>
                      <SelectItem value="medium">30 min - 2 hours</SelectItem>
                      <SelectItem value="long">Over 2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Features
                  </label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Award className="w-4 h-4 mr-1" />
                      Featured
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4 mr-1" />
                      Saved
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              Showing {filteredResources.length} of {mockResources.length}{" "}
              resources
            </p>
            {searchTerm && (
              <Badge variant="outline">Search: "{searchTerm}"</Badge>
            )}
            {selectedCategory !== "All Categories" && (
              <Badge variant="outline">Category: {selectedCategory}</Badge>
            )}
            {selectedType !== "All Types" && (
              <Badge variant="outline">Type: {selectedType}</Badge>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <BookOpen className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Learning Resources Found
              </h3>
              <p className="text-gray-600 mb-4">
                No learning resources match your current search criteria. Try
                adjusting your filters or search terms.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Categories");
                  setSelectedType("All Types");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Resources Grid/List */}
        {filteredResources.length > 0 && (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            )}
          >
            <AnimatePresence>
              {sortedResources.map((resource, index) => {
                const TypeIcon = getTypeIcon(resource.type);
                const isSaved = savedResources.includes(resource.id);

                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center",
                              getTypeColor(resource.type)
                            )}
                          >
                            <TypeIcon className="w-6 h-6" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">
                                    {resource.title}
                                  </h3>
                                  {resource.isFeatured && (
                                    <Badge variant="secondary">Featured</Badge>
                                  )}
                                  {resource.isNew && (
                                    <Badge variant="outline">New</Badge>
                                  )}
                                  {resource.isFree && (
                                    <Badge
                                      variant="outline"
                                      className="text-green-600"
                                    >
                                      Free
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  by {resource.author}
                                </p>
                                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                                  {resource.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleToggleSave(resource.id)}
                                >
                                  <Bookmark
                                    className={cn(
                                      "w-4 h-4",
                                      isSaved
                                        ? "fill-current text-blue-600"
                                        : ""
                                    )}
                                  />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleShareResource(resource)}
                                >
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-3">
                              {resource.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {resource.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{resource.tags.length - 3} more
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  {resource.rating}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="w-4 h-4" />
                                  {resource.downloads.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {resource.duration}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {resource.size}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                              <Button
                                size="sm"
                                onClick={() => handleViewResource(resource.id)}
                                className="flex-1"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleDownloadResource(resource.id)
                                }
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
