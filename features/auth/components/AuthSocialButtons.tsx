"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";


export function AuthSocialButtons() {
  const handleGoogleSignIn = async () => {
    // TODO: Implement Google sign in
  };

  const handleGithubSignIn = async () => {
    // TODO: Implement GitHub sign in
  };

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <Button
        // variant="outline"
        onClick={handleGoogleSignIn}
    className="w-full text-white bg-back/40 backdrop-blur-2xl"
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>

      <Button
        // variant="outline"
        onClick={handleGithubSignIn}
        className="w-full text-white bg-back/40 backdrop-blur-2xl"
      >
        <Icons.gitHub className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
} 