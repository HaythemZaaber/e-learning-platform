// components/video/VideoChatPanel.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCall } from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Smile } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  message: string;
  timestamp: Date;
}

export function VideoChatPanel() {
  const call = useCall();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim() || !call || !user) return;

    const chatMessage: ChatMessage = {
      id: Math.random().toString(36),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userImage: user.profileImage,
      message: message.trim(),
      timestamp: new Date()
    };

    try {
      await call.sendCustomEvent({
        type: 'chat_message',
        ...chatMessage
      });

      setMessages(prev => [...prev, chatMessage]);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Listen for chat messages
  useEffect(() => {
    if (!call) return;

    const handleCustomEvent = (event: any) => {
      if (event.type === 'chat_message') {
        const newMessage: ChatMessage = {
          id: event.id,
          userId: event.userId,
          userName: event.userName,
          userImage: event.userImage,
          message: event.message,
          timestamp: new Date(event.timestamp)
        };
        
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      }
    };

    call.on('custom', handleCustomEvent);

    return () => {
      call.off('custom', handleCustomEvent);
    };
  }, [call]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-300 mt-8">
              <p className="text-sm text-white">No messages yet</p>
              <p className="text-xs mt-1 text-gray-300">Be the first to say something!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src={msg.userImage} />
                  <AvatarFallback className="bg-gray-700 text-white text-xs">
                    {msg.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-white text-sm truncate">
                      {msg.userName}
                    </span>
                    <span className="text-xs text-gray-300">
                      {format(msg.timestamp, 'HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-white break-words">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Send a message..."
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-blue-500"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={!message.trim()}
            className="shrink-0 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}