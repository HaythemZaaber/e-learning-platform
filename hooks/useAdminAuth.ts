import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAdminAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Wait for auth loading to complete
      if (isLoading) {
        return;
      }

      // If not authenticated, redirect to sign-in
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to sign-in');
        router.push('/sign-in');
        return;
      }

      // Check if user has admin role
      if (user?.role === 'ADMIN') {
        console.log('User is admin, allowing access');
        setIsAdmin(true);
      } else {
        console.log(`User role is ${user?.role}, redirecting to unauthorized`);
        // Redirect to unauthorized page
        router.push('/unauthorized');
      }
      
      setIsChecking(false);
    };

    checkAdminStatus();
  }, [user, isLoading, isAuthenticated, router]);

  return {
    isAdmin,
    isChecking: isLoading || isChecking,
    user,
    isLoading: isLoading || isChecking
  };
};
