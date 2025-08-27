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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Video, 
  Play, 
  Pause, 
  X, 
  Edit, 
  Eye,
  ExternalLink,
  FileText,
  MessageSquare,
  Settings,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SessionStatus, LiveSessionType, SessionFormat } from '../../types/session.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditSessionFormProps {
  session: any;
  onSave: (formData: any) => Promise<void>;
  onCancel: () => void;
}

function EditSessionForm({ session, onSave, onCancel }: EditSessionFormProps) {
  const [formData, setFormData] = useState({
    title: session.title || '',
    description: session.description || '',
    scheduledStart: session.scheduledStart ? new Date(session.scheduledStart).toISOString().slice(0, 16) : '',
    duration: session.duration || 60,
    maxParticipants: session.maxParticipants || 1,
    pricePerPerson: session.pricePerPerson || 0,
    meetingLink: session.meetingLink || '',
    meetingPassword: session.meetingPassword || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Failed to update session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Session Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter session title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            min="15"
            max="480"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="scheduledStart">Start Date & Time</Label>
          <Input
            id="scheduledStart"
            type="datetime-local"
            value={formData.scheduledStart}
            onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="maxParticipants">Max Participants</Label>
          <Input
            id="maxParticipants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
            min="1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="pricePerPerson">Price per Person</Label>
          <Input
            id="pricePerPerson"
            type="number"
            value={formData.pricePerPerson}
            onChange={(e) => setFormData({ ...formData, pricePerPerson: parseFloat(e.target.value) })}
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <Label htmlFor="meetingLink">Meeting Link</Label>
          <Input
            id="meetingLink"
            value={formData.meetingLink}
            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
            placeholder="https://meet.google.com/..."
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter session description"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner className="w-4 h-4" /> : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  onStart?: (sessionId: string) => void;
  onEnd?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
  onReschedule?: (sessionId: string, rescheduleData: any) => void;
  onUpdate?: (sessionId: string, formData: any) => void;
}

export function SessionDetailsModal({
  isOpen,
  onClose,
  session,
  onStart,
  onEnd,
  onCancel,
  onReschedule,
  onUpdate,
}: SessionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!session) return null;

  const handleAction = async (action: () => Promise<void>) => {
    setIsActionLoading(true);
    try {
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      case SessionStatus.IN_PROGRESS:
        return 'bg-green-100 text-green-800';
      case SessionStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case SessionStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.SCHEDULED:
        return <Calendar className="w-4 h-4" />;
      case SessionStatus.IN_PROGRESS:
        return <Play className="w-4 h-4" />;
      case SessionStatus.COMPLETED:
        return <Clock className="w-4 h-4" />;
      case SessionStatus.CANCELLED:
        return <X className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Session Details
          </DialogTitle>
          <DialogDescription>
            {session.title || 'Untitled Session'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Edit Form */}
          {isEditing && (
            <div className="p-6 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Session</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel Edit
                </Button>
              </div>
              
              <EditSessionForm
                session={session}
                onSave={async (formData) => {
                  if (onUpdate) {
                    await onUpdate(session.id, formData);
                    setIsEditing(false);
                  }
                }}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          )}

          {/* Session Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {session.title || 'Untitled Session'}
              </h3>
              <p className="text-muted-foreground mb-3">
                {session.description || 'No description available'}
              </p>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(session.status)}>
                  {getStatusIcon(session.status)}
                  <span className="ml-1">{session.status.replace('_', ' ')}</span>
                </Badge>
                <Badge variant="outline">
                  {session.sessionType || LiveSessionType.CUSTOM}
                </Badge>
                <Badge variant="outline">
                  {session.sessionFormat || SessionFormat.ONLINE}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Edit Button - Available for all sessions that aren't completed or cancelled */}
              {(session.status === SessionStatus.SCHEDULED || session.status === SessionStatus.CONFIRMED) && onUpdate && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}

              {session.status === SessionStatus.SCHEDULED && onStart && (
                <Button
                  onClick={() => handleAction(async () => onStart(session.id))}
                  disabled={isActionLoading}
                  className="flex items-center gap-2"
                >
                  {isActionLoading ? (
                    <LoadingSpinner className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Start Session
                </Button>
              )}

              {session.status === SessionStatus.IN_PROGRESS && onEnd && (
                <Button
                  onClick={() => handleAction(async () => onEnd(session.id))}
                  disabled={isActionLoading}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  {isActionLoading ? (
                    <LoadingSpinner className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                  End Session
                </Button>
              )}

              {session.status === SessionStatus.SCHEDULED && onCancel && (
                <Button
                  onClick={() => handleAction(async () => onCancel(session.id))}
                  disabled={isActionLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isActionLoading ? (
                    <LoadingSpinner className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Cancel
                </Button>
              )}

              {session.meetingLink && (
                <Button
                  variant="outline"
                  onClick={() => window.open(session.meetingLink, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Join Meeting
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Session Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Date</span>
                  </div>
                  <p className="text-sm">
                    {format(new Date(session.scheduledStart), 'MMM dd, yyyy')}
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Time</span>
                  </div>
                  <p className="text-sm">
                    {format(new Date(session.scheduledStart), 'HH:mm')}
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <p className="text-sm">
                    {formatDuration(session.duration)}
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Participants</span>
                  </div>
                  <p className="text-sm">
                    {session.currentParticipants || 0}/{session.maxParticipants || 'Unlimited'}
                  </p>
                </div>
              </div>

              {/* Instructor Info */}
              {session.instructor && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Instructor</h4>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={session.instructor.profileImage} />
                      <AvatarFallback>
                        {session.instructor.firstName?.[0]}{session.instructor.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {session.instructor.firstName} {session.instructor.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.instructor.email}
                      </p>
                      {session.instructor.teachingRating && (
                        <p className="text-sm text-muted-foreground">
                          ⭐ {session.instructor.teachingRating.toFixed(1)} rating
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Topic & Content */}
              {session.topic && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Topic</h4>
                  <p className="text-sm">{session.topic}</p>
                </div>
              )}

              {/* Pricing */}
              {session.pricePerPerson && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Pricing
                  </h4>
                  <p className="text-lg font-semibold">
                    {formatPrice(session.pricePerPerson, session.currency)} per person
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="participants" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Session Participants</h4>
                {session.participants && session.participants.length > 0 ? (
                  <div className="space-y-3">
                    {session.participants.map((participant: any) => (
                      <div key={participant.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={participant.profileImage} />
                            <AvatarFallback>
                              {participant.firstName?.[0]}{participant.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {participant.firstName} {participant.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {participant.email}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {participant.role || 'STUDENT'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No participants registered yet
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <div className="space-y-4">
                {/* Materials */}
                {session.materials && session.materials.length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Required Materials
                    </h4>
                    <ul className="space-y-2">
                      {session.materials.map((material: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prerequisites */}
                {session.prerequisites && session.prerequisites.length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Prerequisites
                    </h4>
                    <ul className="space-y-2">
                      {session.prerequisites.map((prerequisite: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          {prerequisite}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(!session.materials || session.materials.length === 0) && 
                 (!session.prerequisites || session.prerequisites.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">
                    No materials or prerequisites specified
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Session Features
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Recording</span>
                    <Badge variant={session.recordingEnabled ? "default" : "secondary"}>
                      {session.recordingEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Whiteboard</span>
                    <Badge variant={session.whiteboardEnabled ? "default" : "secondary"}>
                      {session.whiteboardEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chat</span>
                    <Badge variant={session.chatEnabled ? "default" : "secondary"}>
                      {session.chatEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Screen Share</span>
                    <Badge variant={session.screenShareEnabled ? "default" : "secondary"}>
                      {session.screenShareEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Meeting Information */}
              {session.meetingLink && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Meeting Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Meeting Link</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(session.meetingLink, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </Button>
                    </div>
                    {session.meetingPassword && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Password</span>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {session.meetingPassword}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
