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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, UserMinus, Mail, Phone } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SessionParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  participants: any[];
  onAddParticipant: (sessionId: string, participantData: any) => void;
  onRemoveParticipant: (sessionId: string, userId: string) => void;
}

export function SessionParticipantsModal({
  isOpen,
  onClose,
  session,
  participants,
  onAddParticipant,
  onRemoveParticipant,
}: SessionParticipantsModalProps) {
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [newParticipantRole, setNewParticipantRole] = useState('STUDENT');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddParticipant = async () => {
    if (!newParticipantEmail.trim() || !session?.id) return;

    setIsAdding(true);
    try {
      await onAddParticipant(session.id, {
        email: newParticipantEmail.trim(),
        role: newParticipantRole,
      });
      setNewParticipantEmail('');
      setNewParticipantRole('STUDENT');
    } catch (error) {
      console.error('Failed to add participant:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveParticipant = async (userId: string) => {
    if (!session?.id) return;

    try {
      await onRemoveParticipant(session.id, userId);
    } catch (error) {
      console.error('Failed to remove participant:', error);
    }
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Session Participants
          </DialogTitle>
          <DialogDescription>
            Manage participants for "{session.title || 'Untitled Session'}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Session Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Date:</span>
                <span className="ml-2">
                  {new Date(session.scheduledStart).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span>
                <span className="ml-2">
                  {new Date(session.scheduledStart).toLocaleTimeString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Capacity:</span>
                <span className="ml-2">
                  {session.currentParticipants || 0}/{session.maxParticipants || 'Unlimited'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="ml-2">
                  {session.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Add New Participant */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Participant
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant-email">Email Address</Label>
                <Input
                  id="participant-email"
                  type="email"
                  placeholder="student@example.com"
                  value={newParticipantEmail}
                  onChange={(e) => setNewParticipantEmail(e.target.value)}
                  disabled={isAdding}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participant-role">Role</Label>
                <Select
                  value={newParticipantRole}
                  onValueChange={setNewParticipantRole}
                  disabled={isAdding}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="CO_INSTRUCTOR">Co-Instructor</SelectItem>
                    <SelectItem value="OBSERVER">Observer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleAddParticipant}
              disabled={!newParticipantEmail.trim() || isAdding}
              className="w-full"
            >
              {isAdding ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Participant
                </>
              )}
            </Button>
          </div>

          {/* Participants List */}
          <div className="space-y-4">
            <h4 className="font-medium">
              Current Participants ({participants?.length || 0})
            </h4>
            
            {!participants || participants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No participants yet</p>
                <p className="text-sm">Add participants using the form above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={participant.profileImage} />
                        <AvatarFallback>
                          {participant.firstName?.[0]}{participant.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {participant.firstName} {participant.lastName}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {participant.role || 'STUDENT'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{participant.email}</span>
                          </div>
                          {participant.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{participant.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {participant.status && (
                        <Badge
                          variant={
                            participant.status === 'CONFIRMED' ? 'default' :
                            participant.status === 'PENDING' ? 'secondary' :
                            'destructive'
                          }
                          className="text-xs"
                        >
                          {participant.status}
                        </Badge>
                      )}
                      
                      {participant.role !== 'INSTRUCTOR' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveParticipant(participant.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
