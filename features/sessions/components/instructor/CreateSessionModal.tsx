"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Users, DollarSign, Video, Settings, Package } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCreateLiveSession, useSessionOfferings } from '../../hooks/useLiveSessions';
import { LiveSessionType, SessionFormat, SessionType, SessionMode } from '../../types/session.types';
import { toast } from 'sonner';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorId: string;
  onSuccess: () => void;
}

export function CreateSessionModal({
  isOpen,
  onClose,
  instructorId,
  onSuccess,
}: CreateSessionModalProps) {
  const [formData, setFormData] = useState({
    offeringId: '',
    title: '',
    description: '',
    sessionType: LiveSessionType.CUSTOM,
    sessionFormat: SessionFormat.ONLINE,
    duration: 60,
    maxParticipants: 10,
    minParticipants: 1,
    pricePerPerson: 0,
    currency: 'USD',
    scheduledStart: '',
    scheduledEnd: '',
    topic: '',
    materials: '',
    prerequisites: '',
    recordingEnabled: true,
    whiteboardEnabled: true,
    chatEnabled: true,
    screenShareEnabled: true,
  });

  const createSessionMutation = useCreateLiveSession();
  const { data: offerings, isLoading: offeringsLoading } = useSessionOfferings({ instructorId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.offeringId || !formData.title || !formData.scheduledStart) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const sessionData = {
        instructorId,
        offeringId: formData.offeringId,
        title: formData.title,
        description: formData.description,
        sessionType: formData.sessionType,
        format: formData.sessionFormat,
        sessionFormat: formData.sessionFormat,
        sessionMode: SessionMode.LIVE,
        duration: formData.duration,
        maxParticipants: formData.maxParticipants,
        minParticipants: formData.minParticipants,
        pricePerPerson: formData.pricePerPerson,
        currency: formData.currency,
        scheduledStart: new Date(formData.scheduledStart),
        scheduledEnd: formData.scheduledEnd ? new Date(formData.scheduledEnd) : new Date(new Date(formData.scheduledStart).getTime() + formData.duration * 60000),
        topic: formData.topic || undefined,
        materials: formData.materials ? formData.materials.split('\n').filter(m => m.trim()) : [],
        prerequisites: formData.prerequisites ? formData.prerequisites.split('\n').filter(p => p.trim()) : [],
        recordingEnabled: formData.recordingEnabled,
        whiteboardEnabled: formData.whiteboardEnabled,
        chatEnabled: formData.chatEnabled,
        screenShareEnabled: formData.screenShareEnabled,
      };

      await createSessionMutation.mutateAsync(sessionData);
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        offeringId: '',
        title: '',
        description: '',
        sessionType: LiveSessionType.CUSTOM,
        sessionFormat: SessionFormat.ONLINE,
        duration: 60,
        maxParticipants: 10,
        minParticipants: 1,
        pricePerPerson: 0,
        currency: 'USD',
        scheduledStart: '',
        scheduledEnd: '',
        topic: '',
        materials: '',
        prerequisites: '',
        recordingEnabled: true,
        whiteboardEnabled: true,
        chatEnabled: true,
        screenShareEnabled: true,
      });
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedOffering = offerings?.find(offering => offering.id === formData.offeringId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Create New Live Session
          </DialogTitle>
          <DialogDescription>
            Set up a new live teaching session with your students
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Offering Selection */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Package className="w-4 h-4" />
              Session Offering
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="offeringId">Select Offering *</Label>
              <Select
                value={formData.offeringId}
                onValueChange={(value) => handleInputChange('offeringId', value)}
                disabled={offeringsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={offeringsLoading ? "Loading offerings..." : "Select an offering"} />
                </SelectTrigger>
                <SelectContent>
                  {offerings?.map((offering) => (
                    <SelectItem key={offering.id} value={offering.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{offering.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {offering.duration}min • ${offering.basePrice} • {offering.capacity} participants
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!offerings || offerings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No offerings available. Please create an offering first.
                </p>
              ) : null}
            </div>

            {/* Selected Offering Details */}
            {selectedOffering && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h5 className="font-medium text-sm">Selected Offering Details:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span> {selectedOffering.duration} minutes
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price:</span> ${selectedOffering.basePrice}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capacity:</span> {selectedOffering.capacity} participants
                  </div>
                  <div>
                    <span className="text-muted-foreground">Format:</span> {selectedOffering.sessionFormat}
                  </div>
                </div>
                {selectedOffering.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedOffering.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Basic Information</h4>
            
            <div className="space-y-2">
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter session title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this session will cover"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionType">Session Type</Label>
                <Select
                  value={formData.sessionType}
                  onValueChange={(value) => handleInputChange('sessionType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={LiveSessionType.CUSTOM}>Custom Session</SelectItem>
                    <SelectItem value={LiveSessionType.COURSE_BASED}>Course-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionFormat">Format</Label>
                <Select
                  value={formData.sessionFormat}
                  onValueChange={(value) => handleInputChange('sessionFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SessionFormat.ONLINE}>Online</SelectItem>
                    <SelectItem value={SessionFormat.OFFLINE}>Offline</SelectItem>
                    <SelectItem value={SessionFormat.HYBRID}>Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schedule & Duration */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule & Duration
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledStart">Start Date & Time *</Label>
                <Input
                  id="scheduledStart"
                  type="datetime-local"
                  value={formData.scheduledStart}
                  onChange={(e) => handleInputChange('scheduledStart', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="480"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Capacity & Pricing */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Capacity & Pricing
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerPerson">Price per Person</Label>
                <Input
                  id="pricePerPerson"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricePerPerson}
                  onChange={(e) => handleInputChange('pricePerPerson', parseFloat(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange('currency', value)}
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
            </div>
          </div>

          {/* Content & Materials */}
          <div className="space-y-4">
            <h4 className="font-medium">Content & Materials</h4>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Topic/Subject</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="e.g., Advanced React Patterns, Data Science Fundamentals"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="materials">Materials (one per line)</Label>
              <Textarea
                id="materials"
                value={formData.materials}
                onChange={(e) => handleInputChange('materials', e.target.value)}
                placeholder="List materials students should prepare"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prerequisites">Prerequisites (one per line)</Label>
              <Textarea
                id="prerequisites"
                value={formData.prerequisites}
                onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                placeholder="List any prerequisites or required knowledge"
                rows={2}
              />
            </div>
          </div>

          {/* Session Features */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Session Features
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="recordingEnabled">Enable Recording</Label>
                <Switch
                  id="recordingEnabled"
                  checked={formData.recordingEnabled}
                  onCheckedChange={(checked) => handleInputChange('recordingEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="whiteboardEnabled">Enable Whiteboard</Label>
                <Switch
                  id="whiteboardEnabled"
                  checked={formData.whiteboardEnabled}
                  onCheckedChange={(checked) => handleInputChange('whiteboardEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="chatEnabled">Enable Chat</Label>
                <Switch
                  id="chatEnabled"
                  checked={formData.chatEnabled}
                  onCheckedChange={(checked) => handleInputChange('chatEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="screenShareEnabled">Enable Screen Share</Label>
                <Switch
                  id="screenShareEnabled"
                  checked={formData.screenShareEnabled}
                  onCheckedChange={(checked) => handleInputChange('screenShareEnabled', checked)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createSessionMutation.isPending || !formData.offeringId || !formData.title || !formData.scheduledStart}
            >
              {createSessionMutation.isPending ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Creating...
                </>
              ) : (
                'Create Session'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
