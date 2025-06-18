export interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "individual" | "group";
  status: "available" | "pending" | "booked" | "completed";
  capacity: number;
  basePrice: number;
  currentPrice?: number;
  learnerIds?: string[];
  color: string;
}

export interface BookingRequest {
  id: string;
  sessionId: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  sessionDate: Date;
  sessionTime: string;
  sessionType: "individual" | "group";
  offeredPrice: number;
  message: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  createdAt: Date;
  expiresAt: Date;
  paymentStatus?: "awaiting" | "paid" | "expired" | "failed";
  isHighestBid?: boolean;
}

export interface PriceRule {
  id: string;
  sessionType: "individual" | "group";
  basePrice: number;
  minBidPrice: number;
  maxBidPrice: number;
  autoAcceptThreshold: number;
  leadTimeCutoff: number; // hours before session
}

export interface SessionStats {
  pendingRequests: number;
  totalEarnings: number;
  upcomingSessions: number;
  completionRate: number;
  averageBid: number;
  popularTimeSlots: string[];
}

export interface AIInsight {
  type: "demand_prediction" | "pricing_suggestion" | "schedule_optimization";
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

export interface TopicRequest {
  id: string;
  sessionId: string;
  learnerId: string;
  learnerName: string;
  suggestedTopic: string;
  description?: string;
  createdAt: Date;
  priority: number; // 1-5 scale
}

export interface TopicCluster {
  id: string;
  sessionId: string;
  mainTopic: string;
  relatedTopics: string[];
  requestIds: string[];
  confidence: number; // AI clustering confidence 0-1
  learnerCount: number;
}

export interface SessionTopic {
  id: string;
  sessionId: string;
  finalTopic: string;
  status: "pending" | "confirmed" | "rejected";
  confirmedAt?: Date;
  materials?: string[];
  zoomLink?: string;
}

// Update the Session interface to include topic management
export interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "individual" | "group";
  topicType: "fixed" | "flexible"; // NEW: Topic management type
  domain?: string; // NEW: For flexible topics (e.g., "Data Science")
  fixedTopic?: string; // NEW: For fixed topics
  status: "available" | "pending" | "booked" | "completed";
  capacity: number;
  basePrice: number;
  currentPrice?: number;
  learnerIds?: string[];
  color: string;
  topicRequests?: TopicRequest[]; // NEW: Student topic suggestions
  topicClusters?: TopicCluster[]; // NEW: AI-grouped topics
  finalizedTopic?: SessionTopic; // NEW: Confirmed topic details
  topicDeadline?: Date; // NEW: Deadline for topic confirmation
}
