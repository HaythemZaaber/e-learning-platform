import React from 'react';
import { MainVerification } from '@/features/becomeInstructor/verification/components/MainVerification';

export default function InstructorVerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="container mx-auto py-10 sm:w-[90%] ">
       
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instructor Verification
            </h1>
            <p className="text-gray-600">
              Complete your instructor application to start teaching on our platform
            </p>
          </div>
          
          <MainVerification />
        
      </div>
    </div>
  );
}
