"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormInput } from "@/components/shared/FormInput";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { FormButton } from "@/components/shared/FormButton";
import { AuthSocialButtons } from "./AuthSocialButtons";
import { AuthFormContainer } from "./AuthFormContainer";

export const SignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
    setIsLoading(true);

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual signup logic here
      // const response = await signup(formData);
      router.push("/auth/login?signup=success");
    } catch (error) {
      setAuthError("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormContainer
      title="Create Account"
      subtitle="Sign up to get started with your learning journey"
    >
      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Full Name"
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

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

        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <FormButton type="submit" isLoading={isLoading} className="w-full">
          Sign up
        </FormButton>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-black/50 via-black to-black/50 font-semibold  text-white ">
              Or continue with
            </span>
          </div>
        </div>

        <AuthSocialButtons />
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm ">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthFormContainer>
  );
};
