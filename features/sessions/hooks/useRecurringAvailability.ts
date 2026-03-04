import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ============================================================================
// RECURRING AVAILABILITY RULES
// ============================================================================

export function useRecurringAvailabilityRules(instructorId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["recurring-availability-rules", instructorId],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(
        `${API_BASE}/recurring-availability/rules?instructorId=${instructorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch recurring rules");
      return response.json();
    },
    enabled: !!instructorId,
  });
}

export function useCreateRecurringRule() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      instructorId: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      startDate: string;
      endDate?: string;
      minAdvanceHours?: number;
      bufferMinutes?: number;
      timezone?: string;
    }) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/recurring-availability/rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create recurring rule");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["recurring-availability-rules", variables.instructorId],
      });
    },
  });
}

export function useUpdateRecurringRule() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      dayOfWeek?: number;
      startTime?: string;
      endTime?: string;
      isActive?: boolean;
      minAdvanceHours?: number;
      bufferMinutes?: number;
    }) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/recurring-availability/rules/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update recurring rule");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-availability-rules"] });
    },
  });
}

export function useDeleteRecurringRule() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/recurring-availability/rules/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete recurring rule");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-availability-rules"] });
    },
  });
}

// ============================================================================
// DATE OVERRIDES
// ============================================================================

export function useDateOverrides(instructorId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["date-overrides", instructorId],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(
        `${API_BASE}/recurring-availability/overrides?instructorId=${instructorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch date overrides");
      return response.json();
    },
    enabled: !!instructorId,
  });
}

export function useCreateDateOverride() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      instructorId: string;
      specificDate: string;
      overrideType: "BLOCK" | "MODIFY";
      startTime?: string;
      endTime?: string;
      reason?: string;
    }) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/recurring-availability/overrides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create date override");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["date-overrides", variables.instructorId],
      });
    },
  });
}

export function useUpdateDateOverride() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      overrideType?: "BLOCK" | "MODIFY";
      startTime?: string;
      endTime?: string;
      reason?: string;
    }) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/recurring-availability/overrides/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update date override");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["date-overrides"] });
    },
  });
}

export function useDeleteDateOverride() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/recurring-availability/overrides/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete date override");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["date-overrides"] });
    },
  });
}
