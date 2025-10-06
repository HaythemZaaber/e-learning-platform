import { io, Socket } from "socket.io-client";
import {
  WebSocketNotification,
  WebSocketConnectionStatus,
} from "@/types/notificationTypes";
import { WEBSOCKET_CONFIG } from "@/lib/websocket-config";

class WebSocketService {
  private socket: Socket | null = null;
  private connectionStatus: WebSocketConnectionStatus = {
    connected: false,
    reconnectAttempts: 0,
  };
  private listeners: Map<string, Set<Function>> = new Map();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private tokenProvider?: () => Promise<string | null>;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === "clerk-session-token" && e.newValue) {
          this.reconnect();
        }
      });
    }
  }

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.disconnect();

        const serverUrl = WEBSOCKET_CONFIG.serverUrl || "http://localhost:3001";

        console.log(`Connecting to WebSocket server: ${serverUrl}`);
        console.log(`Using token: ${token.substring(0, 20)}...`);

        // Validate token format
        if (!token || token.length < 10) {
          throw new Error("Invalid token: Token is too short or empty");
        }

        this.socket = io(serverUrl, {
          auth: {
            token,
          },
          transports: ["websocket", "polling"],
          timeout: 20000,
          forceNew: true,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
        });

        this.socket.on("connect", () => {
          console.log("✅ WebSocket connected successfully");
          console.log("Socket ID:", this.socket?.id);

          this.connectionStatus = {
            connected: true,
            socketId: this.socket?.id,
            lastConnected: new Date().toISOString(),
            reconnectAttempts: 0,
          };
          this.reconnectDelay = 1000;
          this.dispatch("connectionStatus", this.connectionStatus);

          // Set a timeout for authentication - if we don't get 'connected' event within 5 seconds, something's wrong
          const authTimeout = setTimeout(() => {
            console.error(
              "🔐 Authentication timeout - server didn't respond to token"
            );
            this.connectionStatus.connected = false;
            this.dispatch("connectionStatus", this.connectionStatus);
            reject(new Error("Authentication timeout"));
          }, 5000);

          // Clear timeout when we get authenticated
          this.socket?.on("connected", () => {
            clearTimeout(authTimeout);
          });

          resolve();
        });

        this.socket.on("disconnect", (reason) => {
          console.log("❌ WebSocket disconnected:", reason);
          this.connectionStatus.connected = false;
          this.dispatch("connectionStatus", this.connectionStatus);

          if (reason !== "io client disconnect") {
            this.scheduleReconnect();
          }
        });

        this.socket.on("connect_error", (error) => {
          console.error("❌ WebSocket connection error:", error.message);
          console.error("Error details:", error);

          // Check if it's an authentication error
          if (
            error.message?.includes("token") ||
            error.message?.includes("auth") ||
            error.message?.includes("unauthorized")
          ) {
            console.error(
              "🔐 Authentication failed - token may be invalid or expired"
            );
            console.error("Token used:", token.substring(0, 20) + "...");
          }

          this.connectionStatus.connected = false;
          this.dispatch("connectionStatus", this.connectionStatus);
          reject(error);
        });

        this.socket.on("error", (error) => {
          console.error("❌ WebSocket error event:", error);
        });

        this.socket.on("connected", (data) => {
          console.log("✅ WebSocket authenticated:", data);
          this.connectionStatus.userId = data.userId;
          this.dispatch("authenticated", data);

          // Auto-join user personal room to receive real-time notifications
          if (this.socket && data?.userId) {
            const userRoom = `${WEBSOCKET_CONFIG.rooms.USER}${data.userId}`;
            console.log(`🏠 Auto-joining user room: ${userRoom}`);
            this.socket.emit(WEBSOCKET_CONFIG.events.JOIN_ROOM, userRoom);
          }
        });

        this.socket.on(
          "notification",
          (notification: WebSocketNotification) => {
            console.log("🔔 Received notification:", notification);
            this.dispatch("notification", notification);
          }
        );

        this.socket.on(
          "system_announcement",
          (announcement: WebSocketNotification) => {
            console.log("📢 Received system announcement:", announcement);
            this.dispatch("systemAnnouncement", announcement);
          }
        );

        this.socket.on("reconnect", (attemptNumber) => {
          console.log(
            "✅ WebSocket reconnected after",
            attemptNumber,
            "attempts"
          );
          this.connectionStatus.connected = true;
          this.connectionStatus.reconnectAttempts = 0;
          this.dispatch("connectionStatus", this.connectionStatus);
        });

        this.socket.on("reconnect_error", (error) => {
          console.error("❌ WebSocket reconnection error:", error);
          this.connectionStatus.reconnectAttempts++;
          this.dispatch("connectionStatus", this.connectionStatus);
        });

        this.socket.on("reconnect_failed", () => {
          console.error("❌ WebSocket reconnection failed");
          this.connectionStatus.connected = false;
          this.dispatch("connectionStatus", this.connectionStatus);
        });

        // Debug: Log all events
        this.socket.onAny((eventName, ...args) => {
          console.log(`📨 WebSocket event received: ${eventName}`, args);
        });
      } catch (error) {
        console.error("❌ Failed to create WebSocket connection:", error);
        reject(error);
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.connectionStatus.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.connectionStatus.reconnectAttempts++;
      console.log(
        `🔄 Attempting to reconnect (${this.connectionStatus.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      this.reconnect();
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
    }, this.reconnectDelay);
  }

  private async reconnect() {
    try {
      const token = await this.getAuthToken();
      if (token) {
        await this.connect(token);
      }
    } catch (error) {
      console.error("Reconnection failed:", error);
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      if (this.tokenProvider) {
        return await this.tokenProvider();
      }
    } catch (error) {
      console.error("Failed to get auth token:", error);
    }
    return null;
  }

  setTokenProvider(provider: () => Promise<string | null>) {
    this.tokenProvider = provider;
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.connectionStatus = {
      connected: false,
      reconnectAttempts: 0,
    };
    this.dispatch("connectionStatus", this.connectionStatus);
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  private dispatch(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in event listener:", error);
        }
      });
    }
  }

  getConnectionStatus(): WebSocketConnectionStatus {
    return { ...this.connectionStatus };
  }

  isConnected(): boolean {
    return this.connectionStatus.connected && this.socket?.connected === true;
  }

  joinRoom(room: string) {
    if (this.socket && this.isConnected()) {
      console.log(`Joining room: ${room}`);
      this.socket.emit("join_room", room);
    }
  }

  leaveRoom(room: string) {
    if (this.socket && this.isConnected()) {
      console.log(`Leaving room: ${room}`);
      this.socket.emit("leave_room", room);
    }
  }

  emit(event: string, data: any) {
    if (this.socket && this.isConnected()) {
      this.socket.emit(event, data);
    }
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
