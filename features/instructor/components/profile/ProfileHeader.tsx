"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { InstructorProfile } from "@/types/instructorTypes";
import { useAuthStore } from "@/stores/auth.store";
import { 
  Camera, 
  Star, 
  Users, 
  BookOpen, 
  DollarSign, 
  Award,
  CheckCircle,
  Shield,
  Loader2,
  Upload,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { uploadApiService } from "@/features/course-creation/services/uploadService";
import { ContentType } from "@/features/course-creation/types";
import { useUpdateProfileImage } from "@/features/instructor/services/instructorService";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ProfileHeaderProps {
  profile: InstructorProfile;
  isEditMode: boolean;
  onUpdate: (updates: Partial<InstructorProfile>) => void;
}

export default function ProfileHeader({ profile, isEditMode, onUpdate }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuthStore();
  const { getToken } = useAuth();
  const [updateProfileImage] = useUpdateProfileImage();


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      toast.loading("Uploading profile image...", { id: "upload-image" });
      const authToken = await getToken({ template: "expiration" });
      
      // Step 1: Upload the file using uploadService
      const uploadResult = await uploadApiService.uploadFile(
        file,
        'image' as ContentType,
        {
          title: `Profile Image - ${user?.firstName} ${user?.lastName}`,
          description: "Profile image upload"
        },
        authToken || undefined
      );
      
      if (!uploadResult.url) {
        throw new Error("Upload failed - no URL returned");
      }

      // Step 2: Update the profile image using the separate mutation
      const updateResult = await updateProfileImage({
        variables: {
          input: {
            profileImage: uploadResult.url
          }
        }
      });

      if (updateResult.data?.updateProfileImage?.success) {
        // Update the local profile state
        if (profile.user) {
          onUpdate({ 
            user: {
              ...profile.user,
              profileImage: uploadResult.url
            }
          });
        }
        toast.success("Profile image updated successfully!", { id: "upload-image" });
      } else {
        // If the mutation failed, we should clean up the uploaded file
        try {
          await uploadApiService.deleteFile(uploadResult.url, authToken || undefined);
        } catch (cleanupError) {
          console.warn("Failed to clean up uploaded file:", cleanupError);
        }
        throw new Error("Failed to update profile image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.", { id: "upload-image" });
    } finally {
      setIsUploading(false);
    }
  };

  const getVerificationBadge = () => {
    if (profile.verificationLevel === "EXPERT") {
      return (
        <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 shadow-md">
          <Shield className="h-3 w-3 mr-1" />
          Expert Verified
        </Badge>
      );
    } else if (profile.isVerified) {
      return (
        <Badge variant="default" className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0 shadow-md">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified Instructor
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-gray-300 text-gray-600">
        Not Verified
      </Badge>
    );
  };

  const getStatusBadge = () => {
    if (profile.isAcceptingStudents) {
      return (
        <Badge variant="default" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-md animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
          Available for Students
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-700 border border-gray-300">
        Currently Unavailable
      </Badge>
    );
  };

  const getCompletionPercentage = () => {
    const fields = [
      profile.title, profile.bio, profile.shortBio, 
      profile.expertise?.length, profile.qualifications?.length,
      profile.subjectsTeaching?.length, profile.teachingCategories?.length,
      profile.teachingStyle, profile.targetAudience, profile.teachingMethodology,
      profile.personalWebsite, profile.linkedinProfile
    ];
    
    const filledFields = fields.filter(field => field && field !== "" && (Array.isArray(field) ? field.length > 0 : true)).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-0">
        {/* Cover Image with Gradient Overlay */}
        <div className="h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Profile Completion Badge */}
          <div className="absolute top-4 right-4">
            <Badge 
              variant="secondary" 
              className="bg-white/90 text-gray-800 border-0 shadow-sm"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {completionPercentage}% Complete
            </Badge>
          </div>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar Section */}
          <div className="flex items-end -mt-20 mb-6">
            <div className="relative">
              <Avatar className="h-36 w-36 border-4 border-white shadow-xl ring-4 ring-blue-100">
                <AvatarImage 
                  src={user?.profileImage || profile.user?.profileImage} 
                  alt={`${profile.user?.firstName} ${profile.user?.lastName}`}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {profile.user?.firstName?.[0]}{profile.user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              {isEditMode && (
                <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-all hover:scale-105 border border-gray-200">
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 text-gray-600" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>

            {/* Status Badges */}
            <div className="ml-auto flex flex-col items-end gap-2">
              {getVerificationBadge()}
              {getStatusBadge()}
            </div>
          </div>

          {/* Name and Title Section */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.user?.firstName} {profile.user?.lastName}
                </h2>
                
                {isEditMode ? (
                  <div className="space-y-3 max-w-2xl">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Professional Title
                      </Label>
                      <Input
                        id="title"
                        value={profile.title || ""}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        placeholder="e.g., Senior Software Engineer, Data Science Expert"
                        className="mt-1"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shortBio" className="text-sm font-medium text-gray-700">
                        Short Bio (for cards and previews)
                      </Label>
                      <Textarea
                        id="shortBio"
                        value={profile.shortBio || ""}
                        onChange={(e) => onUpdate({ shortBio: e.target.value })}
                        placeholder="Brief description that appears on instructor cards..."
                        className="mt-1 resize-none"
                        maxLength={150}
                        rows={2}
                      />
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">
                          This appears on your instructor card
                        </p>
                        <p className="text-xs text-gray-500">
                          {(profile.shortBio || "").length}/150
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {profile.title && (
                      <p className="text-xl text-gray-600 mb-3 font-medium">{profile.title}</p>
                    )}
                    {profile.shortBio && (
                      <p className="text-gray-600 max-w-2xl leading-relaxed">{profile.shortBio}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Completion Progress */}
            {isEditMode && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Profile Completion</span>
                  <span className="text-sm font-bold text-blue-900">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2 bg-blue-100" />
                <p className="text-xs text-blue-700 mt-2">
                  {completionPercentage < 100 
                    ? "Complete your profile to attract more students!"
                    : "Great! Your profile is complete and ready to attract students."
                  }
                </p>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-md transition-all cursor-pointer"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {profile.averageCourseRating?.toFixed(1) || "0.0"}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= (profile.averageCourseRating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all cursor-pointer"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {(profile.totalStudents || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
              <div className="text-xs text-green-600 font-medium mt-1">
                {profile.isAcceptingStudents ? "Accepting New" : "Not Accepting"}
              </div>
            </motion.div>

            <motion.div
              className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 hover:shadow-md transition-all cursor-pointer"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {profile.totalCourses || 0}
              </div>
              <div className="text-sm text-gray-600">Courses Created</div>
              <div className="text-xs text-purple-600 font-medium mt-1">
                {profile.totalLectures || 0} Lectures
              </div>
            </motion.div>

            <motion.div
              className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:shadow-md transition-all cursor-pointer"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                ${(profile.totalRevenue || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-blue-600 font-medium mt-1">
                {profile.revenueSharing || 70}% Your Share
              </div>
            </motion.div>
          </div>

          {/* Badges and Achievements */}
          {profile.badgesEarned && profile.badgesEarned.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {profile.badgesEarned.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800 hover:from-amber-100 hover:to-yellow-100 transition-all"
                  >
                    <Award className="h-3 w-3" />
                    {badge.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}