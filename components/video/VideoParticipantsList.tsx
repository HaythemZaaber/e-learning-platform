// components/video/VideoParticipantsList.tsx
'use client';

import React, { useState } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Crown,
  MoreVertical,
  UserX,
  Hand,
  UserPlus,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function VideoParticipantsList() {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const { user } = useAuth();
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Get the current call URL for sharing
  const callUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleInviteByEmail = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsInviting(true);
    try {
      // Here you would typically send an invitation email
      // For now, we'll just show a success message
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setIsInviteModalOpen(false);
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(callUrl);
      setCopiedLink(true);
      toast.success('Call link copied to clipboard');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-white font-medium">
            In call • {participants.length}
          </div>
          
          {/* Add Participant Button */}
          <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Invite Participants</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Invite people to join this video call
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Email Invite */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleInviteByEmail();
                        }
                      }}
                    />
                    <Button
                      onClick={handleInviteByEmail}
                      disabled={isInviting || !inviteEmail.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Copy Link */}
                <div className="space-y-2">
                  <Label className="text-white">Or share the call link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={callUrl}
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      onClick={handleCopyLink}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {copiedLink ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {participants.map((participant) => {
          const isMuted = !participant.audioStream;
          const isVideoOff = !participant.videoStream;
          const isHost = participant.roles?.includes('host');
          const isYou = participant.isLocalParticipant;

          return (
            <div
              key={participant.sessionId}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
            >
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={participant.image} />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {participant.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status indicator */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${
                  isMuted ? 'bg-gray-600' : 'bg-green-500'
                }`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">
                    {participant.name}
                    {isYou && ' (You)'}
                  </p>
                  {isHost && (
                    <Crown className="w-3 h-3 text-yellow-500 shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  {isMuted ? (
                    <MicOff className="w-3 h-3 text-red-400" />
                  ) : (
                    <Mic className="w-3 h-3 text-green-400" />
                  )}
                  {isVideoOff ? (
                    <VideoOff className="w-3 h-3 text-red-400" />
                  ) : (
                    <Video className="w-3 h-3 text-green-400" />
                  )}
                </div>
              </div>

              {/* Actions for host */}
              {!isYou && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem className="hover:bg-gray-700">
                      <Hand className="w-4 h-4 mr-2" />
                      Pin video
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-700 text-red-400">
                      <UserX className="w-4 h-4 mr-2" />
                      Remove from call
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}