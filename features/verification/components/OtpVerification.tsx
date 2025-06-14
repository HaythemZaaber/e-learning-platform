"use client";

import { useState, useEffect, useRef } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  type: "phone" | "email";
  contact: string;
  onVerified: () => void;
  onError?: (error: string) => void;
  maxAttempts?: number;
  otpLength?: number;
  countdownDuration?: number;
}

export function OTPVerification({
  type,
  contact,
  onVerified,
  onError,
  maxAttempts = 3,
  otpLength = 6,
  countdownDuration = 60,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState("");

  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when OTP is sent
  useEffect(() => {
    if (isOtpSent && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOtpSent]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Reset error when user starts typing
  useEffect(() => {
    if (error && otp) {
      setError("");
    }
  }, [otp, error]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0
      ? `${mins}:${secs.toString().padStart(2, "0")}`
      : `${secs}s`;
  };

  const maskContact = (contact: string, type: "phone" | "email") => {
    if (type === "email") {
      const [local, domain] = contact.split("@");
      const maskedLocal =
        local.length > 2
          ? `${local[0]}${"*".repeat(local.length - 2)}${
              local[local.length - 1]
            }`
          : "*".repeat(local.length);
      return `${maskedLocal}@${domain}`;
    } else {
      // Phone number masking
      const digits = contact.replace(/\D/g, "");
      if (digits.length > 4) {
        return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
      }
      return "*".repeat(digits.length);
    }
  };

  const sendOTP = async () => {
    if (isBlocked) {
      toast({
        title: "Too Many Attempts",
        description: "Please wait before requesting another code",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setError("");

    try {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failures
          if (Math.random() < 0.1) {
            reject(new Error("Failed to send OTP. Please try again."));
          } else {
            resolve(true);
          }
        }, 1000);
      });

      setIsOtpSent(true);
      setCountdown(countdownDuration);
      setOtp("");
      toast({
        title: "Code Sent",
        description: `Verification code sent to ${maskContact(contact, type)}`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send verification code";
      setError(errorMessage);
      onError?.(errorMessage);
      toast({
        title: "Send Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== otpLength) {
      const errorMessage = `Please enter a ${otpLength}-digit verification code`;
      setError(errorMessage);
      toast({
        title: "Invalid Code",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate wrong OTP sometimes
          if (otp === "123456" || Math.random() < 0.7) {
            resolve(true);
          } else {
            reject(new Error("Invalid verification code"));
          }
        }, 1500);
      });

      onVerified();
      toast({
        title: "Verification Successful",
        description: `Your ${type} has been verified successfully`,
      });
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        setIsBlocked(true);
        const errorMessage =
          "Maximum verification attempts exceeded. Please request a new code.";
        setError(errorMessage);
        setIsOtpSent(false);
        setOtp("");
        onError?.(errorMessage);
        toast({
          title: "Too Many Attempts",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        const errorMessage = `Invalid code. ${
          maxAttempts - newAttempts
        } attempts remaining.`;
        setError(errorMessage);
        setOtp("");
        onError?.(errorMessage);
        toast({
          title: "Verification Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && otp.length === otpLength && !isVerifying) {
      verifyOTP();
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, otpLength);
    setOtp(value);
  };

  return (
    <div className="space-y-4">
      {!isOtpSent ? (
        <div className="space-y-3">
          <Button
            onClick={sendOTP}
            className="w-full"
            disabled={isSending}
            size="lg"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Verification Code
              </>
            )}
          </Button>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground text-center">
            We'll send a {otpLength}-digit code to {maskContact(contact, type)}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="otp-input" className="text-sm font-medium">
                Enter Verification Code
              </label>
              <Input
                id="otp-input"
                ref={inputRef}
                placeholder={`Enter ${otpLength}-digit code`}
                value={otp}
                onChange={handleOtpChange}
                onKeyPress={handleKeyPress}
                maxLength={otpLength}
                className={`text-center text-lg tracking-widest font-mono ${
                  error ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                disabled={isVerifying}
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                Code sent to {maskContact(contact, type)}
              </p>
              {attempts > 0 && attempts < maxAttempts && (
                <p className="text-xs text-amber-600">
                  {maxAttempts - attempts} attempts remaining
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={verifyOTP}
              disabled={otp.length !== otpLength || isVerifying}
              className="flex-1"
              size="lg"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Code
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={sendOTP}
              disabled={countdown > 0 || isSending}
              className="px-4"
            >
              {countdown > 0 ? (
                <span className="font-mono text-sm">
                  {formatCountdown(countdown)}
                </span>
              ) : isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Resend"
              )}
            </Button>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setIsOtpSent(false);
                setOtp("");
                setError("");
                setAttempts(0);
                setIsBlocked(false);
                setCountdown(0);
              }}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Change {type} address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
