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
import { 
  GraduationCap, 
  Briefcase, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  AlertCircle,
  Building,
  Calendar,
  MapPin
} from 'lucide-react';

export function ProfessionalBackgroundStep() {
  const store = useInstructorApplicationStore();

  const handleBasicInfoChange = (field: keyof typeof store.professionalBackground, value: string | number) => {
    store.updateProfessionalBackground({ [field]: value });
  };

  const addEducation = () => {
    store.addEducation({
      institution: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      description: '',
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    store.updateEducation(id, { [field]: value });
  };

  const removeEducation = (id: string) => {
    store.removeEducation(id);
  };

  const addExperience = () => {
    store.addExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
  };

  const updateExperience = (id: string, field: string, value: string | boolean | string[]) => {
    store.updateExperience(id, { [field]: value });
  };

  const removeExperience = (id: string) => {
    store.removeExperience(id);
  };

  const addReference = () => {
    store.addReference({
      name: '',
      position: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
      contactPermission: false,
    });
  };

  const updateReference = (id: string, field: string, value: string | boolean) => {
    store.updateReference(id, { [field]: value });
  };

  const removeReference = (id: string) => {
    store.removeReference(id);
  };

  const validateStep = () => {
    const errors: string[] = [];
    
            if (!store.professionalBackground.education || store.professionalBackground.education.length === 0) {
      errors.push('At least one education entry is required');
    }
    
            if (!store.professionalBackground.experience || store.professionalBackground.experience.length === 0) {
      errors.push('At least one work experience entry is required');
    }
    
            if (!store.professionalBackground.references || store.professionalBackground.references.length < 2) {
      errors.push('At least two professional references are required');
    }

    store.updateStepCompletion('professional-background', errors.length === 0, errors);
    return errors.length === 0;
  };

  return (
    <div className="space-y-6">
      {/* Current Employment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Current Employment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentJobTitle">Current Job Title</Label>
              <Input
                id="currentJobTitle"
                value={store.professionalBackground.currentJobTitle || ''}
                onChange={(e) => handleBasicInfoChange('currentJobTitle', e.target.value)}
                placeholder="Enter your current job title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentEmployer">Current Employer</Label>
              <Input
                id="currentEmployer"
                value={store.professionalBackground.currentEmployer || ''}
                onChange={(e) => handleBasicInfoChange('currentEmployer', e.target.value)}
                placeholder="Enter your current employer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                value={store.professionalBackground.employmentType || ''}
                onValueChange={(value) => handleBasicInfoChange('employmentType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="self_employed">Self Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workLocation">Work Location</Label>
              <Input
                id="workLocation"
                value={store.professionalBackground.workLocation || ''}
                onChange={(e) => handleBasicInfoChange('workLocation', e.target.value)}
                placeholder="Enter work location"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                value={store.professionalBackground.yearsOfExperience || 0}
                onChange={(e) => handleBasicInfoChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                placeholder="Enter years of experience"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Education History</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEducation}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>

          {(store.professionalBackground.education || []).map((education) => (
            <div key={education.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{education.institution || 'New Education Entry'}</h4>
                <div className="flex items-center gap-2">
                  {education.isVerified && (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeEducation(education.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <Input
                    value={education.institution}
                    onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                    placeholder="Enter institution name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    value={education.degree}
                    onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                    placeholder="e.g., Bachelor's, Master's, PhD"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Field of Study *</Label>
                  <Input
                    value={education.field}
                    onChange={(e) => updateEducation(education.id, 'field', e.target.value)}
                    placeholder="e.g., Computer Science, Business"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>GPA</Label>
                  <Input
                    value={education.gpa || ''}
                    onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                    placeholder="e.g., 3.8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Year *</Label>
                  <Input
                    type="number"
                    min="1900"
                    max="2030"
                    value={education.startYear}
                    onChange={(e) => updateEducation(education.id, 'startYear', e.target.value)}
                    placeholder="e.g., 2018"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>End Year</Label>
                  <Input
                    type="number"
                    min="1900"
                    max="2030"
                    value={education.endYear}
                    onChange={(e) => updateEducation(education.id, 'endYear', e.target.value)}
                    placeholder="e.g., 2022"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Honors/Awards</Label>
                <Input
                  value={education.honors || ''}
                  onChange={(e) => updateEducation(education.id, 'honors', e.target.value)}
                  placeholder="e.g., Magna Cum Laude, Dean's List"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={education.description}
                  onChange={(e) => updateEducation(education.id, 'description', e.target.value)}
                  placeholder="Describe your educational experience, achievements, and relevant coursework"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Work Experience</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExperience}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>

          {(store.professionalBackground.experience || []).map((experience) => (
            <div key={experience.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{experience.position || 'New Experience Entry'}</h4>
                <div className="flex items-center gap-2">
                  {experience.isVerified && (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeExperience(experience.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    value={experience.position}
                    onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                    placeholder="Enter job title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={experience.endDate}
                    onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                    disabled={experience.current}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={experience.location || ''}
                    onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                    placeholder="Enter work location"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${experience.id}`}
                  checked={experience.current}
                  onChange={(e) => updateExperience(experience.id, 'current', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={`current-${experience.id}`} className="text-sm">
                  I currently work here
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select
                  value={experience.employmentType || ''}
                  onValueChange={(value) => updateExperience(experience.id, 'employmentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={experience.description}
                  onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities, achievements, and key contributions"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Achievements</Label>
                <Textarea
                  value={experience.achievements?.join('\n') || ''}
                  onChange={(e) => updateExperience(experience.id, 'achievements', e.target.value.split('\n').filter(line => line.trim()))}
                  placeholder="List your key achievements (one per line)"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Professional References */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Professional References
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Professional References (Minimum 2 required)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addReference}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Reference
            </Button>
          </div>

          {(store.professionalBackground.references || []).map((reference) => (
            <div key={reference.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{reference.name || 'New Reference'}</h4>
                <div className="flex items-center gap-2">
                  {reference.isVerified && (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeReference(reference.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={reference.name}
                    onChange={(e) => updateReference(reference.id, 'name', e.target.value)}
                    placeholder="Enter reference name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    value={reference.position}
                    onChange={(e) => updateReference(reference.id, 'position', e.target.value)}
                    placeholder="Enter reference position"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    value={reference.company}
                    onChange={(e) => updateReference(reference.id, 'company', e.target.value)}
                    placeholder="Enter reference company"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Relationship *</Label>
                  <Input
                    value={reference.relationship}
                    onChange={(e) => updateReference(reference.id, 'relationship', e.target.value)}
                    placeholder="e.g., Manager, Colleague, Client"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={reference.email}
                    onChange={(e) => updateReference(reference.id, 'email', e.target.value)}
                    placeholder="Enter reference email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input
                    type="tel"
                    value={reference.phone}
                    onChange={(e) => updateReference(reference.id, 'phone', e.target.value)}
                    placeholder="Enter reference phone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Years Known</Label>
                  <Input
                    type="number"
                    min="0"
                    value={reference.yearsKnown || ''}
                    onChange={(e) => updateReference(reference.id, 'yearsKnown', e.target.value)}
                    placeholder="e.g., 3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Contact Permission</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`contactPermission-${reference.id}`}
                      checked={reference.contactPermission || false}
                      onChange={(e) => updateReference(reference.id, 'contactPermission', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`contactPermission-${reference.id}`} className="text-sm">
                      I have permission to contact this reference
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={reference.notes || ''}
                  onChange={(e) => updateReference(reference.id, 'notes', e.target.value)}
                  placeholder="Additional notes about this reference"
                  rows={2}
                />
              </div>
            </div>
          ))}
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
          <Badge variant={store.steps[1]?.isValid ? "default" : "secondary"}>
            {store.steps[1]?.isValid ? "Valid" : "Incomplete"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {store.steps[1]?.completionPercentage}% complete
          </span>
        </div>
      </div>
    </div>
  );
}

