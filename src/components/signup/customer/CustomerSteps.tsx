"use client";

import { CustomerFormData } from "../types";
import { NATIONALITIES, EMIRATES } from "../constants";
import LocationPicker from "@/components/maps/LocationPicker";
import {
  User,
  Mail,
  Lock,
  Phone,
  Shield,
  CreditCard,
  CheckCircle2,
  X,
  Users,
  MapPin,
} from "lucide-react";

interface CustomerStepsProps {
  formData: CustomerFormData;
  updateFormData: (field: keyof CustomerFormData, value: string | boolean | File | null | number) => void;
  fieldErrors: Record<string, string>;
  // OTP related
  otpSent: boolean;
  otpCountdown: number;
  handleSendOtp: () => void;
  handleVerifyOtp: () => void;
  // File input refs
  emiratesIdFrontRef: React.RefObject<HTMLInputElement>;
  emiratesIdBackRef: React.RefObject<HTMLInputElement>;
  // Loading state
  isLoading?: boolean;
}

export default function CustomerSteps({
  formData,
  updateFormData,
  fieldErrors,
  otpSent,
  otpCountdown,
  handleSendOtp,
  handleVerifyOtp,
  emiratesIdFrontRef,
  emiratesIdBackRef,
  isLoading = false,
}: CustomerStepsProps) {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "emiratesIdFront" | "emiratesIdBack"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData(field, file);
    }
  };

  // Step 0 - Account
  const renderStep0 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Create Your Account</h2>
        <p className="text-sm text-gray-500">Join NoProblem as a customer</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
              placeholder="John"
              className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                fieldErrors.firstName
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
              }`}
            />
          </div>
          {fieldErrors.firstName && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
              placeholder="Doe"
              className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                fieldErrors.lastName
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
              }`}
            />
          </div>
          {fieldErrors.lastName && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationality</label>
        <select
          value={formData.nationality}
          onChange={(e) => updateFormData("nationality", e.target.value)}
          className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
            fieldErrors.nationality
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
          }`}
        >
          <option value="">Select your nationality</option>
          {NATIONALITIES.map((nat) => (
            <option key={nat} value={nat}>{nat}</option>
          ))}
        </select>
        {fieldErrors.nationality && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.nationality}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="john@example.com"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.email
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
            }`}
          />
        </div>
        {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            placeholder="+971 50 123 4567"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.phone
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
            }`}
          />
        </div>
        {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            placeholder="Min. 8 characters"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.password
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
            }`}
          />
        </div>
        {fieldErrors.password && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            value={formData.passwordConfirmation}
            onChange={(e) => updateFormData("passwordConfirmation", e.target.value)}
            placeholder="Confirm your password"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.passwordConfirmation
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
            }`}
          />
        </div>
        {fieldErrors.passwordConfirmation && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.passwordConfirmation}</p>
        )}
      </div>
    </div>
  );

  // Step 1 - Emirates ID
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Emirates ID Verification</h3>
        <p className="text-sm text-gray-500">We need to verify your identity</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Emirates ID Number</label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={formData.emiratesIdNumber}
            onChange={(e) => updateFormData("emiratesIdNumber", e.target.value)}
            placeholder="784-XXXX-XXXXXXX-X"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.emiratesIdNumber
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
            }`}
          />
        </div>
        {fieldErrors.emiratesIdNumber && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.emiratesIdNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Emirates ID Front */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            fieldErrors.emiratesIdFront ? "border-red-400" : "border-gray-300"
          }`}
        >
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Front Side</p>
          <p className="text-xs text-gray-500 mb-2">JPG/PNG (Required)</p>
          {formData.emiratesIdFront ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-green-600 truncate max-w-full">
                {formData.emiratesIdFront.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => emiratesIdFrontRef.current?.click()}
                  className="px-3 py-1 text-xs font-medium text-green-600 border border-green-300 rounded hover:bg-green-50"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData("emiratesIdFront", null)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => emiratesIdFrontRef.current?.click()}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Upload
            </button>
          )}
          <input
            ref={emiratesIdFrontRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, "emiratesIdFront")}
            className="hidden"
          />
        </div>

        {/* Emirates ID Back */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            fieldErrors.emiratesIdBack ? "border-red-400" : "border-gray-300"
          }`}
        >
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Back Side</p>
          <p className="text-xs text-gray-500 mb-2">JPG/PNG (Required)</p>
          {formData.emiratesIdBack ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-green-600 truncate max-w-full">
                {formData.emiratesIdBack.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => emiratesIdBackRef.current?.click()}
                  className="px-3 py-1 text-xs font-medium text-green-600 border border-green-300 rounded hover:bg-green-50"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData("emiratesIdBack", null)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => emiratesIdBackRef.current?.click()}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Upload
            </button>
          )}
          <input
            ref={emiratesIdBackRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, "emiratesIdBack")}
            className="hidden"
          />
        </div>
      </div>
      {(fieldErrors.emiratesIdFront || fieldErrors.emiratesIdBack) && (
        <p className="text-xs text-red-500">
          {fieldErrors.emiratesIdFront || fieldErrors.emiratesIdBack}
        </p>
      )}

      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          Your Emirates ID information is securely stored and used only for verification purposes.
        </p>
      </div>
    </div>
  );

  // Step 2 - Location
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Your Location</h3>
        <p className="text-sm text-gray-500">Add your primary address for services</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Label</label>
        <div className="flex gap-2">
          {["Home", "Work", "Other"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => updateFormData("addressLabel", label)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                formData.addressLabel === label
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
        <input
          type="text"
          value={formData.street}
          onChange={(e) => updateFormData("street", e.target.value)}
          placeholder="123 Main Street"
          className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
            fieldErrors.street
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
          }`}
        />
        {fieldErrors.street && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.street}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Building</label>
          <input
            type="text"
            value={formData.building}
            onChange={(e) => updateFormData("building", e.target.value)}
            placeholder="Building name/number"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Apartment/Villa</label>
          <input
            type="text"
            value={formData.apartment}
            onChange={(e) => updateFormData("apartment", e.target.value)}
            placeholder="Apt 101 / Villa 5"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData("city", e.target.value)}
            placeholder="Dubai"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.city
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
            }`}
          />
          {fieldErrors.city && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.city}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Emirate</label>
          <select
            value={formData.emirate}
            onChange={(e) => updateFormData("emirate", e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.emirate
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
            }`}
          >
            <option value="">Select emirate</option>
            {EMIRATES.map((emirate) => (
              <option key={emirate} value={emirate}>{emirate}</option>
            ))}
          </select>
          {fieldErrors.emirate && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.emirate}</p>
          )}
        </div>
      </div>

      {/* Map for location selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          <MapPin className="inline-block w-4 h-4 mr-1 -mt-0.5" />
          Pin Your Location
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Drag the marker or click on the map to set your exact location
        </p>
        <LocationPicker
          latitude={formData.latitude}
          longitude={formData.longitude}
          onLocationChange={(lat, lng) => {
            updateFormData("latitude", lat);
            updateFormData("longitude", lng);
          }}
          height="200px"
          autoFetch
        />
        {(formData.latitude && formData.longitude) && (
          <p className="text-xs text-green-600 mt-1">
            Location set: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
          </p>
        )}
      </div>
    </div>
  );

  // Step 3 - Phone Verification
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Verify Your Phone</h3>
        <p className="text-sm text-gray-500">We&apos;ll send a code to verify your number</p>
      </div>

      {formData.isPhoneVerified ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Verified!</h3>
          <p className="text-sm text-gray-500">
            Your phone number {formData.phone} has been verified.
          </p>
        </div>
      ) : (
        <>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 mb-1">Sending code to:</p>
            <p className="text-lg font-semibold text-gray-900">{formData.phone || "No phone number"}</p>
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Send Verification Code
            </button>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP Code</label>
                <input
                  type="text"
                  value={formData.otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    updateFormData("otpCode", value);
                  }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className={`w-full px-3 py-3 text-center text-lg font-mono tracking-widest border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors.otpCode
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
                  }`}
                />
                {fieldErrors.otpCode && (
                  <p className="text-xs text-red-500 mt-1 text-center">{fieldErrors.otpCode}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={formData.otpCode.length !== 6}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Verify Code
              </button>

              <div className="text-center">
                {otpCountdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in {otpCountdown}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  // Step 4 - Payment Method
  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
        <p className="text-sm text-gray-500">Add a card for faster checkout (optional)</p>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="skipPayment"
          checked={formData.skipPayment}
          onChange={(e) => updateFormData("skipPayment", e.target.checked)}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <label htmlFor="skipPayment" className="text-sm text-gray-700 cursor-pointer">
          Skip for now - I&apos;ll add a payment method later
        </label>
      </div>

      {!formData.skipPayment && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                  updateFormData("cardNumber", value);
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
                className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.cardNumber
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
                }`}
              />
            </div>
            {fieldErrors.cardNumber && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.cardNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
            <input
              type="text"
              value={formData.cardName}
              onChange={(e) => updateFormData("cardName", e.target.value)}
              placeholder="John Doe"
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                fieldErrors.cardName
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
              }`}
            />
            {fieldErrors.cardName && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.cardName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
              <input
                type="text"
                value={formData.cardExpiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  if (value.length > 2) {
                    value = value.slice(0, 2) + "/" + value.slice(2);
                  }
                  updateFormData("cardExpiry", value);
                }}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.cardExpiry
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
                }`}
              />
              {fieldErrors.cardExpiry && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.cardExpiry}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
              <input
                type="password"
                value={formData.cardCvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  updateFormData("cardCvv", value);
                }}
                placeholder="123"
                maxLength={4}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.cardCvv
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
                }`}
              />
              {fieldErrors.cardCvv && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.cardCvv}</p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="p-3 bg-green-50 rounded-lg">
        <p className="text-xs text-green-700">
          Your payment information is securely processed. We do not store your full card details.
        </p>
      </div>
    </div>
  );

  return {
    renderStep0,
    renderStep1,
    renderStep2,
    renderStep3,
    renderStep4,
  };
}
