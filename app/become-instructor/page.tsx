"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useApolloClient } from "@apollo/client";
import { GET_INSTRUCTOR_VERIFICATION } from "@/features/becomeInstructor/verification/graphql/instructor-application";
import BecomeInstructorLandingPage from "@/features/becomeInstructor/landingPage/BecomeInstructorLandingPage";

export default function Page() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const client = useApolloClient();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!authLoading && isAuthenticated && user?.id) {
        try {
          const { data } = await client.query({
            query: GET_INSTRUCTOR_VERIFICATION,
            variables: { userId: user.id },
            fetchPolicy: 'network-only',
          });

          if (data?.getInstructorVerification?.success && data?.getInstructorVerification?.data) {
            // Application exists, redirect to verification page
            router.push('/become-instructor/verification');
            return;
          }
        } catch (error) {
          console.error('Error checking existing application:', error);
        }
      }
      setIsChecking(false);
    };

    checkExistingApplication();
  }, [user?.id, authLoading, isAuthenticated, client, router]);

  if (authLoading || isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Checking application status...</p>
        </div>
      </div>
    );
  }

  return <BecomeInstructorLandingPage />;
}
