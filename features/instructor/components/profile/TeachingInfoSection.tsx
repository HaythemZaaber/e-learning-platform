"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InstructorProfile, LanguageProficiency } from "@/types/instructorTypes";
import { 
  BookOpen, 
  Languages, 
  Target, 
  Users, 
  Plus, 
  X, 
  Globe,
  GraduationCap,
  Loader2,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface TeachingInfoSectionProps {
  profile: InstructorProfile;
  isEditMode: boolean;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<InstructorProfile>) => void;
}

const TEACHING_CATEGORIES = [
  "Technology", "Business", "Health & Fitness", "Arts & Design", "Language",
  "Music", "Cooking", "Photography", "Writing", "Science", "Mathematics",
  "History", "Philosophy", "Psychology", "Finance", "Marketing",
  "Programming", "Data Science", "AI & Machine Learning", "Web Development",
  "Mobile Development", "Game Development", "Cybersecurity", "Cloud Computing",
  "DevOps", "Other"
];

const TARGET_AUDIENCES = [
  "Children (Ages 5-12)", "Teenagers (Ages 13-17)", "Young Adults (Ages 18-25)",
  "Working Professionals", "University Students", "Hobbyists", "Beginners",
  "Intermediate Learners", "Advanced Learners", "Corporate Teams",
  "Small Businesses", "Entrepreneurs", "Career Changers", "Retirees"
];

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", 
  "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Bengali", "Urdu", 
  "Turkish", "Dutch", "Swedish", "Norwegian", "Danish", "Finnish", "Polish",
  "Czech", "Hungarian", "Romanian", "Bulgarian", "Greek", "Hebrew", "Thai",
  "Vietnamese", "Indonesian", "Malay", "Filipino", "Swahili", "Other"
];

const PROFICIENCY_LEVELS = [
  { value: "basic", label: "Basic", color: "bg-gray-100 text-gray-800" },
  { value: "conversational", label: "Conversational", color: "bg-blue-100 text-blue-800" },
  { value: "fluent", label: "Fluent", color: "bg-green-100 text-green-800" },
  { value: "native", label: "Native", color: "bg-purple-100 text-purple-800" }
];

