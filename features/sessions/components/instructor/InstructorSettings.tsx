"use client";

import { useState } from "react";
import { 
  Settings, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar, 
  Bell, 
  Shield, 
  Globe,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

import { 
  useUpdateInstructorProfile, 
} from "@/features/sessions/hooks/useLiveSessions";
import { InstructorProfile, SessionType, SessionFormat, CancellationPolicy } from "@/features/sessions/types/session.types";

interface InstructorSettingsProps {
  user: any;
  instructorProfile?: InstructorProfile;
}

export function InstructorSettings({ user, instructorProfile }: InstructorSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const updateProfile = useUpdateInstructorProfile();


  // Form state
  const [formData, setFormData] = useState({
    // General Settings
    liveSessionsEnabled: instructorProfile?.liveSessionsEnabled || false,
    defaultSessionDuration: instructorProfile?.defaultSessionDuration || 60,
    defaultSessionType: instructorProfile?.defaultSessionType || "INDIVIDUAL",
    preferredGroupSize: instructorProfile?.preferredGroupSize || 5,
    bufferBetweenSessions: instructorProfile?.bufferBetweenSessions || 15,
    maxSessionsPerDay: instructorProfile?.maxSessionsPerDay || 8,
    minAdvanceBooking: instructorProfile?.minAdvanceBooking || 12,
    autoAcceptBookings: instructorProfile?.autoAcceptBookings || false,
    instantMeetingEnabled: instructorProfile?.instantMeetingEnabled || false,

    // Pricing
    individualSessionRate: instructorProfile?.individualSessionRate || 50,
    groupSessionRate: instructorProfile?.groupSessionRate || 30,
    currency: instructorProfile?.currency || "USD",
    platformFeeRate: instructorProfile?.platformFeeRate || 20,

    // Policies
    defaultCancellationPolicy: instructorProfile?.defaultCancellationPolicy || "MODERATE",
    defaultSessionFormat: instructorProfile?.defaultSessionFormat || "ONLINE",

    // Professional Info
    title: instructorProfile?.title || "",
    bio: instructorProfile?.bio || "",
    shortBio: instructorProfile?.shortBio || "",
    expertise: instructorProfile?.expertise || [],
    qualifications: instructorProfile?.qualifications || [],
    experience: instructorProfile?.experience || 0,
    personalWebsite: instructorProfile?.personalWebsite || "",
    linkedinProfile: instructorProfile?.linkedinProfile || "",

    // Teaching Info
    subjectsTeaching: instructorProfile?.subjectsTeaching || [],
    teachingCategories: instructorProfile?.teachingCategories || [],
    teachingStyle: instructorProfile?.teachingStyle || "",
    targetAudience: instructorProfile?.targetAudience || "",
    teachingMethodology: instructorProfile?.teachingMethodology || "",

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    sessionReminders: true,
    paymentNotifications: true,
    reviewNotifications: true,

    // Privacy
    profileVisibility: "public",
    showEarnings: false,
    showContactInfo: true,
    allowDirectMessages: true,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile.mutateAsync({
        userId: instructorProfile?.userId || "",
        updates: formData as Partial<InstructorProfile>,
      });
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to original values
    setFormData({
      liveSessionsEnabled: instructorProfile?.liveSessionsEnabled || false,
      defaultSessionDuration: instructorProfile?.defaultSessionDuration || 60,
      defaultSessionType: instructorProfile?.defaultSessionType || "INDIVIDUAL",
      preferredGroupSize: instructorProfile?.preferredGroupSize || 5,
      bufferBetweenSessions: instructorProfile?.bufferBetweenSessions || 15,
      maxSessionsPerDay: instructorProfile?.maxSessionsPerDay || 8,
      minAdvanceBooking: instructorProfile?.minAdvanceBooking || 12,
      autoAcceptBookings: instructorProfile?.autoAcceptBookings || false,
      instantMeetingEnabled: instructorProfile?.instantMeetingEnabled || false,
      individualSessionRate: instructorProfile?.individualSessionRate || 50,
      groupSessionRate: instructorProfile?.groupSessionRate || 30,
      currency: instructorProfile?.currency || "USD",
      platformFeeRate: instructorProfile?.platformFeeRate || 20,
      defaultCancellationPolicy: instructorProfile?.defaultCancellationPolicy || "MODERATE",
      defaultSessionFormat: instructorProfile?.defaultSessionFormat || "ONLINE",
      title: instructorProfile?.title || "",
      bio: instructorProfile?.bio || "",
      shortBio: instructorProfile?.shortBio || "",
      expertise: instructorProfile?.expertise || [],
      qualifications: instructorProfile?.qualifications || [],
      experience: instructorProfile?.experience || 0,
      personalWebsite: instructorProfile?.personalWebsite || "",
      linkedinProfile: instructorProfile?.linkedinProfile || "",
      subjectsTeaching: instructorProfile?.subjectsTeaching || [],
      teachingCategories: instructorProfile?.teachingCategories || [],
      teachingStyle: instructorProfile?.teachingStyle || "",
      targetAudience: instructorProfile?.targetAudience || "",
      teachingMethodology: instructorProfile?.teachingMethodology || "",
      emailNotifications: true,
      pushNotifications: true,
      bookingReminders: true,
      sessionReminders: true,
      paymentNotifications: true,
      reviewNotifications: true,
      profileVisibility: "public",
      showEarnings: false,
      showContactInfo: true,
      allowDirectMessages: true,
    });
    toast.success("Settings reset to original values");
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "availability", label: "Availability", icon: Clock },
    { id: "profile", label: "Profile", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">
            Configure your live sessions preferences and profile
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Live Sessions Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Live Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Enable Live Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow students to book live sessions with you
                    </p>
                  </div>
                  <Switch
                    checked={formData.liveSessionsEnabled}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, liveSessionsEnabled: checked })
                    }
                  />
                </div>

                {formData.liveSessionsEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="defaultDuration">Default Session Duration (minutes)</Label>
                      <Input
                        id="defaultDuration"
                        type="number"
                        value={formData.defaultSessionDuration}
                        onChange={(e) => 
                          setFormData({ ...formData, defaultSessionDuration: parseInt(e.target.value) })
                        }
                        min="15"
                        max="480"
                      />
                    </div>
                    <div>
                      <Label htmlFor="defaultType">Default Session Type</Label>
                      <Select
                        value={formData.defaultSessionType}
                        onValueChange={(value: SessionType) => 
                          setFormData({ ...formData, defaultSessionType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                          <SelectItem value="SMALL_GROUP">Small Group</SelectItem>
                          <SelectItem value="LARGE_GROUP">Large Group</SelectItem>
                          <SelectItem value="WORKSHOP">Workshop</SelectItem>
                          <SelectItem value="MASTERCLASS">Masterclass</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Session Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxSessions">Max Sessions Per Day</Label>
                    <Input
                      id="maxSessions"
                      type="number"
                      value={formData.maxSessionsPerDay}
                      onChange={(e) => 
                        setFormData({ ...formData, maxSessionsPerDay: parseInt(e.target.value) })
                      }
                      min="1"
                      max="24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bufferTime">Buffer Between Sessions (minutes)</Label>
                    <Input
                      id="bufferTime"
                      type="number"
                      value={formData.bufferBetweenSessions}
                      onChange={(e) => 
                        setFormData({ ...formData, bufferBetweenSessions: parseInt(e.target.value) })
                      }
                      min="0"
                      max="120"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minAdvance">Minimum Advance Booking (hours)</Label>
                    <Input
                      id="minAdvance"
                      type="number"
                      value={formData.minAdvanceBooking}
                      onChange={(e) => 
                        setFormData({ ...formData, minAdvanceBooking: parseInt(e.target.value) })
                      }
                      min="1"
                      max="168"
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupSize">Preferred Group Size</Label>
                    <Input
                      id="groupSize"
                      type="number"
                      value={formData.preferredGroupSize}
                      onChange={(e) => 
                        setFormData({ ...formData, preferredGroupSize: parseInt(e.target.value) })
                      }
                      min="2"
                      max="50"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Auto-Accept Bookings</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically accept booking requests
                      </p>
                    </div>
                    <Switch
                      checked={formData.autoAcceptBookings}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, autoAcceptBookings: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Instant Meeting</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow students to join sessions immediately
                      </p>
                    </div>
                    <Switch
                      checked={formData.instantMeetingEnabled}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, instantMeetingEnabled: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="individualRate">Individual Session Rate ($)</Label>
                    <Input
                      id="individualRate"
                      type="number"
                      value={formData.individualSessionRate}
                      onChange={(e) => 
                        setFormData({ ...formData, individualSessionRate: parseFloat(e.target.value) })
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupRate">Group Session Rate ($)</Label>
                    <Input
                      id="groupRate"
                      type="number"
                      value={formData.groupSessionRate}
                      onChange={(e) => 
                        setFormData({ ...formData, groupSessionRate: parseFloat(e.target.value) })
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => 
                        setFormData({ ...formData, currency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="platformFee">Platform Fee Rate (%)</Label>
                    <Input
                      id="platformFee"
                      type="number"
                      value={formData.platformFeeRate}
                      onChange={(e) => 
                        setFormData({ ...formData, platformFeeRate: parseFloat(e.target.value) })
                      }
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                    <Select
                      value={formData.defaultCancellationPolicy}
                      onValueChange={(value: CancellationPolicy) => 
                        setFormData({ ...formData, defaultCancellationPolicy: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FLEXIBLE">Flexible</SelectItem>
                        <SelectItem value="MODERATE">Moderate</SelectItem>
                        <SelectItem value="STRICT">Strict</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sessionFormat">Default Session Format</Label>
                    <Select
                      value={formData.defaultSessionFormat}
                      onValueChange={(value: SessionFormat) => 
                        setFormData({ ...formData, defaultSessionFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ONLINE">Online</SelectItem>
                        <SelectItem value="OFFLINE">Offline</SelectItem>
                        <SelectItem value="HYBRID">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => 
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => 
                        setFormData({ ...formData, experience: parseInt(e.target.value) })
                      }
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="shortBio">Short Bio</Label>
                  <Input
                    id="shortBio"
                    value={formData.shortBio}
                    onChange={(e) => 
                      setFormData({ ...formData, shortBio: e.target.value })
                    }
                    placeholder="Brief introduction (max 150 characters)"
                    maxLength={150}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Full Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => 
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Tell students about your background, expertise, and teaching approach"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Personal Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.personalWebsite}
                      onChange={(e) => 
                        setFormData({ ...formData, personalWebsite: e.target.value })
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={formData.linkedinProfile}
                      onChange={(e) => 
                        setFormData({ ...formData, linkedinProfile: e.target.value })
                      }
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teaching Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="teachingStyle">Teaching Style</Label>
                  <Textarea
                    id="teachingStyle"
                    value={formData.teachingStyle}
                    onChange={(e) => 
                      setFormData({ ...formData, teachingStyle: e.target.value })
                    }
                    placeholder="Describe your teaching approach and methodology"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => 
                      setFormData({ ...formData, targetAudience: e.target.value })
                    }
                    placeholder="e.g., Beginners, Intermediate developers, Students"
                  />
                </div>
                <div>
                  <Label htmlFor="methodology">Teaching Methodology</Label>
                  <Textarea
                    id="methodology"
                    value={formData.teachingMethodology}
                    onChange={(e) => 
                      setFormData({ ...formData, teachingMethodology: e.target.value })
                    }
                    placeholder="Explain your teaching methods and techniques"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "notifications" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, emailNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={formData.pushNotifications}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, pushNotifications: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Booking Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new booking requests
                    </p>
                  </div>
                  <Switch
                    checked={formData.bookingReminders}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, bookingReminders: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Session Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Reminders before upcoming sessions
                    </p>
                  </div>
                  <Switch
                    checked={formData.sessionReminders}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, sessionReminders: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Payment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about payments and earnings
                    </p>
                  </div>
                  <Switch
                    checked={formData.paymentNotifications}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, paymentNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Review Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when students leave reviews
                    </p>
                  </div>
                  <Switch
                    checked={formData.reviewNotifications}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, reviewNotifications: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "privacy" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select
                  value={formData.profileVisibility}
                  onValueChange={(value) => 
                    setFormData({ ...formData, profileVisibility: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can view</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="private">Private - Invitation Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Show Earnings</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your earnings on your profile
                    </p>
                  </div>
                  <Switch
                    checked={formData.showEarnings}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, showEarnings: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Show Contact Information</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your contact details to students
                    </p>
                  </div>
                  <Switch
                    checked={formData.showContactInfo}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, showContactInfo: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Allow Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Let students send you direct messages
                    </p>
                  </div>
                  <Switch
                    checked={formData.allowDirectMessages}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, allowDirectMessages: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
