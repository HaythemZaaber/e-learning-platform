"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { FormInput } from "@/components/shared/FormInput";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { FormButton } from "@/components/shared/FormButton";
import { AuthFormContainer } from "./AuthFormContainer";
import { AuthSocialButtons } from "./AuthSocialButtons";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (authError) setAuthError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // try {
    //   loginSchema.parse(formData);
    //   setErrors({});
    //   setIsLoading(true);

    //   // const result = await signIn("credentials", {
    //   //   redirect: false,
    //   //   ...formData,
    //   // });

    //   // if (result?.error) {
    //   //   setAuthError("Invalid email or password");
    //   // } else {
    //   //   router.push("/dashboard");
    //   // }
    // } catch (error) {
    //   // Handle validation errors
    //   if (error instanceof z.ZodError) {
    //     const newErrors: Record<string, string> = {};
    //     error.errors.forEach((err) => {
    //       if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
    //     });
    //     setErrors(newErrors);
    //   } else {
    //     setAuthError("An unexpected error occurred");
    //   }
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <AuthFormContainer
      title="Log In"
      subtitle="Enter your credentials to access your account"
    >
      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm ">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <FormButton type="submit" isLoading={isLoading} className="w-full">
          Log in
        </FormButton>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm ">
            <span className="px-2 py-1 rounded-full bg-black/50 font-semibold text-white ">
              Or continue with
            </span>
          </div>
        </div>

        <AuthSocialButtons />
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm ">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthFormContainer>
  );
};
