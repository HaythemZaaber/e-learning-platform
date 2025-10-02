// components/sessions/LiveSessionCard.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Play, 
  Video,
  X, 
  Edit, 
  Eye,
  UserPlus,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { SessionStatus } from '@/features/sessions/types/session.types';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LiveSessionCardProps {
  session: any;
  onStart?: () => void;
  onEnd?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onManageParticipants?: () => void;
  onViewDetails?: () => void;
}

export function LiveSessionCard({
  session,
  onStart,
  onEnd,
  onCancel,
  onEdit,
  onManageParticipants,
  onViewDetails
}: LiveSessionCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const getStatusConfig = (status: SessionStatus) => {
    const configs = {
      [SessionStatus.SCHEDULED]: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: Calendar,
        label: 'Scheduled'
      },
      [SessionStatus.CONFIRMED]: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: Calendar,
        label: 'Confirmed'
      },
      [SessionStatus.IN_PROGRESS]: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: Video,
        label: 'Live Now',
        pulse: true
      },
      [SessionStatus.COMPLETED]: {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        icon: Clock,
        label: 'Completed'
      },
      [SessionStatus.CANCELLED]: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: X,
        label: 'Cancelled'
      }
    };

    return configs[status] || configs[SessionStatus.SCHEDULED];
  };

  const statusConfig = getStatusConfig(session.status);
  const StatusIcon = statusConfig.icon;

  const handleJoinSession = async () => {
    setIsLoading(true);
    try {
      // Navigate to video call page
      router.push(`/sessions/${session.id}/video-call`);
    } catch (error) {
      console.error('Failed to join session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canStart = session.status === SessionStatus.SCHEDULED || 
                   session.status === SessionStatus.CONFIRMED;
  const isLive = session.status === SessionStatus.IN_PROGRESS;

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {session.title || 'Untitled Session'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {session.description || 'No description'}
            </p>
          </div>
          <Badge className={cn(
            statusConfig.color,
            'shrink-0 flex items-center gap-1'
          )}>
            {(statusConfig as any).pulse && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
            <StatusIcon className="w-3 h-3" />
            <span>{statusConfig.label}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{format(new Date(session.scheduledStart), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{format(new Date(session.scheduledStart), 'HH:mm')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{session.currentParticipants || 0}/{session.maxParticipants}</span>
          </div>
          {session.pricePerPerson && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: session.currency || 'USD',
                }).format(session.pricePerPerson)}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {session.sessionType && (
            <Badge variant="outline" className="text-xs">
              {session.sessionType}
            </Badge>
          )}
          {session.sessionFormat && (
            <Badge variant="outline" className="text-xs">
              {session.sessionFormat}
            </Badge>
          )}
          {session.recordingEnabled && (
            <Badge variant="outline" className="text-xs text-red-600">
              Recording
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {/* Primary Actions */}
          {isLive && (
            <Button 
              className="flex-1"
              onClick={handleJoinSession}
              disabled={isLoading}
            >
              <Video className="w-4 h-4 mr-2" />
              Join Live Session
            </Button>
          )}

          {canStart && onStart && (
            <Button 
              className="flex-1"
              onClick={onStart}
              disabled={isLoading}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          )}

          {/* Secondary Actions */}
          <div className="flex gap-2 w-full">
            {canStart && onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            )}

            {canStart && onCancel && (
              <Button size="sm" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            )}

            {onManageParticipants && (
              <Button size="sm" variant="outline" onClick={onManageParticipants}>
                <UserPlus className="w-4 h-4" />
              </Button>
            )}

            {onViewDetails && (
              <Button size="sm" variant="outline" onClick={onViewDetails}>
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Meeting Link for Quick Access */}
        {session.meetingLink && isLive && (
          <div className="pt-2 border-t">
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-600"
              onClick={() => window.open(session.meetingLink, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open in new tab
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}