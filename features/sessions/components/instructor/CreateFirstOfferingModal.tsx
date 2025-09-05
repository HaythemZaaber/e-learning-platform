"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  BookOpen, 
  Users, 
  Clock, 
  DollarSign,
  Target,
  Settings
} from "lucide-react";
import { useCreateSessionOffering } from "../../hooks/useLiveSessions";
import { SessionType, SessionFormat, SessionTopicType, CancellationPolicy } from "../../types/session.types";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface CreateFirstOfferingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateFirstOfferingModal({ isOpen, onClose, onSuccess }: CreateFirstOfferingModalProps) {
  const { user } = useAuth();
  const createOfferingMutation = useCreateSessionOffering();
  
  const [formData, setFormData] = useState({
    title: "Individual Session",
    description: "One-on-one personalized learning session",
    sessionType: SessionType.INDIVIDUAL,
    sessionFormat: SessionFormat.ONLINE,
    topicType: SessionTopicType.FLEXIBLE,
    duration: 60,
    capacity: 1,
    basePrice: 50,
    currency: "USD",
    isActive: true,
    isPublic: true,
    requiresApproval: false,
    cancellationPolicy: CancellationPolicy.MODERATE,
    recordingEnabled: true,
    whiteboardEnabled: true,
    screenShareEnabled: true,
    chatEnabled: true,
    materials: [],
    prerequisites: [],
    equipment: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("You must be logged in to create an offering");
      return;
    }

    try {
      await createOfferingMutation.mutateAsync({
        instructorId: user.id,
        ...formData,
      });
      
      toast.success("Session offering created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create offering:", error);
      toast.error("Failed to create session offering");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5 text-blue-600" />
            Create Your First Session Offering
          </DialogTitle>
          <DialogDescription>
            Set up your first session offering to start accepting bookings from students
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Offering Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Individual Tutoring Session"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what students can expect from this session..."
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Session Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Session Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Session Type</Label>
                  <Select 
                    value={formData.sessionType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, sessionType: value as SessionType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SessionType.INDIVIDUAL}>Individual (1-on-1)</SelectItem>
                      <SelectItem value={SessionType.GROUP}>Group Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select 
                    value={formData.sessionFormat} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, sessionFormat: value as SessionFormat }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SessionFormat.ONLINE}>Online (Video Call)</SelectItem>
                      <SelectItem value={SessionFormat.IN_PERSON}>In Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Select 
                    value={formData.duration.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Topic Type</Label>
                <Select 
                  value={formData.topicType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, topicType: value as SessionTopicType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SessionTopicType.FLEXIBLE}>Flexible (Student chooses topic)</SelectItem>
                    <SelectItem value={SessionTopicType.FIXED}>Fixed (Predefined curriculum)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Price ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Cancellation Policy</Label>
                <Select 
                  value={formData.cancellationPolicy} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cancellationPolicy: value as CancellationPolicy }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CancellationPolicy.FLEXIBLE}>Flexible (24h notice)</SelectItem>
                    <SelectItem value={CancellationPolicy.MODERATE}>Moderate (48h notice)</SelectItem>
                    <SelectItem value={CancellationPolicy.STRICT}>Strict (72h notice)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Session Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recordingEnabled"
                    checked={formData.recordingEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, recordingEnabled: checked }))}
                  />
                  <Label htmlFor="recordingEnabled">Enable session recording</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="whiteboardEnabled"
                    checked={formData.whiteboardEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, whiteboardEnabled: checked }))}
                  />
                  <Label htmlFor="whiteboardEnabled">Enable whiteboard</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="screenShareEnabled"
                    checked={formData.screenShareEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, screenShareEnabled: checked }))}
                  />
                  <Label htmlFor="screenShareEnabled">Enable screen sharing</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="chatEnabled"
                    checked={formData.chatEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, chatEnabled: checked }))}
                  />
                  <Label htmlFor="chatEnabled">Enable chat</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createOfferingMutation.isPending}
              className="flex items-center gap-2"
            >
              {createOfferingMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Offering
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

