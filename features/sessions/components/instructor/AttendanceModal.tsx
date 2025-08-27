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
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MinusCircle,
  BarChart3,
  Video,
  Mic,
  MessageSquare,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  attendance: any[];
  onUpdateAttendance: (sessionId: string, userId: string, attendanceData: any) => void;
}

export function AttendanceModal({
  isOpen,
  onClose,
  session,
  attendance,
  onUpdateAttendance,
}: AttendanceModalProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateAttendance = async (userId: string, updates: any) => {
    if (!session?.id) return;

    setUpdatingId(userId);
    try {
      await onUpdateAttendance(session.id, userId, updates);
    } catch (error) {
      console.error('Failed to update attendance:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'PARTIAL':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-4 h-4" />;
      case 'ABSENT':
        return <XCircle className="w-4 h-4" />;
      case 'LATE':
        return <Clock className="w-4 h-4" />;
      case 'PARTIAL':
        return <MinusCircle className="w-4 h-4" />;
      default:
        return <MinusCircle className="w-4 h-4" />;
    }
  };

  const calculateEngagementScore = (metrics: any) => {
    if (!metrics) return 0;
    
    const totalTime = session?.duration || 60; // in minutes
    const cameraScore = (metrics.cameraOnTime || 0) / totalTime * 100;
    const micScore = (metrics.micActiveTime || 0) / totalTime * 100;
    const chatScore = Math.min((metrics.chatMessages || 0) * 10, 100); // 10 points per message, max 100
    const questionsScore = Math.min((metrics.questionsAsked || 0) * 20, 100); // 20 points per question, max 100
    
    return Math.round((cameraScore + micScore + chatScore + questionsScore) / 4);
  };

  if (!session) return null;

  const totalParticipants = attendance?.length || 0;
  const presentCount = attendance?.filter(a => a.status === 'PRESENT').length || 0;
  const absentCount = attendance?.filter(a => a.status === 'ABSENT').length || 0;
  const lateCount = attendance?.filter(a => a.status === 'LATE').length || 0;
  const attendanceRate = totalParticipants > 0 ? (presentCount / totalParticipants) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Session Attendance & Engagement
          </DialogTitle>
          <DialogDescription>
            Track attendance and engagement metrics for "{session.title || 'Untitled Session'}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">Session Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Date:</span>
                <span className="ml-2">
                  {new Date(session.scheduledStart).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <span className="ml-2">{session.duration} minutes</span>
              </div>
              <div>
                <span className="text-muted-foreground">Participants:</span>
                <span className="ml-2">{totalParticipants}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="ml-2">
                  {session.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Attendance Summary
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                <div className="text-sm text-green-800">Present</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                <div className="text-sm text-red-800">Absent</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
                <div className="text-sm text-yellow-800">Late</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{Math.round(attendanceRate)}%</div>
                <div className="text-sm text-blue-800">Attendance Rate</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Attendance Rate</span>
                <span>{Math.round(attendanceRate)}%</span>
              </div>
              <Progress value={attendanceRate} className="h-2" />
            </div>
          </div>

          {/* Attendance List */}
          <div className="space-y-4">
            <h4 className="font-medium">Individual Attendance</h4>
            
            {!attendance || attendance.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No attendance data available</p>
                <p className="text-sm">Attendance will be tracked once the session starts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendance.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 border rounded-lg space-y-4"
                  >
                    {/* Participant Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={record.participant?.profileImage} />
                          <AvatarFallback>
                            {record.participant?.firstName?.[0]}{record.participant?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {record.participant?.firstName} {record.participant?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {record.participant?.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getAttendanceStatusColor(record.status)}>
                          {getAttendanceStatusIcon(record.status)}
                          <span className="ml-1">{record.status}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Attendance Controls */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Status</Label>
                        <Select
                          value={record.status || 'UNKNOWN'}
                          onValueChange={(value) => handleUpdateAttendance(record.participantId, { status: value })}
                          disabled={updatingId === record.participantId}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PRESENT">Present</SelectItem>
                            <SelectItem value="ABSENT">Absent</SelectItem>
                            <SelectItem value="LATE">Late</SelectItem>
                            <SelectItem value="PARTIAL">Partial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Join Time</Label>
                        <Input
                          type="time"
                          value={record.joinedAt ? new Date(record.joinedAt).toTimeString().slice(0, 5) : ''}
                          onChange={(e) => handleUpdateAttendance(record.participantId, { 
                            joinedAt: e.target.value ? new Date(session.scheduledStart).toDateString() + ' ' + e.target.value : null 
                          })}
                          disabled={updatingId === record.participantId}
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Leave Time</Label>
                        <Input
                          type="time"
                          value={record.leftAt ? new Date(record.leftAt).toTimeString().slice(0, 5) : ''}
                          onChange={(e) => handleUpdateAttendance(record.participantId, { 
                            leftAt: e.target.value ? new Date(session.scheduledStart).toDateString() + ' ' + e.target.value : null 
                          })}
                          disabled={updatingId === record.participantId}
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Total Time (min)</Label>
                        <Input
                          type="number"
                          value={record.totalTime || 0}
                          onChange={(e) => handleUpdateAttendance(record.participantId, { 
                            totalTime: parseInt(e.target.value) || 0 
                          })}
                          disabled={updatingId === record.participantId}
                          className="text-xs"
                        />
                      </div>
                    </div>

                    {/* Engagement Metrics */}
                    {record.engagementMetrics && (
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium">Engagement Metrics</h5>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <Video className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                            <div className="text-xs font-medium">{record.engagementMetrics.cameraOnTime || 0} min</div>
                            <div className="text-xs text-muted-foreground">Camera</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <Mic className="w-4 h-4 mx-auto mb-1 text-green-600" />
                            <div className="text-xs font-medium">{record.engagementMetrics.micActiveTime || 0} min</div>
                            <div className="text-xs text-muted-foreground">Microphone</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <MessageSquare className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                            <div className="text-xs font-medium">{record.engagementMetrics.chatMessages || 0}</div>
                            <div className="text-xs text-muted-foreground">Chat Messages</div>
                          </div>
                          <div className="text-center p-2 bg-orange-50 rounded">
                            <HelpCircle className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                            <div className="text-xs font-medium">{record.engagementMetrics.questionsAsked || 0}</div>
                            <div className="text-xs text-muted-foreground">Questions</div>
                          </div>
                          <div className="text-center p-2 bg-indigo-50 rounded">
                            <BarChart3 className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                            <div className="text-xs font-medium">{calculateEngagementScore(record.engagementMetrics)}%</div>
                            <div className="text-xs text-muted-foreground">Engagement</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {updatingId === record.participantId && (
                      <div className="flex items-center justify-center py-2">
                        <LoadingSpinner className="w-4 h-4 mr-2" />
                        <span className="text-sm text-muted-foreground">Updating...</span>
                      </div>
                    )}
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
