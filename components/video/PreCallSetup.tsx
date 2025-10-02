// components/video/PreCallSetup.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Settings,
  Check,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PreCallSetupProps {
  onJoin: (settings: { audioEnabled: boolean; videoEnabled: boolean }) => void;
  userName: string;
  sessionTitle: string;
  isJoining?: boolean;
}

export function PreCallSetup({ 
  onJoin, 
  userName, 
  sessionTitle,
  isJoining = false 
}: PreCallSetupProps) {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Get available devices
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videos = devices.filter(d => d.kind === 'videoinput');
      const audios = devices.filter(d => d.kind === 'audioinput');
      setVideoDevices(videos);
      setAudioDevices(audios);
      if (videos.length > 0) setSelectedVideo(videos[0].deviceId);
      if (audios.length > 0) setSelectedAudio(audios[0].deviceId);
    });

    // Get preview stream
    navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: false 
    }).then(stream => {
      setPreviewStream(stream);
    }).catch(console.error);

    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <Card className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-xl border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">{sessionTitle}</CardTitle>
          <p className="text-gray-400 mt-2">Ready to join?</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Video Preview */}
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {videoEnabled && previewStream ? (
              <video
                ref={(video) => {
                  if (video && previewStream) {
                    video.srcObject = previewStream;
                    video.play();
                  }
                }}
                className="w-full h-full object-cover mirror"
                muted
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Camera is off</p>
                </div>
              </div>
            )}
            
            {/* User name badge */}
            <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-lg">
              <p className="text-white font-medium">{userName}</p>
            </div>

            {/* Quick controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                size="icon"
                variant={audioEnabled ? "secondary" : "destructive"}
                className="rounded-full"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button
                size="icon"
                variant={videoEnabled ? "secondary" : "destructive"}
                className="rounded-full"
                onClick={() => setVideoEnabled(!videoEnabled)}
              >
                {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Device Settings */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Microphone</Label>
              <Select value={selectedAudio} onValueChange={setSelectedAudio}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audioDevices.map(device => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label || 'Microphone'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Camera</Label>
              <Select value={selectedVideo} onValueChange={setSelectedVideo}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {videoDevices.map(device => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label || 'Camera'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Join Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onJoin({ audioEnabled, videoEnabled })}
              disabled={isJoining}
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Join now
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}