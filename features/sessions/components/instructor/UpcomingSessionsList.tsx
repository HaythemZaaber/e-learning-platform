"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface UpcomingSessionsListProps {
  sessions: any[];
  isLoading: boolean;
  onSessionClick?: (session: any) => void;
}

export function UpcomingSessionsList({ 
  sessions, 
  isLoading, 
  onSessionClick 
}: UpcomingSessionsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium">No upcoming sessions</p>
        <p className="text-sm">You don't have any sessions scheduled for the next 7 days.</p>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-3">
      {sessions.slice(0, 5).map((session) => (
        <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.instructor?.profileImage} />
                    <AvatarFallback>
                      {session.instructor?.firstName?.[0]}{session.instructor?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">
                      {session.title || 'Untitled Session'}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.instructor?.firstName} {session.instructor?.lastName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(session.scheduledStart), 'MMM dd')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(session.scheduledStart), 'HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(session.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{session.currentParticipants}/{session.maxParticipants}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {session.sessionType || 'Custom'}
                  </Badge>
                  {session.pricePerPerson && (
                    <Badge variant="secondary" className="text-xs">
                      ${session.pricePerPerson}
                    </Badge>
                  )}
                </div>
              </div>

              {onSessionClick && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSessionClick(session)}
                  className="ml-2"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {sessions.length > 5 && (
        <div className="text-center pt-2">
          <Button variant="outline" size="sm">
            View All ({sessions.length} sessions)
          </Button>
        </div>
      )}
    </div>
  );
}
