import { signIn, signOut, getSession } from "next-auth/react";

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

const DEFAULT_REDIRECT = "/";

export const authService = {
  // Social login
  async socialLogin(provider: "google" | "github"): Promise<AuthResponse> {
    try {
      const result = await signIn(provider, {
        redirect: true,
        callbackUrl: DEFAULT_REDIRECT,
      });

      if (result?.error) {
        return {
          success: false,
          error: result.error,
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: "Authentication failed",
      };
    }
  },

  // Logout
  async logout(): Promise<AuthResponse> {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/auth/login",
      });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "Logout failed",
      };
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const session = await getSession();
      return {
        success: true,
        data: session,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to get session",
      };
    }
  },
};
