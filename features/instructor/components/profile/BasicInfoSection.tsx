"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InstructorProfile } from "@/types/instructorTypes";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Linkedin, 
  Mail, 
  Phone,
  Plus,
  X,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BasicInfoSectionProps {
  profile: InstructorProfile;
  isEditMode: boolean;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<InstructorProfile>) => void;
}

export default function BasicInfoSection({ 
  profile, 
  isEditMode, 
  isPreviewMode, 
  onUpdate
}: BasicInfoSectionProps) {
  const [newExpertise, setNewExpertise] = useState("");
  const [newQualification, setNewQualification] = useState("");
  const [isAddingExpertise, setIsAddingExpertise] = useState(false);
  const [isAddingQualification, setIsAddingQualification] = useState(false);

  const handleBioChange = (value: string) => {
    onUpdate({ bio: value });
  };

  const handleExperienceChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onUpdate({ experience: numValue });
  };

  const addExpertise = async () => {
    if (!newExpertise.trim()) {
      toast.error("Please enter expertise area");
      return;
    }
    
    if (profile.expertise?.includes(newExpertise.trim())) {
      toast.error("This expertise already exists");
      return;
    }

    setIsAddingExpertise(true);
    
    try {
      const updatedExpertise = [...(profile.expertise || []), newExpertise.trim()];
      onUpdate({ expertise: updatedExpertise });
      setNewExpertise("");
      toast.success("Expertise added successfully");
    } catch (error) {
      toast.error("Failed to add expertise");
    } finally {
      setIsAddingExpertise(false);
    }
  };

  const removeExpertise = (index: number) => {
    const updatedExpertise = profile.expertise?.filter((_, i) => i !== index) || [];
    onUpdate({ expertise: updatedExpertise });
    toast.success("Expertise removed");
  };

  const addQualification = async () => {
    if (!newQualification.trim()) {
      toast.error("Please enter qualification");
      return;
    }
    
    if (profile.qualifications?.includes(newQualification.trim())) {
      toast.error("This qualification already exists");
      return;
    }

    setIsAddingQualification(true);
    
    try {
      const updatedQualifications = [...(profile.qualifications || []), newQualification.trim()];
      onUpdate({ qualifications: updatedQualifications });
      setNewQualification("");
      toast.success("Qualification added successfully");
    } catch (error) {
      toast.error("Failed to add qualification");
    } finally {
      setIsAddingQualification(false);
    }
  };

  const removeQualification = (index: number) => {
    const updatedQualifications = profile.qualifications?.filter((_, i) => i !== index) || [];
    onUpdate({ qualifications: updatedQualifications });
    toast.success("Qualification removed");
  };

  const updateSocialLink = (key: string, value: string) => {
    const updatedSocialLinks = { 
      ...profile.socialLinks, 
      [key]: value 
    };
    onUpdate({ socialLinks: updatedSocialLinks });
  };

  const updatePersonalWebsite = (value: string) => {
    onUpdate({ personalWebsite: value });
  };

  const updateLinkedinProfile = (value: string) => {
    onUpdate({ linkedinProfile: value });
  };

  return (
    <div className="space-y-6">
      {/* Bio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Professional Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ""}
                    onChange={(e) => handleBioChange(e.target.value)}
                    placeholder="Tell students about your background, teaching philosophy, and what makes you unique as an instructor..."
                    rows={6}
                    maxLength={1000}
                    className="mt-1 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Make it engaging and highlight your unique value proposition
                    </p>
                    <p className="text-xs text-gray-500">
                      {(profile.bio || "").length}/1000 characters
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {profile.bio ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    No bio added yet. Add a compelling bio to attract more students!
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Experience & Expertise */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Experience & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditMode ? (
                <>
                  <div>
                    <Label htmlFor="experience" className="text-sm font-medium">
                      Years of Experience
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      value={profile.experience || 0}
                      onChange={(e) => handleExperienceChange(e.target.value)}
                      placeholder="5"
                      min="0"
                      max="50"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Areas of Expertise</Label>
                    <div className="space-y-3 mt-2">
                      <div className="flex gap-2">
                        <Input
                          value={newExpertise}
                          onChange={(e) => setNewExpertise(e.target.value)}
                          placeholder="e.g., JavaScript, React, Machine Learning"
                          onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          onClick={addExpertise}
                          disabled={isAddingExpertise || !newExpertise.trim()}
                        >
                          {isAddingExpertise ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <AnimatePresence>
                        <div className="flex flex-wrap gap-2">
                          {profile.expertise?.map((exp, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge 
                                variant="secondary" 
                                className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                              >
                                {exp}
                                <button
                                  onClick={() => removeExpertise(index)}
                                  className="ml-1 hover:text-red-600 transition-colors"
                                  aria-label={`Remove ${exp}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </AnimatePresence>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      {profile.experience || 0}
                    </span>
                    <span className="text-gray-600">
                      {profile.experience === 1 ? 'year' : 'years'} of experience
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600 block mb-2">
                      Areas of Expertise:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {profile.expertise && profile.expertise.length > 0 ? (
                        profile.expertise.map((exp, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {exp}
                            </Badge>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No expertise areas listed yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Qualifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                Qualifications & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newQualification}
                      onChange={(e) => setNewQualification(e.target.value)}
                      placeholder="e.g., Master's in Computer Science, AWS Certified"
                      onKeyPress={(e) => e.key === 'Enter' && addQualification()}
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      onClick={addQualification}
                      disabled={isAddingQualification || !newQualification.trim()}
                    >
                      {isAddingQualification ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    <div className="space-y-2">
                      {profile.qualifications?.map((qual, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                        >
                          <span className="text-sm font-medium text-purple-900">{qual}</span>
                          <button
                            onClick={() => removeQualification(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            aria-label={`Remove ${qual}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.qualifications && profile.qualifications.length > 0 ? (
                    profile.qualifications.map((qual, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                      >
                        <span className="text-sm font-medium text-purple-900">{qual}</span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No qualifications listed yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Contact & Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-600" />
              Contact & Social Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {isEditMode ? (
                <>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.socialLinks?.email || ""}
                      onChange={(e) => updateSocialLink('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.socialLinks?.phone || ""}
                      onChange={(e) => updateSocialLink('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website" className="text-sm font-medium">
                      Personal Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={profile.personalWebsite || ""}
                      onChange={(e) => updatePersonalWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="linkedin" className="text-sm font-medium">
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={profile.linkedinProfile || ""}
                      onChange={(e) => updateLinkedinProfile(e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="mt-1"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-gray-600 block">Email</span>
                        <span className="text-sm text-gray-900">
                          {profile.socialLinks?.email || "Not provided"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-gray-600 block">Phone</span>
                        <span className="text-sm text-gray-900">
                          {profile.socialLinks?.phone || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-gray-600 block">Website</span>
                        {profile.personalWebsite ? (
                          <a 
                            href={profile.personalWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            Visit Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-900">Not provided</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Linkedin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-gray-600 block">LinkedIn</span>
                        {profile.linkedinProfile ? (
                          <a 
                            href={profile.linkedinProfile} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            View Profile
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-900">Not provided</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}