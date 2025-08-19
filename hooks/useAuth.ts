// hooks/useAuth.ts
import { useEffect } from 'react';
import { useAuthStore, UserRole } from '@/stores/auth.store';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { useLazyQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '@/graphql/queries/user';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, isHydrated, setUser, setLoading } = useAuthStore();
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { isSignedIn, getToken } = useClerkAuth();

  // Use lazy query to fetch user data from GraphQL backend
  const [fetchUserData, { loading: graphqlLoading }] = useLazyQuery(GET_CURRENT_USER, {
    onCompleted: (data) => {
      if (data?.me) {
        console.log('User data fetched from GraphQL:', data.me);
        
        // Convert GraphQL user data to our User format
        const userData = {
          id: data.me.id,
          clerkId: data.me.clerkId,
          email: data.me.email,
          firstName: data.me.firstName || '',
          lastName: data.me.lastName || '',
          profileImage: data.me.profileImage || '',
          role: data.me.role as UserRole, // Use the actual role from backend
          createdAt: data.me.createdAt || new Date().toISOString(),
          updatedAt: data.me.updatedAt || new Date().toISOString(),
        };

        console.log('Setting user in auth store with backend role:', userData);
        setUser(userData);
      }
    },
    onError: (error) => {
      console.error('Failed to fetch user data from GraphQL:', error);
      // Fallback to basic user data if GraphQL fails
      if (clerkUser) {
        const fallbackUserData = {
          id: clerkUser.id,
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          profileImage: clerkUser.imageUrl || '',
          role: UserRole.STUDENT, // Default to STUDENT if GraphQL fails
          createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: clerkUser.updatedAt ? new Date(clerkUser.updatedAt).toISOString() : new Date().toISOString(),
        };
        console.log('Using fallback user data:', fallbackUserData);
        setUser(fallbackUserData);
      }
    },
  });

  useEffect(() => {
    // Wait for Clerk to load
    if (!isClerkLoaded) {
      setLoading(true);
      return;
    }

    // If Clerk user is signed in, fetch user data from GraphQL backend
    if (isSignedIn && clerkUser) {
      console.log('Clerk user authenticated, fetching user data from backend:', clerkUser);
      fetchUserData();
    } else if (!isSignedIn) {
      // User is not signed in, clear auth store
      console.log('Clerk user not authenticated, clearing auth store');
      setUser(null);
    }

    // Set loading to false once Clerk is loaded and GraphQL query is complete
    if (!graphqlLoading) {
      setLoading(false);
    }
  }, [isClerkLoaded, isSignedIn, clerkUser, fetchUserData, graphqlLoading, setUser, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !isHydrated || !isClerkLoaded || graphqlLoading,
    isHydrated,
    error: null,
    getToken, // Expose Clerk's getToken function
  };
};
