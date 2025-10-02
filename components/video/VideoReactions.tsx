'use client';

import React, { useEffect, useState } from 'react';
import { useCall } from '@stream-io/video-react-sdk';

interface Reaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

export function VideoReactions() {
  const call = useCall();
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    if (!call) return;

    const handleReaction = (event: any) => {
      if (event.type === 'reaction') {
        const newReaction: Reaction = {
          id: Math.random().toString(36),
          emoji: event.emoji,
          x: Math.random() * 80 + 10, // Random x between 10-90%
          y: 100
        };

        setReactions(prev => [...prev, newReaction]);

        // Remove reaction after animation
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== newReaction.id));
        }, 3000);
      }
    };

    call.on('custom', handleReaction);

    return () => {
      call.off('custom', handleReaction);
    };
  }, [call]);

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {reactions.map((reaction) => (
        <div
          key={reaction.id}
          className="absolute text-4xl animate-float-up"
          style={{
            left: `${reaction.x}%`,
            bottom: `${reaction.y}%`,
            animation: 'float-up 3s ease-out forwards'
          }}
        >
          {reaction.emoji}
        </div>
      ))}
    </div>
  );
}