export default function TeachingInfoSection({ 
  profile, 
  isEditMode, 
  isPreviewMode, 
  onUpdate
}: TeachingInfoSectionProps) {
  const [newSubject, setNewSubject] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newLanguageProficiency, setNewLanguageProficiency] = useState("fluent");
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);

  const addSubject = async () => {
    if (!newSubject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    
    if (profile.subjectsTeaching?.includes(newSubject.trim())) {
      toast.error("This subject already exists");
      return;
    }

    setIsAddingSubject(true);
    
    try {
      const updatedSubjects = [...(profile.subjectsTeaching || []), newSubject.trim()];
      onUpdate({ subjectsTeaching: updatedSubjects });
      setNewSubject("");
      toast.success("Subject added successfully");
    } catch (error) {
      toast.error("Failed to add subject");
    } finally {
      setIsAddingSubject(false);
    }
  };

  const removeSubject = (index: number) => {
    const updatedSubjects = profile.subjectsTeaching?.filter((_, i) => i !== index) || [];
    onUpdate({ subjectsTeaching: updatedSubjects });
    toast.success("Subject removed");
  };

  const toggleCategory = (category: string) => {
    const currentCategories = profile.teachingCategories || [];
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    onUpdate({ teachingCategories: updatedCategories });
    
    if (currentCategories.includes(category)) {
      toast.success("Category removed");
    } else {
      toast.success("Category added");
    }
  };

  const addLanguage = async () => {
    if (!newLanguage.trim()) {
      toast.error("Please select a language");
      return;
    }
    
    const currentLanguages = Array.isArray(profile.languagesSpoken) ? profile.languagesSpoken : [];
    
    if (currentLanguages.find((l: LanguageProficiency) => l.language === newLanguage.trim())) {
      toast.error("This language already exists");
      return;
    }

    setIsAddingLanguage(true);
    
    try {
      const updatedLanguages = [
        ...currentLanguages, 
        { language: newLanguage.trim(), proficiency: newLanguageProficiency as any }
      ];
      onUpdate({ languagesSpoken: updatedLanguages });
      setNewLanguage("");
      setNewLanguageProficiency("fluent");
      toast.success("Language added successfully");
    } catch (error) {
      toast.error("Failed to add language");
    } finally {
      setIsAddingLanguage(false);
    }
  };

  const removeLanguage = (language: string) => {
    const currentLanguages = Array.isArray(profile.languagesSpoken) ? profile.languagesSpoken : [];
    const updatedLanguages = currentLanguages.filter((l: LanguageProficiency) => l.language !== language);
    onUpdate({ languagesSpoken: updatedLanguages });
    toast.success("Language removed");
  };

  const updateLanguageProficiency = (language: string, proficiency: string) => {
    const currentLanguages = Array.isArray(profile.languagesSpoken) ? profile.languagesSpoken : [];
    const updatedLanguages = currentLanguages.map((l: LanguageProficiency) => 
      l.language === language ? { ...l, proficiency: proficiency as any } : l
    );
    onUpdate({ languagesSpoken: updatedLanguages });
    toast.success("Language proficiency updated");
  };

  const getProficiencyColor = (proficiency: string) => {
    const level = PROFICIENCY_LEVELS.find(l => l.value === proficiency);
    return level?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Subjects Teaching */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Subjects I Teach
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g., JavaScript, React, Node.js, Data Analysis"
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    onClick={addSubject}
                    disabled={isAddingSubject || !newSubject.trim()}
                  >
                    {isAddingSubject ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <AnimatePresence>
                  <div className="flex flex-wrap gap-2">
                    {profile.subjectsTeaching?.map((subject, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge 
                          variant="secondary" 
                          className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                        >
                          {subject}
                          <button
                            onClick={() => removeSubject(index)}
                            className="ml-1 hover:text-red-600 transition-colors"
                            aria-label={`Remove ${subject}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.subjectsTeaching && profile.subjectsTeaching.length > 0 ? (
                  profile.subjectsTeaching.map((subject, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {subject}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No subjects listed yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Teaching Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              Teaching Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {TEACHING_CATEGORIES.map((category) => {
                    const isSelected = profile.teachingCategories?.includes(category);
                    return (
                      <Button
                        key={category}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCategory(category)}
                        className={`justify-start text-left h-auto py-2 transition-all ${
                          isSelected 
                            ? "bg-green-600 hover:bg-green-700 text-white shadow-md" 
                            : "hover:bg-green-50 hover:border-green-300"
                        }`}
                      >
                        {isSelected && <CheckCircle className="h-3 w-3 mr-1" />}
                        {category}
                      </Button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500">
                  Select the categories that best describe your teaching areas
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.teachingCategories && profile.teachingCategories.length > 0 ? (
                  profile.teachingCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {category}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No categories selected yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Languages Spoken */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-purple-600" />
              Languages I Speak
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Select value={newLanguage} onValueChange={setNewLanguage}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={newLanguageProficiency} onValueChange={setNewLanguageProficiency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="sm" 
                    onClick={addLanguage}
                    disabled={isAddingLanguage || !newLanguage}
                  >
                    {isAddingLanguage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <AnimatePresence>
                  <div className="space-y-2">
                    {Array.isArray(profile.languagesSpoken) && profile.languagesSpoken.map((lang: LanguageProficiency, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                      >
                        <span className="font-medium text-purple-900">{lang.language}</span>
                        <div className="flex items-center gap-2">
                          <Select 
                            value={lang.proficiency} 
                            onValueChange={(value) => updateLanguageProficiency(lang.language, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PROFICIENCY_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <button
                            onClick={() => removeLanguage(lang.language)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            aria-label={`Remove ${lang.language}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-2">
                {Array.isArray(profile.languagesSpoken) && profile.languagesSpoken.length > 0 ? (
                  profile.languagesSpoken.map((lang: LanguageProficiency, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                    >
                      <span className="font-medium text-purple-900">{lang.language}</span>
                      <Badge variant="secondary" className={`capitalize ${getProficiencyColor(lang.proficiency)}`}>
                        {lang.proficiency}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No languages listed yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Teaching Style & Target Audience */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Teaching Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <div className="space-y-4">
                  <Textarea
                    value={profile.teachingStyle || ""}
                    onChange={(e) => onUpdate({ teachingStyle: e.target.value })}
                    placeholder="Describe your teaching style and approach. Are you hands-on, theoretical, interactive, or structured? What makes your teaching unique?"
                    rows={4}
                    maxLength={500}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Help students understand your teaching approach
                    </p>
                    <p className="text-xs text-gray-500">
                      {(profile.teachingStyle || "").length}/500 characters
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {profile.teachingStyle ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {profile.teachingStyle}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">No teaching style described yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full border-l-4 border-l-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <div className="space-y-4">
                  <Select 
                    value={profile.targetAudience || ""} 
                    onValueChange={(value) => onUpdate({ targetAudience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_AUDIENCES.map((audience) => (
                        <SelectItem key={audience} value={audience}>
                          {audience}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Choose the audience that best matches your teaching focus
                  </p>
                </div>
              ) : (
                <div>
                  {profile.targetAudience ? (
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-sm px-3 py-1">
                      {profile.targetAudience}
                    </Badge>
                  ) : (
                    <p className="text-gray-500 italic">No target audience specified yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Teaching Methodology */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-600" />
              Teaching Methodology
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <div className="space-y-4">
                <Textarea
                  value={profile.teachingMethodology || ""}
                  onChange={(e) => onUpdate({ teachingMethodology: e.target.value })}
                  placeholder="Describe your teaching methodology, techniques, and strategies. Do you use project-based learning, lecture-style, peer learning, or a combination? What tools and techniques do you employ?"
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Explain your methodology to help students understand how you teach
                  </p>
                  <p className="text-xs text-gray-500">
                    {(profile.teachingMethodology || "").length}/500 characters
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {profile.teachingMethodology ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {profile.teachingMethodology}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">No teaching methodology described yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}