// hooks/useAuth.ts
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { useAuthStore } from "@/stores/auth.store";
import { GET_CURRENT_USER } from "@/graphql/queries/user";
import { User } from "@/types/userTypes";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean | undefined;
  error: string | null;
  refetchUser: () => void;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const clerkAuth = useClerkAuth();
  const {
    user,
    isLoading: storeLoading,
    isAuthenticated,
    error,
    setUser,
    setLoading,
    setError,
    clearAuth,
  } = useAuthStore();

  // GraphQL query to get current user data
  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(GET_CURRENT_USER, {
    skip: !clerkAuth.isSignedIn,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  // Update store when Clerk auth state changes
  useEffect(() => {
    if (!clerkAuth.isSignedIn) {
      clearAuth();
      return;
    }

    // Set loading state
    setLoading(queryLoading);

    // Handle GraphQL query results
    if (data?.me) {
      setUser(data.me);
    }

    // Handle GraphQL errors
    if (queryError) {
      setError(queryError.message);
    }
  }, [
    clerkAuth.isSignedIn,
    data,
    queryLoading,
    queryError,
    setUser,
    setLoading,
    setError,
    clearAuth,
  ]);

  // Logout function
  const logout = async () => {
    try {
      await clerkAuth.signOut();
      clearAuth();
    } catch (error) {
      console.error("Logout error:", error);
      setError("Failed to logout");
    }
  };

  // Refetch user data
  const refetchUser = () => {
    refetch();
  };

  const isLoading =
    storeLoading || queryLoading || clerkAuth.isLoaded === false;

  return {
    user,
    isLoading,
    isAuthenticated: clerkAuth.isSignedIn && isAuthenticated ,
    error,
    refetchUser,
    logout,
  };
}
