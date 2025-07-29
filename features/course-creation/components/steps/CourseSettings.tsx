"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  X,
  Globe,
  Lock,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Award,
  Eye,
  EyeOff,
  Shield,
  Download,
  MessageSquare,
  Star,
  Zap,
  Settings,
  Info,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Mail,
  Bell,
  BookOpen,
  Video,
  FileText,
  Headphones,
  Save,
  ArrowRight,
} from "lucide-react";
import { CourseData, ENROLLMENT_TYPES } from "../../types";
import { useCourseCreationStore } from "../../../../stores/courseCreation.store";
import { useNotifications } from "../../hooks/useNotifications";

interface CourseSettingsProps {
  data: CourseData;
  updateData: (data: Partial<CourseData>) => void;
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
];

export function CourseSettings({ data, updateData }: CourseSettingsProps) {
  const [activeSection, setActiveSection] = useState("general");
  const [newTag, setNewTag] = useState("");

  const notifications = useNotifications();
  const { addGlobalError, addGlobalWarning } = useCourseCreationStore();

  // Add index signatures to settings sub-objects for dynamic key access
  const settings = data.settings || {
    isPublic: true,
    enrollmentType: "free",
    language: "en",
    certificate: false,
    seoDescription: "",
    seoTags: [],
    accessibility: {
      captions: false,
      transcripts: false,
      audioDescription: false,
    },
    pricing: {
      amount: 0,
      currency: "USD",
      discountPercentage: 0,
      earlyBirdDiscount: false,
      installmentPlans: false,
    },
    enrollment: {
      maxStudents: undefined,
      enrollmentDeadline: "",
      prerequisitesCourse: "",
      ageRestriction: "none",
    },
    communication: {
      discussionForum: true,
      directMessaging: false,
      liveChat: false,
      announcementEmails: true,
    },
    completion: {
      passingGrade: 70,
      allowRetakes: true,
      timeLimit: undefined,
      certificateTemplate: "default",
    },
    content: {
      downloadableResources: true,
      offlineAccess: false,
      mobileOptimized: true,
      printableMaterials: false,
    },
    marketing: {
      featuredCourse: false,
      courseTags: [],
      difficultyRating: "beginner",
      estimatedDuration: "",
    },
  };

  const handleSettingsChange = useCallback(
    (section: string, key: string, value: any) => {
      const sectionObj = (settings as any)[section] || {};
      const newSettings = {
        ...settings,
        [section]: {
          ...sectionObj,
          [key]: value,
        },
      };
      updateData({ settings: newSettings });
    },
    [settings, updateData]
  );

  const handleDirectSettingsChange = useCallback(
    (key: string, value: any) => {
      const newSettings = { ...settings, [key]: value };
      updateData({ settings: newSettings });
    },
    [settings, updateData]
  );

  const handleAddTag = useCallback(() => {
    if (newTag && !settings.seoTags.includes(newTag)) {
      const newTags = [...settings.seoTags, newTag];
      handleDirectSettingsChange("seoTags", newTags);
      setNewTag("");
      notifications.success("Tag added successfully");
    } else if (settings.seoTags.includes(newTag)) {
      notifications.warning("Tag already exists");
    }
  }, [newTag, settings.seoTags, handleDirectSettingsChange, notifications]);

  const handleRemoveTag = useCallback(
    (tag: string) => {
      const newTags = settings.seoTags.filter((t: string) => t !== tag);
      handleDirectSettingsChange("seoTags", newTags);
      notifications.success("Tag removed");
    },
    [settings.seoTags, handleDirectSettingsChange, notifications]
  );

  const validatePricing = useCallback(() => {
    if (
      settings.enrollmentType === "paid" &&
      (!data.price || data.price <= 0)
    ) {
      addGlobalError("Paid courses must have a price greater than 0");
      return false;
    }
    if (settings.enrollmentType === "free" && data.price > 0) {
      addGlobalWarning("Free courses should have a price of 0");
    }
    return true;
  }, [settings.enrollmentType, data.price, addGlobalError, addGlobalWarning]);

  const sections = [
    { id: "general", title: "General Settings", icon: Settings },
    { id: "pricing", title: "Pricing & Billing", icon: DollarSign },
    { id: "enrollment", title: "Enrollment", icon: Users },
    { id: "communication", title: "Communication", icon: MessageSquare },
    { id: "completion", title: "Completion & Certificates", icon: Award },
    { id: "content", title: "Content Access", icon: BookOpen },
    { id: "seo", title: "SEO & Marketing", icon: Zap },
    { id: "accessibility", title: "Accessibility", icon: Eye },
  ];

  const getCompletionScore = useCallback(() => {
    let score = 0;
    let maxScore = 0;

    // General settings (30 points)
    maxScore += 30;
    if (settings.isPublic !== undefined) score += 10;
    if (settings.language) score += 10;
    if (settings.enrollmentType) score += 10;

    // Pricing (20 points)
    maxScore += 20;
    if (
      settings.enrollmentType === "free" ||
      (settings.enrollmentType === "paid" && data.price > 0)
    ) {
      score += 20;
    }

    // SEO (25 points)
    maxScore += 25;
    if (settings.seoDescription && settings.seoDescription.length > 0)
      score += 15;
    if (settings.seoTags && settings.seoTags.length > 0) score += 10;

    // Accessibility (15 points)
    maxScore += 15;
    if (settings.accessibility?.captions || settings.accessibility?.transcripts)
      score += 15;

    // Communication (10 points)
    maxScore += 10;
    if (settings.communication?.discussionForum !== undefined) score += 10;

    return Math.round((score / maxScore) * 100);
  }, [settings, data.price]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Course Settings & Publishing
        </h2>
        <p className="text-gray-600">
          Configure your course settings and prepare for launch
        </p>

        {/* Completion Progress */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Settings Completion</span>
            <span>{getCompletionScore()}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
              style={{ width: `${getCompletionScore()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              Settings Sections
            </h4>
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-left">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200">
            {/* General Settings */}
            {activeSection === "general" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="h-6 w-6 text-blue-500" />
                  <h3 className="text-xl font-semibold">General Settings</h3>
                </div>

                <div className="space-y-8">
                  {/* Course Visibility */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Course Visibility
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() =>
                          handleDirectSettingsChange("isPublic", true)
                        }
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          settings.isPublic
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-blue-500" />
                          <div>
                            <h6 className="font-semibold">Public</h6>
                            <p className="text-sm text-gray-600">
                              Anyone can find and enroll in your course
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={() =>
                          handleDirectSettingsChange("isPublic", false)
                        }
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          !settings.isPublic
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Lock className="h-5 w-5 text-gray-500" />
                          <div>
                            <h6 className="font-semibold">Private</h6>
                            <p className="text-sm text-gray-600">
                              Only you can see and manage this course
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enrollment Type */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Enrollment Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {ENROLLMENT_TYPES.map((type) => (
                        <div
                          key={type}
                          onClick={() =>
                            handleDirectSettingsChange("enrollmentType", type)
                          }
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                            settings.enrollmentType === type
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="mb-2">
                            {type === "free" && (
                              <Users className="h-6 w-6 mx-auto text-green-500" />
                            )}
                            {type === "paid" && (
                              <CreditCard className="h-6 w-6 mx-auto text-green-500" />
                            )}
                            {type === "subscription" && (
                              <Calendar className="h-6 w-6 mx-auto text-green-500" />
                            )}
                          </div>
                          <h6 className="font-semibold capitalize">{type}</h6>
                          <p className="text-sm text-gray-600">
                            {type === "free" && "No payment required"}
                            {type === "paid" && "One-time payment"}
                            {type === "subscription" && "Recurring billing"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course Language */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-900">
                      Course Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        handleDirectSettingsChange("language", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Certificate */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div>
                        <h6 className="font-medium">Course Certificate</h6>
                        <p className="text-sm text-gray-600">
                          Issue certificates upon course completion
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.certificate}
                        onChange={(e) =>
                          handleDirectSettingsChange(
                            "certificate",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Settings */}
            {activeSection === "pricing" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="h-6 w-6 text-green-500" />
                  <h3 className="text-xl font-semibold">Pricing & Billing</h3>
                </div>

                <div className="space-y-8">
                  {/* Pricing Details */}
                  {settings.enrollmentType !== "free" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900">
                          Price
                        </label>
                        <div className="flex">
                          <select
                            value={settings.pricing?.currency || "USD"}
                            onChange={(e) =>
                              handleSettingsChange(
                                "pricing",
                                "currency",
                                e.target.value
                              )
                            }
                            className="px-3 py-3 border border-gray-300 rounded-l-lg border-r-0 bg-gray-50"
                          >
                            {currencies.map((curr) => (
                              <option key={curr.code} value={curr.code}>
                                {curr.symbol}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="0"
                            value={data.price || 0}
                            onChange={(e) =>
                              updateData({ price: parseFloat(e.target.value) })
                            }
                            className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900">
                          Original Price (Optional)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            {
                              currencies.find(
                                (c) =>
                                  c.code ===
                                  (settings.pricing?.currency || "USD")
                              )?.symbol
                            }
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={data.originalPrice || ""}
                            onChange={(e) =>
                              updateData({
                                originalPrice:
                                  parseFloat(e.target.value) || undefined,
                              })
                            }
                            className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="0.00"
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          Show original price with discount
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Free Course Message */}
                  {settings.enrollmentType === "free" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <Users className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-green-800 mb-2">
                        Free Course
                      </h4>
                      <p className="text-green-700">
                        Your course will be available to all students at no
                        cost. You can always change this to paid later.
                      </p>
                    </div>
                  )}

                  {/* Additional Pricing Options */}
                  {settings.enrollmentType !== "free" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h6 className="font-medium">Early Bird Discount</h6>
                          <p className="text-sm text-gray-600">
                            Offer discounts for early enrollments
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              settings.pricing?.earlyBirdDiscount || false
                            }
                            onChange={(e) =>
                              handleSettingsChange(
                                "pricing",
                                "earlyBirdDiscount",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h6 className="font-medium">Installment Plans</h6>
                          <p className="text-sm text-gray-600">
                            Allow students to pay in installments
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              settings.pricing?.installmentPlans || false
                            }
                            onChange={(e) =>
                              handleSettingsChange(
                                "pricing",
                                "installmentPlans",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SEO & Marketing */}
            {activeSection === "seo" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold">SEO & Marketing</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-900">
                      SEO Description
                    </label>
                    <textarea
                      value={settings.seoDescription || ""}
                      onChange={(e) =>
                        handleDirectSettingsChange(
                          "seoDescription",
                          e.target.value
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-[100px] resize-vertical"
                      placeholder="Write a compelling description of your course for search engines and course catalogs..."
                      maxLength={300}
                    />
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">
                        Recommended: 150-160 characters for optimal SEO
                      </p>
                      <span className="text-gray-400">
                        {settings.seoDescription?.length || 0}/300
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-900">
                      Course Tags
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Add relevant tags (e.g., JavaScript, Web Development)"
                        maxLength={30}
                      />
                      <button
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {settings.seoTags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-blue-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900">
                        Estimated Duration
                      </label>
                      <input
                        type="text"
                        value={settings.marketing?.estimatedDuration || ""}
                        onChange={(e) =>
                          handleSettingsChange(
                            "marketing",
                            "estimatedDuration",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="e.g., 4 weeks, 20 hours"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <h6 className="font-medium text-gray-900">
                          Featured Course
                        </h6>
                        <p className="text-sm text-gray-600">
                          Highlight this course in featured sections
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.marketing?.featuredCourse || false}
                        onChange={(e) =>
                          handleSettingsChange(
                            "marketing",
                            "featuredCourse",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Accessibility Settings */}
            {activeSection === "accessibility" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="h-6 w-6 text-indigo-500" />
                  <h3 className="text-xl font-semibold">
                    Accessibility Features
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "captions",
                      title: "Video Captions",
                      desc: "Provide closed captions for all video content",
                      icon: Video,
                    },
                    {
                      key: "transcripts",
                      title: "Audio Transcripts",
                      desc: "Include text transcripts for audio content",
                      icon: FileText,
                    },
                    {
                      key: "audioDescription",
                      title: "Audio Description",
                      desc: "Descriptive narration for visual content",
                      icon: Headphones,
                    },
                  ].map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-indigo-500" />
                          <div>
                            <h6 className="font-medium">{feature.title}</h6>
                            <p className="text-sm text-gray-600">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              settings.accessibility?.[feature.key] || false
                            }
                            onChange={(e) =>
                              handleSettingsChange(
                                "accessibility",
                                feature.key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h6 className="font-medium text-blue-900">
                        Accessibility Guidelines
                      </h6>
                      <p className="text-sm text-blue-700 mt-1">
                        Following accessibility best practices helps ensure your
                        course is inclusive and reaches a wider audience.
                        Consider providing multiple formats for content
                        consumption.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enrollment Settings */}
            {activeSection === "enrollment" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-6 w-6 text-purple-500" />
                  <h3 className="text-xl font-semibold">Enrollment Settings</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900">
                        Maximum Students
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.enrollment?.maxStudents || ""}
                        onChange={(e) =>
                          handleSettingsChange(
                            "enrollment",
                            "maxStudents",
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Unlimited"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900">
                        Enrollment Deadline
                      </label>
                      <input
                        type="date"
                        value={settings.enrollment?.enrollmentDeadline || ""}
                        onChange={(e) =>
                          handleSettingsChange(
                            "enrollment",
                            "enrollmentDeadline",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-900">
                      Age Restriction
                    </label>
                    <select
                      value={settings.enrollment?.ageRestriction || "none"}
                      onChange={(e) =>
                        handleSettingsChange(
                          "enrollment",
                          "ageRestriction",
                          e.target.value
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="none">No Age Restriction</option>
                      <option value="13+">13+ Years Old</option>
                      <option value="16+">16+ Years Old</option>
                      <option value="18+">18+ Years Old</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Communication Settings */}
            {activeSection === "communication" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                  <h3 className="text-xl font-semibold">
                    Communication Features
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "discussionForum",
                      title: "Discussion Forum",
                      desc: "Enable course discussion forum",
                      icon: MessageSquare,
                    },
                    {
                      key: "directMessaging",
                      title: "Direct Messaging",
                      desc: "Allow students to message instructors",
                      icon: Mail,
                    },
                    {
                      key: "liveChat",
                      title: "Live Chat",
                      desc: "Real-time chat during lessons",
                      icon: MessageSquare,
                    },
                    {
                      key: "announcementEmails",
                      title: "Announcement Emails",
                      desc: "Send email notifications for announcements",
                      icon: Bell,
                    },
                  ].map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-blue-500" />
                          <div>
                            <h6 className="font-medium">{feature.title}</h6>
                            <p className="text-sm text-gray-600">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              settings.communication?.[feature.key] || false
                            }
                            onChange={(e) =>
                              handleSettingsChange(
                                "communication",
                                feature.key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completion Settings */}
            {activeSection === "completion" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-6 w-6 text-amber-500" />
                  <h3 className="text-xl font-semibold">
                    Completion & Certificates
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900">
                        Passing Grade (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.completion?.passingGrade || 70}
                        onChange={(e) =>
                          handleSettingsChange(
                            "completion",
                            "passingGrade",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900">
                        Time Limit (hours)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.completion?.timeLimit || ""}
                        onChange={(e) =>
                          handleSettingsChange(
                            "completion",
                            "timeLimit",
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="No time limit"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-900">
                      Certificate Template
                    </label>
                    <select
                      value={
                        settings.completion?.certificateTemplate || "default"
                      }
                      onChange={(e) =>
                        handleSettingsChange(
                          "completion",
                          "certificateTemplate",
                          e.target.value
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="default">Default Template</option>
                      <option value="modern">Modern Template</option>
                      <option value="classic">Classic Template</option>
                      <option value="minimal">Minimal Template</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h6 className="font-medium">Allow Retakes</h6>
                      <p className="text-sm text-gray-600">
                        Let students retake failed assessments
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.completion?.allowRetakes !== false}
                        onChange={(e) =>
                          handleSettingsChange(
                            "completion",
                            "allowRetakes",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Content Access */}
            {activeSection === "content" && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-6 w-6 text-green-500" />
                  <h3 className="text-xl font-semibold">Content Access</h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "downloadableResources",
                      title: "Downloadable Resources",
                      desc: "Allow students to download course materials",
                      icon: Download,
                    },
                    {
                      key: "offlineAccess",
                      title: "Offline Access",
                      desc: "Enable offline viewing of content",
                      icon: EyeOff,
                    },
                    {
                      key: "mobileOptimized",
                      title: "Mobile Optimized",
                      desc: "Optimize content for mobile devices",
                      icon: Settings,
                    },
                    {
                      key: "printableMaterials",
                      title: "Printable Materials",
                      desc: "Provide printer-friendly versions",
                      icon: FileText,
                    },
                  ].map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-green-500" />
                          <div>
                            <h6 className="font-medium">{feature.title}</h6>
                            <p className="text-sm text-gray-600">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.content?.[feature.key] !== false}
                            onChange={(e) =>
                              handleSettingsChange(
                                "content",
                                feature.key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Settings Complete!
            </h3>
            <p className="text-gray-600">
              Your course is configured and ready for the next step.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {getCompletionScore()}%
              </div>
              <div className="text-sm text-gray-500">Configured</div>
            </div>
            <button
              onClick={validatePricing}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Validate Settings
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
