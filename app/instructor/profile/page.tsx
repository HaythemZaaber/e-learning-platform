"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { InstructorProfile } from "@/types/instructorTypes";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2, Save, Edit3, Eye, EyeOff, AlertCircle, CheckCircle2, User, BookOpen, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

import ProfileHeader from "@/features/instructor/components/profile/ProfileHeader";
import BasicInfoSection from "@/features/instructor/components/profile/BasicInfoSection";
import TeachingInfoSection from "@/features/instructor/components/profile/TeachingInfoSection";
import AvailabilitySection from "@/features/instructor/components/profile/AvailabilitySection";
import FinancialSection from "@/features/instructor/components/profile/FinancialSection";
import StatisticsSection from "@/features/instructor/components/profile/StatisticsSection";

// Import GraphQL hooks
import { 
  useGetMyInstructorProfile, 
  useGetMyInstructorStats,
  useUpdateInstructorProfile 
} from "@/features/instructor/services/instructorService";

// Import store
import { 
  useInstructorProfileStore,
  useInstructorProfile,
  useInstructorStats,
  useInstructorLoading,
  useInstructorSaving,
  useInstructorEditMode,
  useInstructorPreviewMode,
  useInstructorError
} from "@/stores/instructorProfile.store";

export default function InstructorProfilePage() {
  const { user } = useAuthStore();
  const [localProfile, setLocalProfile] = useState<InstructorProfile | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Store state
  const {
    setProfile,
    setStats,
    setLoading,
    setSaving,
    setEditMode,
    setPreviewMode,
    setError,
    clearError,
    updateProfile
  } = useInstructorProfileStore();
  
  const profile = useInstructorProfile();
  const stats = useInstructorStats();
  const isLoading = useInstructorLoading();
  const isSaving = useInstructorSaving();
  const isEditMode = useInstructorEditMode();
  const isPreviewMode = useInstructorPreviewMode();
  const error = useInstructorError();

  // GraphQL hooks
  const { 
    data: profileData, 
    loading: profileLoading, 
    error: profileError,
    refetch: refetchProfile
  } = useGetMyInstructorProfile();
  
  const { 
    data: statsData, 
    loading: statsLoading, 
    error: statsError 
  } = useGetMyInstructorStats();
  
  const [updateProfileMutation, { loading: updateLoading }] = useUpdateInstructorProfile();

  // Handle loading states
  useEffect(() => {
    setLoading(profileLoading || statsLoading);
  }, [profileLoading, statsLoading, setLoading]);

  // Handle data updates
  useEffect(() => {
    if (profileData?.getMyInstructorProfile) {
      const fetchedProfile = profileData.getMyInstructorProfile;
      setProfile(fetchedProfile);
      setLocalProfile(fetchedProfile);
      clearError();
    }
  }, [profileData, setProfile, clearError]);

  useEffect(() => {
    if (statsData?.getMyInstructorStats) {
      setStats(statsData.getMyInstructorStats);
    }
  }, [statsData, setStats]);

  // Handle errors
  useEffect(() => {
    if (profileError) {
      const errorMessage = profileError.message || "Failed to load profile data";
      setError(errorMessage);
      toast.error("Profile Error", {
        description: errorMessage,
      });
    }
  }, [profileError, setError]);

  useEffect(() => {
    if (statsError) {
      toast.error("Statistics Error", {
        description: "Failed to load statistics",
      });
    }
  }, [statsError]);

  // Handle profile updates
  const handleProfileUpdate = (updates: Partial<InstructorProfile>) => {
    if (!localProfile) return;
    
    // Handle nested user object updates properly
    let updatedProfile = { ...localProfile };
    
    if (updates.user && localProfile.user) {
      updatedProfile = {
        ...updatedProfile,
        user: {
          ...localProfile.user,
          ...updates.user
        }
      };
    }
    
    // Handle other updates
    const { user, ...otherUpdates } = updates;
    updatedProfile = { ...updatedProfile, ...otherUpdates };
    
    setLocalProfile(updatedProfile);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!localProfile || !profile) return;

    try {
      setSaving(true);
      clearError();
      
      // Create input object with only the fields that can be updated
      const input: any = {};
      
      // Compare local profile with original profile and include only changed fields
      const fieldsToCheck = [
        'title', 'bio', 'shortBio', 'expertise', 'qualifications', 'experience',
        'personalWebsite', 'linkedinProfile', 'subjectsTeaching', 'teachingCategories',
        'languagesSpoken', 'teachingStyle', 'targetAudience', 'teachingMethodology',
        'isAcceptingStudents', 'maxStudentsPerCourse', 'preferredSchedule',
        'availableTimeSlots', 'revenueSharing', 'payoutSettings', 'taxInformation',
        'paymentPreferences', 'socialLinks'
      ];

      fieldsToCheck.forEach(field => {
        const localValue = localProfile[field as keyof InstructorProfile];
        const originalValue = profile[field as keyof InstructorProfile];
        
        // Deep comparison for objects and arrays
        if (JSON.stringify(localValue) !== JSON.stringify(originalValue)) {
          input[field] = localValue;
        }
      });

      // Only proceed if there are actual updates
      if (Object.keys(input).length === 0) {
        toast.info("No Changes", {
          description: "No changes detected to save.",
        });
        return;
      }



      const { data } = await updateProfileMutation({
        variables: { input }
      });

      if (data?.updateInstructorProfile) {
        const updatedProfile = data.updateInstructorProfile;
        setProfile(updatedProfile);
        setLocalProfile(updatedProfile);
        setHasUnsavedChanges(false);
        setEditMode(false);
        
        toast.success("Profile Updated", {
          description: "Your profile has been updated successfully!",
        });

        // Refetch to ensure we have the latest data
        await refetchProfile();
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      const errorMessage = error.message || "Failed to save profile. Please try again.";
      setError(errorMessage);
      toast.error("Save Error", {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEditMode = () => {
    if (isEditMode && hasUnsavedChanges) {
      // Show confirmation dialog
      if (window.confirm("You have unsaved changes. Do you want to discard them?")) {
        setLocalProfile(profile);
        setHasUnsavedChanges(false);
        setEditMode(false);
      }
    } else {
      setEditMode(!isEditMode);
      if (!isEditMode) {
        setPreviewMode(false);
      }
    }
  };

  const handleTogglePreviewMode = () => {
    setPreviewMode(!isPreviewMode);
  };

  const handleDiscardChanges = () => {
    if (profile) {
      setLocalProfile(profile);
      setHasUnsavedChanges(false);
      setEditMode(false);
      toast.info("Changes Discarded", {
        description: "All unsaved changes have been discarded.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!localProfile) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Profile Not Found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We couldn't load your instructor profile. Please try refreshing the page or contact support if the problem persists.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => refetchProfile()}>
              Refresh Data
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your professional information and teaching preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePreviewMode}
            className="flex items-center gap-2"
          >
            {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {isPreviewMode ? "Hide Preview" : "Preview"}
          </Button>
          
          <Button
            variant={isEditMode ? "secondary" : "outline"}
            size="sm"
            onClick={handleToggleEditMode}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            {isEditMode ? "Cancel Edit" : "Edit Profile"}
          </Button>
          
          {isEditMode && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDiscardChanges}
                disabled={!hasUnsavedChanges}
              >
                Discard Changes
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || updateLoading || !hasUnsavedChanges}
                className="flex items-center gap-2"
              >
                {isSaving || updateLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving || updateLoading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. Don't forget to save your progress!
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ProfileHeader 
          profile={localProfile} 
          isEditMode={isEditMode}
          onUpdate={handleProfileUpdate}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-gray-200 bg-white rounded-lg shadow-sm sticky top-0 z-10"
          >
            <TabsList className="grid w-full grid-cols-5 h-16 bg-transparent border-0 p-0">
              <TabsTrigger 
                value="basic" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-sm rounded-none h-full px-6 font-medium transition-all duration-200 hover:bg-gray-50"
              >
                <div className="flex flex-col items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Basic Info</span>
                  <div className="w-1 h-1 rounded-full bg-current opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="teaching" 
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:shadow-sm rounded-none h-full px-6 font-medium transition-all duration-200 hover:bg-gray-50"
              >
                <div className="flex flex-col items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Teaching</span>
                  <div className="w-1 h-1 rounded-full bg-current opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="availability" 
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:shadow-sm rounded-none h-full px-6 font-medium transition-all duration-200 hover:bg-gray-50"
              >
                <div className="flex flex-col items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Availability</span>
                  <div className="w-1 h-1 rounded-full bg-current opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="financial" 
                className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-sm rounded-none h-full px-6 font-medium transition-all duration-200 hover:bg-gray-50"
              >
                <div className="flex flex-col items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Financial</span>
                  <div className="w-1 h-1 rounded-full bg-current opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="statistics" 
                className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:shadow-sm rounded-none h-full px-6 font-medium transition-all duration-200 hover:bg-gray-50"
              >
                <div className="flex flex-col items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm">Statistics</span>
                  <div className="w-1 h-1 rounded-full bg-current opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
                </div>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>
            <BasicInfoSection
              profile={localProfile}
              isEditMode={isEditMode}
              isPreviewMode={isPreviewMode}
              onUpdate={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="teaching" className="space-y-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-900">Teaching Information</h2>
            </div>
            <TeachingInfoSection
              profile={localProfile}
              isEditMode={isEditMode}
              isPreviewMode={isPreviewMode}
              onUpdate={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="availability" className="space-y-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-900">Availability & Schedule</h2>
            </div>
            <AvailabilitySection
              profile={localProfile}
              isEditMode={isEditMode}
              isPreviewMode={isPreviewMode}
              onUpdate={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-900">Financial Settings</h2>
            </div>
            <FinancialSection
              profile={localProfile}
              isEditMode={isEditMode}
              isPreviewMode={isPreviewMode}
              onUpdate={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-teal-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-900">Performance Statistics</h2>
            </div>
            <StatisticsSection
              profile={localProfile}
              isPreviewMode={isPreviewMode}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}