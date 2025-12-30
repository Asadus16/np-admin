"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getRedirectPathForUser } from "@/lib/auth";
import { ConfirmationResult } from "@/lib/firebase";

interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, sendPhoneOTP, verifyPhoneOTP } = useAuth();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  
  // Email login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Phone login state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  
  // Shared state
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[^\d+]/g, "");
    return cleaned.replace(/\+/g, "").length >= 10;
  };

  const formatPhoneNumber = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, "");
    if (cleaned && !cleaned.startsWith("+")) {
      cleaned = "+" + cleaned;
    }
    return cleaned;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      const user = await login({ email, password });
      const redirectPath = getRedirectPathForUser(user);
      console.log("Login successful, redirecting to:", redirectPath, "User:", user);
      router.push(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      const apiError = error as ApiError;
      if (apiError && typeof apiError === 'object' && 'message' in apiError) {
        if (apiError.status === 401) {
          setGeneralError("Invalid email or password");
        } else if (apiError.errors) {
          if (apiError.errors.email) {
            setEmailError(apiError.errors.email[0]);
          }
          if (apiError.errors.password) {
            setPasswordError(apiError.errors.password[0]);
          }
          if (!apiError.errors.email && !apiError.errors.password) {
            setGeneralError(apiError.message);
          }
        } else {
          setGeneralError(apiError.message);
        }
      } else if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setGeneralError("");

    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (!formattedPhone || formattedPhone === "+") {
      setPhoneError("Phone number is required");
      return;
    }

    if (!validatePhone(formattedPhone)) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendPhoneOTP(formattedPhone);
      setConfirmationResult(result.confirmationResult);
      setPhoneStep("otp");
      setCountdown(60);
      setGeneralError("");
    } catch (error) {
      console.error("Send OTP error:", error);
      
      // Check for Firebase billing error
      if (error instanceof Error && error.message.includes('billing-not-enabled')) {
        setGeneralError("Phone authentication is currently unavailable. Please contact support or use email login.");
      } else {
        const apiError = error as ApiError;
        if (apiError && typeof apiError === 'object' && 'message' in apiError) {
          setGeneralError(apiError.message || "Failed to send OTP. Please try again.");
        } else if (error instanceof Error) {
          setGeneralError(error.message);
        } else {
          setGeneralError("Failed to send OTP. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setGeneralError("");

    if (!otp || otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      setGeneralError("Session expired. Please start over.");
      setPhoneStep("phone");
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const user = await verifyPhoneOTP(confirmationResult, otp, formattedPhone);
      const redirectPath = getRedirectPathForUser(user);
      console.log("Phone login successful, redirecting to:", redirectPath, "User:", user);
      router.push(redirectPath);
    } catch (error) {
      console.error("Verify OTP error:", error);
      const apiError = error as ApiError;
      if (apiError && typeof apiError === 'object' && 'message' in apiError) {
        if (apiError.status === 401 || apiError.message.includes("invalid") || apiError.message.includes("expired")) {
          setOtpError("Invalid or expired OTP. Please try again.");
        } else {
          setGeneralError(apiError.message || "OTP verification failed. Please try again.");
        }
      } else if (error instanceof Error) {
        setOtpError(error.message);
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setOtpError("");
    setGeneralError("");
    setOtp("");
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const result = await sendPhoneOTP(formattedPhone);
      setConfirmationResult(result.confirmationResult);
      setCountdown(60);
      setGeneralError("");
    } catch (error) {
      console.error("Resend OTP error:", error);
      
      // Check for Firebase billing error
      if (error instanceof Error && error.message.includes('billing-not-enabled')) {
        setGeneralError("Phone authentication is currently unavailable. Please contact support or use email login.");
      } else {
        const apiError = error as ApiError;
        if (apiError && typeof apiError === 'object' && 'message' in apiError) {
          setGeneralError(apiError.message || "Failed to resend OTP. Please try again.");
        } else {
          setGeneralError("Failed to resend OTP. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (method: "email" | "phone") => {
    setLoginMethod(method);
    setGeneralError("");
    setEmailError("");
    setPasswordError("");
    setPhoneError("");
    setOtpError("");
    setPhoneStep("phone");
    setOtp("");
    setCountdown(0);
  };

  const isEmailFormValid = email && password && !emailError && !passwordError;
  const isPhoneFormValid = phoneNumber && validatePhone(formatPhoneNumber(phoneNumber)) && !phoneError;
  const isOtpFormValid = otp && otp.length === 6 && !otpError;

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Left Column - Image Section */}
      <div className="hidden lg:flex w-[50%] relative overflow-hidden">
        <div className="w-full h-full bg-[#f4f4f6] flex items-center justify-center">
          <div className="text-center p-8">
            <Image
              src="/logos/Logo.svg"
              alt="NoProblem"
              width={273}
              height={104}
              className="mx-auto mb-6"
              priority
            />
            <p className="text-lg text-gray-500">Manage your dashboard</p>
          </div>
        </div>
      </div>

      {/* Right Column - Form Section */}
      <div className="flex flex-col w-full lg:w-[50%] h-full bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden px-4 py-3 border-b border-gray-200 bg-white">
          <Image
            src="/logos/Logo.svg"
            alt="NoProblem"
            width={160}
            height={61}
            className="h-14 w-auto"
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="w-full max-w-md mx-auto">
            {/* Header Text */}
            <div className="text-left mb-6 sm:mb-8">
              {/* Desktop Logo */}
              <div className="hidden lg:block mb-4">
                <Image
                  src="/logos/Logo.svg"
                  alt="NoProblem"
                  width={180}
                  height={68}
                  className="h-12 w-auto"
                  style={{ marginLeft: "-8px" }}
                />
              </div>
              <p className="text-lg text-gray-500 mt-4">Please sign in to your account</p>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => handleTabChange("email")}
                className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                  loginMethod === "email"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("phone")}
                className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                  loginMethod === "phone"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Phone
              </button>
            </div>

            {/* General Error */}
            {generalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{generalError}</p>
              </div>
            )}

            {/* Email Login Form */}
            {loginMethod === "email" && (
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 sm:gap-6 w-full">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value && !validateEmail(e.target.value)) {
                      setEmailError("Please enter a valid email address");
                    } else {
                      setEmailError("");
                    }
                  }}
                  placeholder="Email address"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 ${
                    emailError
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-gray-400 focus:ring-gray-500/20"
                  }`}
                />
                <div className="h-4 mt-1">
                  {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Password"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 ${
                    passwordError
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-gray-400 focus:ring-gray-500/20"
                  }`}
                />
                <div className="h-4 mt-1">
                  {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isEmailFormValid}
                  className="w-full h-12 text-sm font-semibold rounded-lg transition-all duration-200 text-white disabled:cursor-not-allowed"
                  style={{
                    background: isLoading
                      ? "#1D4ED8"
                      : !isEmailFormValid
                      ? "#9CA3AF"
                      : "#2563EB",
                    border: `1px solid ${isLoading ? "#1D4ED8" : !isEmailFormValid ? "#9CA3AF" : "#2563EB"}`,
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            )}

            {/* Phone Login Form */}
            {loginMethod === "phone" && (
              <>
                {phoneStep === "phone" ? (
                  <form onSubmit={handleSendOTP} className="flex flex-col gap-4 sm:gap-6 w-full">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          setPhoneNumber(formatted);
                          if (formatted && !validatePhone(formatted)) {
                            setPhoneError("Please enter a valid phone number");
                          } else {
                            setPhoneError("");
                          }
                        }}
                        placeholder="+1234567890"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 ${
                          phoneError
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-gray-300 focus:border-gray-400 focus:ring-gray-500/20"
                        }`}
                      />
                      <div className="h-4 mt-1">
                        {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !isPhoneFormValid}
                      className="w-full h-12 text-sm font-semibold rounded-lg transition-all duration-200 text-white disabled:cursor-not-allowed"
                      style={{
                        background: isLoading
                          ? "#1D4ED8"
                          : !isPhoneFormValid
                          ? "#9CA3AF"
                          : "#2563EB",
                        border: `1px solid ${isLoading ? "#1D4ED8" : !isPhoneFormValid ? "#9CA3AF" : "#2563EB"}`,
                      }}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending OTP...
                        </span>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4 sm:gap-6 w-full">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter OTP
                      </label>
                      <p className="text-sm text-gray-500 mb-3">
                        We sent a code to {phoneNumber}
                      </p>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setOtp(value);
                          setOtpError("");
                        }}
                        placeholder="000000"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 text-center text-2xl tracking-widest font-mono ${
                          otpError
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-gray-300 focus:border-gray-400 focus:ring-gray-500/20"
                        }`}
                      />
                      <div className="h-4 mt-1">
                        {otpError && <p className="text-sm text-red-500">{otpError}</p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneStep("phone");
                          setOtp("");
                          setOtpError("");
                          setGeneralError("");
                          setCountdown(0);
                        }}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        disabled={isLoading}
                      >
                        ← Change phone number
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isLoading || countdown > 0}
                        className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !isOtpFormValid}
                      className="w-full h-12 text-sm font-semibold rounded-lg transition-all duration-200 text-white disabled:cursor-not-allowed"
                      style={{
                        background: isLoading
                          ? "#1D4ED8"
                          : !isOtpFormValid
                          ? "#9CA3AF"
                          : "#2563EB",
                        border: `1px solid ${isLoading ? "#1D4ED8" : !isOtpFormValid ? "#9CA3AF" : "#2563EB"}`,
                      }}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Verifying...
                        </span>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-sm font-medium text-gray-900 hover:underline transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* reCAPTCHA container (hidden) */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
