"use client";

import type React from "react";
import { createContext, useContext, useReducer, useCallback } from "react";
import type {
  Session,
  BookingRequest,
  PriceRule,
  SessionStats,
  TopicRequest,
  SessionTopic,
} from "../types/session.types";
import {
  mockSessions,
  mockRequests,
  mockPriceRules,
  mockStats,
} from "../data/session-data";

interface SessionsState {
  sessions: Session[];
  requests: BookingRequest[];
  priceRules: PriceRule[];
  stats: SessionStats;
  selectedDate: Date;
  viewMode: "month" | "week" | "day";
  isRequestsDrawerOpen: boolean;
  isPriceRulesModalOpen: boolean;
}

type SessionsAction =
  | { type: "SET_SESSIONS"; payload: Session[] }
  | { type: "ADD_SESSION"; payload: Session }
  | {
      type: "UPDATE_SESSION";
      payload: { id: string; updates: Partial<Session> };
    }
  | { type: "DELETE_SESSION"; payload: string }
  | { type: "SET_REQUESTS"; payload: BookingRequest[] }
  | {
      type: "UPDATE_REQUEST";
      payload: { id: string; updates: Partial<BookingRequest> };
    }
  | {
      type: "BULK_UPDATE_REQUESTS";
      payload: { ids: string[]; updates: Partial<BookingRequest> };
    }
  | { type: "SET_SELECTED_DATE"; payload: Date }
  | { type: "SET_VIEW_MODE"; payload: "month" | "week" | "day" }
  | { type: "TOGGLE_REQUESTS_DRAWER" }
  | { type: "TOGGLE_PRICE_RULES_MODAL" }
  | { type: "UPDATE_STATS"; payload: Partial<SessionStats> };

const initialState: SessionsState = {
  sessions: mockSessions,
  requests: mockRequests,
  priceRules: mockPriceRules,
  stats: mockStats,
  selectedDate: new Date(),
  viewMode: "month",
  isRequestsDrawerOpen: false,
  isPriceRulesModalOpen: false,
};

function sessionsReducer(
  state: SessionsState,
  action: SessionsAction
): SessionsState {
  switch (action.type) {
    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };
    case "ADD_SESSION":
      return { ...state, sessions: [...state.sessions, action.payload] };
    case "UPDATE_SESSION":
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === action.payload.id
            ? { ...session, ...action.payload.updates }
            : session
        ),
      };
    case "DELETE_SESSION":
      return {
        ...state,
        sessions: state.sessions.filter(
          (session) => session.id !== action.payload
        ),
      };
    case "SET_REQUESTS":
      return { ...state, requests: action.payload };
    case "UPDATE_REQUEST":
      return {
        ...state,
        requests: state.requests.map((request) =>
          request.id === action.payload.id
            ? { ...request, ...action.payload.updates }
            : request
        ),
      };
    case "BULK_UPDATE_REQUESTS":
      return {
        ...state,
        requests: state.requests.map((request) =>
          action.payload.ids.includes(request.id)
            ? { ...request, ...action.payload.updates }
            : request
        ),
      };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "TOGGLE_REQUESTS_DRAWER":
      return { ...state, isRequestsDrawerOpen: !state.isRequestsDrawerOpen };
    case "TOGGLE_PRICE_RULES_MODAL":
      return { ...state, isPriceRulesModalOpen: !state.isPriceRulesModalOpen };
    case "UPDATE_STATS":
      return { ...state, stats: { ...state.stats, ...action.payload } };
    default:
      return state;
  }
}

const SessionsContext = createContext<{
  state: SessionsState;
  dispatch: React.Dispatch<SessionsAction>;
  actions: {
    acceptRequest: (requestId: string) => Promise<void>;
    rejectRequest: (requestId: string) => Promise<void>;
    bulkUpdateRequests: (
      ids: string[],
      updates: Partial<BookingRequest>
    ) => void;
    createSession: (session: Omit<Session, "id">) => void;
    updateSession: (id: string, updates: Partial<Session>) => void;
    simulatePayment: (requestId: string) => Promise<void>;
    submitTopicRequest: (
      sessionId: string,
      request: Omit<TopicRequest, "id" | "createdAt">
    ) => Promise<void>;
    finalizeSessionTopic: (
      sessionId: string,
      finalTopic: string
    ) => Promise<void>;
  };
} | null>(null);

