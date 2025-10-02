// providers/StreamVideoProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useAuth } from '@/hooks/useAuth';

interface StreamVideoContextType {
  client: StreamVideoClient | null;
  isReady: boolean;
}

const StreamVideoContext = createContext<StreamVideoContextType>({
  client: null,
  isReady: false
});

export function StreamVideoProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setClient(null);
      setIsReady(false);
      return;
    }

    const initClient = async () => {
      try {
        // This will be set when joining a session
        // For now, we initialize without connection
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize Stream Video client:', error);
        setIsReady(false);
      }
    };

    initClient();

    return () => {
      if (client) {
        client.disconnectUser();
        setClient(null);
      }
    };
  }, [user?.id]);

  return (
    <StreamVideoContext.Provider value={{ client, isReady }}>
      {isReady ? (
        client ? (
          <StreamVideo client={client}>{children}</StreamVideo>
        ) : (
          children
        )
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </StreamVideoContext.Provider>
  );
}

export const useStreamVideoContext = () => useContext(StreamVideoContext);