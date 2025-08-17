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
import { User, Mail, Phone, MapPin, Globe, Languages, Shield } from 'lucide-react';

export function PersonalInformationStep() {
  const store = useInstructorApplicationStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof typeof store.personalInfo, value: string) => {
    store.updatePersonalInfo({ [field]: value });
  };

  const handleEmergencyContactChange = (field: keyof typeof store.personalInfo.emergencyContact, value: string) => {
    store.updatePersonalInfo({
      emergencyContact: {
        ...store.personalInfo.emergencyContact,
        [field]: value,
      },
    });
  };

  const addLanguage = () => {
    const newLanguage = {
      language: '',
      proficiency: 'basic' as const,
      canTeachIn: false,
    };
    
    store.updatePersonalInfo({
      languagesSpoken: [...(store.personalInfo.languagesSpoken || []), newLanguage],
    });
  };

  const updateLanguage = (index: number, field: string, value: string | boolean) => {
    const updatedLanguages = [...(store.personalInfo.languagesSpoken || [])];
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value,
    };
    
    store.updatePersonalInfo({
      languagesSpoken: updatedLanguages,
    });
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = (store.personalInfo.languagesSpoken || []).filter((_, i) => i !== index);
    store.updatePersonalInfo({
      languagesSpoken: updatedLanguages,
    });
  };

  const validateStep = () => {
    return store.validatePersonalInfo();
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
                             <Input
                 id="firstName"
                 value={store.personalInfo.firstName || ''}
                 onChange={(e) => handleInputChange('firstName', e.target.value)}
                 placeholder="Enter your first name"
               />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
                             <Input
                 id="lastName"
                 value={store.personalInfo.lastName || ''}
                 onChange={(e) => handleInputChange('lastName', e.target.value)}
                 placeholder="Enter your last name"
               />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
                             <Input
                 id="email"
                 type="email"
                 value={store.personalInfo.email || ''}
                 onChange={(e) => handleInputChange('email', e.target.value)}
                 placeholder="Enter your email address"
               />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
                             <Input
                 id="phoneNumber"
                 type="tel"
                 value={store.personalInfo.phoneNumber || ''}
                 onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                 placeholder="Enter your phone number"
               />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                             <Input
                 id="dateOfBirth"
                 type="date"
                 value={store.personalInfo.dateOfBirth || ''}
                 onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
               />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
                             <Select
                 value={store.personalInfo.nationality || ''}
                 onValueChange={(value) => handleInputChange('nationality', value)}
               >
                <SelectTrigger>
                  <SelectValue placeholder="Select your nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address *</Label>
                         <Input
               id="streetAddress"
               value={store.personalInfo.streetAddress || ''}
               onChange={(e) => handleInputChange('streetAddress', e.target.value)}
               placeholder="Enter your street address"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
                             <Input
                 id="city"
                 value={store.personalInfo.city || ''}
                 onChange={(e) => handleInputChange('city', e.target.value)}
                 placeholder="Enter your city"
               />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
                             <Input
                 id="state"
                 value={store.personalInfo.state || ''}
                 onChange={(e) => handleInputChange('state', e.target.value)}
                 placeholder="Enter your state"
               />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
                             <Input
                 id="postalCode"
                 value={store.personalInfo.postalCode || ''}
                 onChange={(e) => handleInputChange('postalCode', e.target.value)}
                 placeholder="Enter your postal code"
               />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
                             <Select
                 value={store.personalInfo.country || ''}
                 onValueChange={(value) => handleInputChange('country', value)}
               >
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Time Zone</Label>
                             <Select
                 value={store.personalInfo.timezone || ''}
                 onValueChange={(value) => handleInputChange('timezone', value)}
               >
                <SelectTrigger>
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Language Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryLanguage">Primary Language</Label>
                         <Select
               value={store.personalInfo.primaryLanguage || ''}
               onValueChange={(value) => handleInputChange('primaryLanguage', value)}
             >
              <SelectTrigger>
                <SelectValue placeholder="Select your primary language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Languages Spoken</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLanguage}
              >
                Add Language
              </Button>
            </div>

            {(store.personalInfo.languagesSpoken || []).map((language, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Language</Label>
                                     <Input
                     value={language.language || ''}
                     onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                     placeholder="Enter language"
                   />
                </div>
                
                <div className="space-y-2">
                  <Label>Proficiency</Label>
                                     <Select
                     value={language.proficiency || 'basic'}
                     onValueChange={(value) => updateLanguage(index, 'proficiency', value)}
                   >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="native">Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Can Teach In</Label>
                  <div className="flex items-center space-x-2">
                                         <input
                       type="checkbox"
                       id={`canTeachIn-${index}`}
                       checked={language.canTeachIn || false}
                       onChange={(e) => updateLanguage(index, 'canTeachIn', e.target.checked)}
                       className="rounded border-gray-300"
                     />
                    <Label htmlFor={`canTeachIn-${index}`} className="text-sm">
                      Yes
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLanguage(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Contact Name *</Label>
              <Input
                id="emergencyName"
                value={store.personalInfo.emergencyContact?.name || ''}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                placeholder="Enter emergency contact name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship">Relationship *</Label>
              <Input
                id="emergencyRelationship"
                value={store.personalInfo.emergencyContact?.relationship || ''}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                placeholder="e.g., Spouse, Parent, Friend"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Phone Number *</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={store.personalInfo.emergencyContact?.phoneNumber || ''}
                onChange={(e) => handleEmergencyContactChange('phoneNumber', e.target.value)}
                placeholder="Enter emergency contact phone"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyEmail">Email</Label>
              <Input
                id="emergencyEmail"
                type="email"
                value={store.personalInfo.emergencyContact?.email || ''}
                onChange={(e) => handleEmergencyContactChange('email', e.target.value)}
                placeholder="Enter emergency contact email"
              />
            </div>
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
          <Badge variant={store.steps[0]?.isValid ? "default" : "secondary"}>
            {store.steps[0]?.isValid ? "Valid" : "Incomplete"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {store.steps[0]?.completionPercentage}% complete
          </span>
        </div>
      </div>
    </div>
  );
}

