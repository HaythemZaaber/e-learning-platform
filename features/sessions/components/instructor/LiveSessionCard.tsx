"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Play, 
  Pause, 
  X, 
  Edit, 
  Eye,
  UserPlus,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { SessionStatus, LiveSessionType, SessionFormat } from '../../types/session.types';

interface LiveSessionCardProps {
  session: any;
  onStart?: () => void;
  onEnd?: () => void;
  onCancel?: () => void;
  onReschedule?: (rescheduleData: any) => void;
  onViewParticipants?: () => void;
  onViewAttendance?: () => void;
  onViewDetails?: () => void;
  onSessionClick?: () => void;
  onManageParticipants?: () => void;
  onManageAttendance?: () => void;
  onEdit?: () => void;
}

export function LiveSessionCard({
  session,
  onStart,
  onEnd,
  onCancel,
  onReschedule,
  onViewParticipants,
  onViewAttendance,
  onViewDetails,
  onSessionClick,
  onManageParticipants,
  onManageAttendance,
  onEdit
}: LiveSessionCardProps) {
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
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={onSessionClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {session.title || 'Untitled Session'}
            </CardTitle>
            <CardDescription className="mt-1">
              {session.description || 'No description available'}
            </CardDescription>
          </div>
          <Badge className={`ml-2 ${getStatusColor(session.status)}`}>
            {getStatusIcon(session.status)}
            <span className="ml-1">{session.status.replace('_', ' ')}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{format(new Date(session.scheduledStart), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{format(new Date(session.scheduledStart), 'HH:mm')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{formatDuration(session.duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{session.currentParticipants}/{session.maxParticipants}</span>
          </div>
        </div>

        {/* Instructor Info */}
        {session.instructor && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="w-8 h-8">
              <AvatarImage src={session.instructor.profileImage} />
              <AvatarFallback>
                {session.instructor.firstName?.[0]}{session.instructor.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session.instructor.firstName} {session.instructor.lastName}
              </p>
              {session.instructor.teachingRating && (
                <p className="text-xs text-muted-foreground">
                  ⭐ {session.instructor.teachingRating.toFixed(1)} rating
                </p>
              )}
            </div>
          </div>
        )}

        {/* Session Type & Format */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {session.sessionType || LiveSessionType.CUSTOM}
          </Badge>
          <Badge variant="outline">
            {session.sessionFormat || SessionFormat.ONLINE}
          </Badge>
          {session.topic && (
            <Badge variant="outline">
              {session.topic.name}
            </Badge>
          )}
        </div>

        {/* Price */}
        {session.pricePerPerson && (
          <div className="flex items-center gap-2 text-lg font-semibold">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span>{formatPrice(session.pricePerPerson, session.currency)}</span>
            <span className="text-sm text-muted-foreground font-normal">per person</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {/* Edit Button - Available for scheduled and confirmed sessions */}
          {(session.status === SessionStatus.SCHEDULED || session.status === SessionStatus.CONFIRMED) && onEdit && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onEdit();
              }}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}

          {session.status === SessionStatus.SCHEDULED && onStart && (
            <Button 
              size="sm" 
              onClick={onStart}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Session
            </Button>
          )}

          {session.status === SessionStatus.IN_PROGRESS && onEnd && (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={onEnd}
              className="flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              End Session
            </Button>
          )}

          {session.status === SessionStatus.SCHEDULED && onCancel && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          )}

          {(onViewParticipants || onManageParticipants) && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onManageParticipants || onViewParticipants}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Participants
            </Button>
          )}

          {(onViewAttendance || onManageAttendance) && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onManageAttendance || onViewAttendance}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Attendance
            </Button>
          )}

          {(onViewDetails || onSessionClick) && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onSessionClick || onViewDetails}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Details
            </Button>
          )}
        </div>

        {/* Meeting Link */}
        {session.meetingLink && (
          <div className="pt-2 border-t">
            <Button 
              size="sm" 
              variant="link" 
              className="p-0 h-auto text-blue-600 hover:text-blue-800"
              onClick={() => window.open(session.meetingLink, '_blank')}
            >
              Join Meeting →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
