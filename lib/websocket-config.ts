export const WEBSOCKET_CONFIG = {
    // WebSocket server URL - FIXED: Use the correct backend URL
    serverUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  
    // Connection settings
    connection: {
      timeout: 20000,
      transports: ["websocket", "polling"] as const,
      forceNew: true,
    },
  
    // Reconnection settings
    reconnection: {
      maxAttempts: 5,
      initialDelay: 1000,
      maxDelay: 30000,
    },
  
    // Event names
    events: {
      // Client to server
      JOIN_ROOM: "join_room",
      LEAVE_ROOM: "leave_room",
  
      // Server to client
      CONNECTED: "connected",
      NOTIFICATION: "notification",
      SYSTEM_ANNOUNCEMENT: "system_announcement",
      CONNECTION_STATUS: "connectionStatus",
      AUTHENTICATED: "authenticated", // Added this
    },
  
    // Room prefixes
    rooms: {
      USER: "user:",
      COURSE: "course:",
      SESSION: "session:",
      INSTRUCTOR: "instructor:",
    },
  } as const;