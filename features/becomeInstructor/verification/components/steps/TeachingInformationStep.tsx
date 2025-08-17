"use client";

import React, { useState } from 'react';
import { useInstructorApplicationStore } from '@/stores/verification.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  BookOpen, 
  Users, 
  Target, 
  Clock, 
  Plus, 
  Trash2, 
  Star,
  Brain,
  Lightbulb,
  Calendar
} from 'lucide-react';

export function TeachingInformationStep() {
  const store = useInstructorApplicationStore();

  const handleBasicInfoChange = (field: keyof typeof store.teachingInformation, value: any) => {
    store.updateTeachingInfo({ [field]: value });
  };

  const addSubjectToTeach = () => {
    store.addSubjectToTeach({
      subject: '',
      category: '',
      level: 'beginner',
      experienceYears: 0,
      confidence: 3,
    });
  };

  const updateSubjectToTeach = (index: number, field: string, value: any) => {
    const updatedSubjects = [...(store.teachingInformation.subjectsToTeach || [])];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value,
    };
    
    store.updateTeachingInfo({
      subjectsToTeach: updatedSubjects,
    });
  };

  const removeSubjectToTeach = (index: number) => {
    store.removeSubjectToTeach(index);
  };

  const addTeachingExperience = () => {
    store.addTeachingExperience({
      role: '',
      institution: '',
      subject: '',
      level: '',
      startDate: '',
      description: '',
      isCurrent: false,
    });
  };

  const updateTeachingExperience = (id: string, field: string, value: any) => {
    store.updateTeachingExperience(id, { [field]: value });
  };

  const removeTeachingExperience = (id: string) => {
    store.removeTeachingExperience(id);
  };

  const updateTargetAudience = (audience: string, checked: boolean) => {
    const currentAudience = [...(store.teachingInformation.targetAudience || [])];
    
    if (checked && !currentAudience.includes(audience)) {
      currentAudience.push(audience);
    } else if (!checked && currentAudience.includes(audience)) {
      const index = currentAudience.indexOf(audience);
      currentAudience.splice(index, 1);
    }
    
    store.updateTeachingInfo({
      targetAudience: currentAudience,
    });
  };

  const updatePreferredFormats = (format: string, checked: boolean) => {
    const currentFormats = [...(store.teachingInformation.preferredFormats || [])];
    
    if (checked && !currentFormats.includes(format)) {
      currentFormats.push(format);
    } else if (!checked && currentFormats.includes(format)) {
      const index = currentFormats.indexOf(format);
      currentFormats.splice(index, 1);
    }
    
    store.updateTeachingInfo({
      preferredFormats: currentFormats,
    });
  };

  const updateWeeklyAvailability = (day: string, available: boolean) => {
    store.updateTeachingInfo({
      weeklyAvailability: {
        ...store.teachingInformation.weeklyAvailability,
        [day]: {
          ...store.teachingInformation.weeklyAvailability[day],
          available,
        },
      },
    });
  };

  const validateStep = () => {
    const errors: string[] = [];
    
    if (!store.teachingInformation.subjectsToTeach || store.teachingInformation.subjectsToTeach.length === 0) {
      errors.push('At least one subject to teach is required');
    }
    
    if (!store.teachingInformation.teachingMotivation || !store.teachingInformation.teachingMotivation.trim()) {
      errors.push('Teaching motivation is required');
    }
    
    if (!store.teachingInformation.teachingMotivation || store.teachingInformation.teachingMotivation.length < 100) {
      errors.push('Teaching motivation must be at least 100 characters');
    }
    
    if (!store.teachingInformation.teachingPhilosophy || !store.teachingInformation.teachingPhilosophy.trim()) {
      errors.push('Teaching philosophy is required');
    }
    
    if (!store.teachingInformation.targetAudience || store.teachingInformation.targetAudience.length === 0) {
      errors.push('At least one target audience must be selected');
    }

    store.updateStepCompletion('teaching-information', errors.length === 0, errors);
    return errors.length === 0;
  };

  const subjectCategories = [
    'Technology', 'Business', 'Design', 'Marketing', 'Programming', 
    'Data Science', 'Photography', 'Music', 'Health', 'Language', 
    'Arts', 'Science', 'Mathematics', 'Cooking', 'Fitness', 
    'Personal Development', 'Finance', 'Education', 'Lifestyle', 'Sports'
  ];

  const targetAudiences = [
    'High School Students', 'College Students', 'Working Professionals', 
    'Entrepreneurs', 'Career Changers', 'Hobbyists', 'Seniors', 
    'Children (Ages 5-12)', 'Teenagers (Ages 13-17)', 'International Students'
  ];

  const teachingFormats = [
    'Video Lectures', 'Live Webinars', 'Interactive Workshops', 
    'One-on-One Tutoring', 'Group Discussions', 'Project-Based Learning', 
    'Case Studies', 'Gamified Learning', 'Peer Reviews', 'Mentorship'
  ];

  const weekDays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="space-y-6">
      {/* Subjects to Teach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subjects to Teach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Teaching Subjects</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSubjectToTeach}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>

          {(store.teachingInformation.subjectsToTeach || []).map((subject, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{subject.subject || 'New Subject'}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSubjectToTeach(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input
                    value={subject.subject}
                    onChange={(e) => updateSubjectToTeach(index, 'subject', e.target.value)}
                    placeholder="e.g., JavaScript, Marketing, Photography"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={subject.category}
                    onValueChange={(value) => updateSubjectToTeach(index, 'category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectCategories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select
                    value={subject.level}
                    onValueChange={(value) => updateSubjectToTeach(index, 'level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="all_levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    min="0"
                    value={subject.experienceYears}
                    onChange={(e) => updateSubjectToTeach(index, 'experienceYears', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 5"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Confidence Level</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateSubjectToTeach(index, 'confidence', level)}
                        className={`p-1 rounded ${
                          subject.confidence >= level 
                            ? 'text-yellow-500' 
                            : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {subject.confidence === 1 && 'Beginner'}
                    {subject.confidence === 2 && 'Some Experience'}
                    {subject.confidence === 3 && 'Confident'}
                    {subject.confidence === 4 && 'Very Confident'}
                    {subject.confidence === 5 && 'Expert'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Teaching Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teaching Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasTeachingExperience"
              checked={store.teachingInformation.hasTeachingExperience || false}
              onCheckedChange={(checked) => 
                handleBasicInfoChange('hasTeachingExperience', checked as boolean)
              }
            />
            <Label htmlFor="hasTeachingExperience">I have previous teaching experience</Label>
          </div>

          {(store.teachingInformation.hasTeachingExperience || false) && (
            <>
              <div className="flex items-center justify-between">
                <Label>Teaching Experience</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTeachingExperience}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>

              {(store.teachingInformation.teachingExperience || []).map((experience) => (
                <div key={experience.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{experience.role || 'New Experience'}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTeachingExperience(experience.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Role *</Label>
                      <Input
                        value={experience.role}
                        onChange={(e) => updateTeachingExperience(experience.id, 'role', e.target.value)}
                        placeholder="e.g., Instructor, Tutor, Professor"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={experience.institution}
                        onChange={(e) => updateTeachingExperience(experience.id, 'institution', e.target.value)}
                        placeholder="e.g., University, Company, Online Platform"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        value={experience.subject}
                        onChange={(e) => updateTeachingExperience(experience.id, 'subject', e.target.value)}
                        placeholder="e.g., Mathematics, Programming"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Level</Label>
                      <Input
                        value={experience.level}
                        onChange={(e) => updateTeachingExperience(experience.id, 'level', e.target.value)}
                        placeholder="e.g., Beginner, Advanced"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={experience.startDate}
                        onChange={(e) => updateTeachingExperience(experience.id, 'startDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={experience.description}
                      onChange={(e) => updateTeachingExperience(experience.id, 'description', e.target.value)}
                      placeholder="Describe your teaching experience, methods used, and student outcomes"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      {/* Teaching Philosophy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Teaching Philosophy & Motivation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teachingMotivation">Why do you want to teach? *</Label>
            <Textarea
              id="teachingMotivation"
              value={store.teachingInformation.teachingMotivation || ''}
              onChange={(e) => handleBasicInfoChange('teachingMotivation', e.target.value)}
              placeholder="Share your motivation for becoming an instructor. What drives you to teach and help others learn?"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 100 characters. Current: {(store.teachingInformation.teachingMotivation || '').length}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teachingPhilosophy">Teaching Philosophy *</Label>
            <Textarea
              id="teachingPhilosophy"
              value={store.teachingInformation.teachingPhilosophy || ''}
              onChange={(e) => handleBasicInfoChange('teachingPhilosophy', e.target.value)}
              placeholder="Describe your approach to teaching. What methods do you believe work best for student learning?"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teachingStyle">Teaching Style</Label>
            <Textarea
              id="teachingStyle"
              value={store.teachingInformation.teachingStyle || ''}
              onChange={(e) => handleBasicInfoChange('teachingStyle', e.target.value)}
              placeholder="Describe your personal teaching style and how you engage with students"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teachingMethodology">Teaching Methodology</Label>
            <Textarea
              id="teachingMethodology"
              value={store.teachingInformation.teachingMethodology || ''}
              onChange={(e) => handleBasicInfoChange('teachingMethodology', e.target.value)}
              placeholder="What specific methodologies or frameworks do you use in your teaching?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Target Audience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Who do you want to teach? (Select all that apply) *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetAudiences.map((audience) => (
              <div key={audience} className="flex items-center space-x-2">
                <Checkbox
                  id={`audience-${audience}`}
                  checked={(store.teachingInformation.targetAudience || []).includes(audience)}
                  onCheckedChange={(checked) => updateTargetAudience(audience, checked as boolean)}
                />
                <Label htmlFor={`audience-${audience}`} className="text-sm">
                  {audience}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teaching Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Teaching Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Teaching Formats</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teachingFormats.map((format) => (
                  <div key={format} className="flex items-center space-x-2">
                    <Checkbox
                      id={`format-${format}`}
                      checked={(store.teachingInformation.preferredFormats || []).includes(format)}
                      onCheckedChange={(checked) => updatePreferredFormats(format, checked as boolean)}
                    />
                    <Label htmlFor={`format-${format}`} className="text-sm">
                      {format}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredClassSize">Preferred Class Size</Label>
              <Select
                value={store.teachingInformation.preferredClassSize || ''}
                onValueChange={(value) => handleBasicInfoChange('preferredClassSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred class size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_on_one">One-on-One</SelectItem>
                  <SelectItem value="small_group">Small Group (2-10 students)</SelectItem>
                  <SelectItem value="medium_group">Medium Group (11-30 students)</SelectItem>
                  <SelectItem value="large_group">Large Group (31+ students)</SelectItem>
                  <SelectItem value="any">Any size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>When are you typically available to teach?</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weekDays.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`availability-${key}`}
                  checked={store.teachingInformation.weeklyAvailability?.[key]?.available || false}
                  onCheckedChange={(checked) => updateWeeklyAvailability(key, checked as boolean)}
                />
                <Label htmlFor={`availability-${key}`} className="text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validation Status */}
      {Object.keys(store.ui.errors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="font-medium mb-2">Please fix the following errors:</div>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(store.ui.errors).map(([field, errors]) =>
                errors.map((error, index) => (
                  <li key={`${field}-${index}`}>{error}</li>
                ))
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Indicator */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Badge variant={store.steps[2]?.isValid ? "default" : "secondary"}>
            {store.steps[2]?.isValid ? "Valid" : "Incomplete"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {store.steps[2]?.completionPercentage}% complete
          </span>
        </div>
      </div>
    </div>
  );
}

