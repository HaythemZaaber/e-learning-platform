import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useGroupInstances(offeringId?: string, instructorId?: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["group-instances", offeringId, instructorId],
    queryFn: async () => {
      const token = await getToken().catch(() => null);
      const params = new URLSearchParams();
      if (offeringId) params.append("offeringId", offeringId);
      if (instructorId) params.append("instructorId", instructorId);
      params.append("status", "SCHEDULED,CONFIRMED");

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE}/group-instances?${params.toString()}`,
        { headers }
      );
      if (!response.ok) throw new Error("Failed to fetch group instances");
      return response.json();
    },
    enabled: !!(offeringId || instructorId),
  });
}

export function useCreateGroupInstance() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      offeringId: string;
      instructorId: string;
      scheduledStart: string;
      scheduledEnd: string;
      timezone?: string;
      isPublic?: boolean;
      isBookable?: boolean;
    }) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/group-instances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create group instance");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["group-instances", variables.offeringId],
      });
      queryClient.invalidateQueries({
        queryKey: ["group-instances", undefined, variables.instructorId],
      });
    },
  });
}

export function useUpdateGroupInstance() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      scheduledStart?: string;
      scheduledEnd?: string;
      isPublic?: boolean;
      isBookable?: boolean;
      status?: string;
    }) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/group-instances/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update group instance");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-instances"] });
    },
  });
}

export function useDeleteGroupInstance() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/group-instances/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete group instance");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-instances"] });
    },
  });
}

export function useCheckAutoCancel() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (instanceId: string) => {
      const token = await getToken();
      const response = await fetch(
        `${API_BASE}/group-instances/${instanceId}/check-auto-cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to check auto-cancel");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-instances"] });
    },
  });
}