export function SessionsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(sessionsReducer, initialState);

  const acceptRequest = useCallback(async (requestId: string) => {
    // TODO: Integrate with backend API
    dispatch({
      type: "UPDATE_REQUEST",
      payload: {
        id: requestId,
        updates: { status: "accepted", paymentStatus: "awaiting" },
      },
    });

    // Simulate payment processing
    setTimeout(() => {
      dispatch({
        type: "UPDATE_REQUEST",
        payload: {
          id: requestId,
          updates: { paymentStatus: "paid" },
        },
      });
    }, 2000);
  }, []);

  const rejectRequest = useCallback(async (requestId: string) => {
    // TODO: Integrate with backend API
    dispatch({
      type: "UPDATE_REQUEST",
      payload: {
        id: requestId,
        updates: { status: "rejected" },
      },
    });
  }, []);

  const bulkUpdateRequests = useCallback(
    (ids: string[], updates: Partial<BookingRequest>) => {
      dispatch({
        type: "BULK_UPDATE_REQUESTS",
        payload: { ids, updates },
      });
    },
    []
  );

  const createSession = useCallback((session: Omit<Session, "id">) => {
    const newSession: Session = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    dispatch({ type: "ADD_SESSION", payload: newSession });
  }, []);

  const updateSession = useCallback((id: string, updates: Partial<Session>) => {
    dispatch({ type: "UPDATE_SESSION", payload: { id, updates } });
  }, []);

  const simulatePayment = useCallback(async (requestId: string) => {
    // TODO: Integrate with Stripe API
    dispatch({
      type: "UPDATE_REQUEST",
      payload: {
        id: requestId,
        updates: { paymentStatus: "awaiting" },
      },
    });

    // Simulate Stripe checkout process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    dispatch({
      type: "UPDATE_REQUEST",
      payload: {
        id: requestId,
        updates: { paymentStatus: "paid" },
      },
    });
  }, []);

  const actions = {
    acceptRequest,
    rejectRequest,
    bulkUpdateRequests,
    createSession,
    updateSession,
    simulatePayment,
    submitTopicRequest: useCallback(
      async (
        sessionId: string,
        request: Omit<TopicRequest, "id" | "createdAt">
      ) => {
        // TODO: Integrate with backend API
        const newRequest: TopicRequest = {
          ...request,
          id: `topic_req_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          createdAt: new Date(),
        };

        // Add request to session
        dispatch({
          type: "UPDATE_SESSION",
          payload: {
            id: sessionId,
            updates: {
              topicRequests: [
                ...(state.sessions.find((s) => s.id === sessionId)
                  ?.topicRequests || []),
                newRequest,
              ],
            },
          },
        });

        // TODO: Trigger AI clustering analysis
        console.log("Triggering AI topic clustering for session:", sessionId);
      },
      [state.sessions]
    ),

    finalizeSessionTopic: useCallback(
      async (sessionId: string, finalTopic: string) => {
        // TODO: Integrate with backend API
        const sessionTopic: SessionTopic = {
          id: `topic_${Date.now()}`,
          sessionId,
          finalTopic,
          status: "confirmed",
          confirmedAt: new Date(),
          zoomLink: `https://zoom.us/j/${Math.random()
            .toString()
            .substr(2, 10)}`,
          materials: [], // TODO: Generate AI-suggested materials
        };

        dispatch({
          type: "UPDATE_SESSION",
          payload: {
            id: sessionId,
            updates: {
              finalizedTopic: sessionTopic,
              status: "booked",
              title: finalTopic,
            },
          },
        });

        // TODO: Process payments and send notifications
        console.log(
          "Processing payments and sending confirmations for session:",
          sessionId
        );
      },
      []
    ),
  };

  return (
    <SessionsContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error("useSessions must be used within a SessionsProvider");
  }
  return context;
}
