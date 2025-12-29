"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Simulate API call - no actual authentication
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
      setEmail("");
    }, 1500);
  };

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
        <div className="lg:hidden px-6 py-4 border-b border-gray-200 bg-white">
          <Image
            src="/logos/Logo.svg"
            alt="NoProblem"
            width={140}
            height={53}
            className="h-8 w-auto"
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
              <h1 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-4">
                Forgot Password
              </h1>
              <p className="text-lg text-gray-500">Reset your password</p>
            </div>

            {/* Success Message */}
            {isEmailSent ? (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Reset link sent successfully!
                    </p>
                    <p className="text-sm text-green-700">
                      Check your email for the password reset link.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 ${
                      emailError
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 focus:border-gray-400 focus:ring-gray-500/20"
                    }`}
                  />
                  <div className="h-5 mt-1">
                    {emailError && <p className="text-sm text-red-600">{emailError}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-12 text-sm font-semibold rounded-lg transition-all duration-200 text-white disabled:cursor-not-allowed"
                  style={{
                    background: isLoading
                      ? "#16A34A"
                      : !email
                      ? "#9CA3AF"
                      : "#00DC6E",
                    border: `1px solid ${isLoading ? "#16A34A" : !email ? "#9CA3AF" : "#00DC6E"}`,
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
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            )}

            {/* Back to Login */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-900 hover:underline transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
