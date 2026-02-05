"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getRedirectPathForUser } from "@/lib/auth";
import { ConfirmationResult } from "@/lib/firebase";
import { getPublicCategories } from "@/lib/category";
import { getPublicServiceAreas } from "@/lib/serviceArea";
import { Category } from "@/types/category";
import { ServiceArea } from "@/types/serviceArea";
import { Role } from "@/types/auth";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  PartyPopper,
  Users,
  Store,
} from "lucide-react";

// Import extracted components and types
import {
  VendorFormData,
  CustomerFormData,
  VendorService,
  SerializableVendorFormData,
  SerializableCustomerFormData,
} from "@/components/signup/types";
import {
  VENDOR_STEPS,
  CUSTOMER_STEPS,
  initialVendorFormData,
  initialCustomerFormData,
  VENDOR_STORAGE_KEY,
  VENDOR_STEP_STORAGE_KEY,
  CUSTOMER_STORAGE_KEY,
  CUSTOMER_STEP_STORAGE_KEY,
} from "@/components/signup/constants";
import StepIndicator from "@/components/signup/StepIndicator";
import VendorSteps from "@/components/signup/vendor/VendorSteps";
import CustomerSteps from "@/components/signup/customer/CustomerSteps";

interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export default function SignupPage() {
  const router = useRouter();
  const { register, sendPhoneOTP, token } = useAuth();

  // Role selection
  const [role, setRole] = useState<Role>("vendor");

  // Vendor form state
  const [vendorStep, setVendorStep] = useState(0);
  const [vendorFormData, setVendorFormData] = useState<VendorFormData>(initialVendorFormData);
  const [vendorFieldErrors, setVendorFieldErrors] = useState<Record<string, string>>({});
  const [isVendorSubmitted, setIsVendorSubmitted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  // Customer form state
  const [customerStep, setCustomerStep] = useState(0);
  const [customerFormData, setCustomerFormData] = useState<CustomerFormData>(initialCustomerFormData);
  const [customerFieldErrors, setCustomerFieldErrors] = useState<Record<string, string>>({});
  const [isCustomerSubmitted, setIsCustomerSubmitted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [firebaseIdToken, setFirebaseIdToken] = useState<string | null>(null);

  // Shared state
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // File refs
  const tradeLicenseRef = useRef<HTMLInputElement>(null);
  const vatCertificateRef = useRef<HTMLInputElement>(null);
  const emiratesIdFrontRef = useRef<HTMLInputElement>(null);
  const emiratesIdBackRef = useRef<HTMLInputElement>(null);

  // Categories and service areas
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [serviceAreasLoading, setServiceAreasLoading] = useState(false);
  const [serviceAreasFetched, setServiceAreasFetched] = useState(false);

  // Load saved vendor form data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(VENDOR_STORAGE_KEY);
      const savedStep = localStorage.getItem(VENDOR_STEP_STORAGE_KEY);

      if (savedData) {
        const parsed: SerializableVendorFormData = JSON.parse(savedData);
        // Restore services with image: null since File objects can't be serialized
        const restoredServices: VendorService[] = (parsed.services || []).map(s => ({
          ...s,
          image: null,
        }));
        setVendorFormData({
          ...parsed,
          tradeLicenseFile: null,
          vatCertificateFile: null,
          emiratesIdFront: null,
          emiratesIdBack: null,
          services: restoredServices,
          // Ensure companyHours is initialized if missing
          companyHours: parsed.companyHours || {
            monday: { enabled: false, slots: [] },
            tuesday: { enabled: false, slots: [] },
            wednesday: { enabled: false, slots: [] },
            thursday: { enabled: false, slots: [] },
            friday: { enabled: false, slots: [] },
            saturday: { enabled: false, slots: [] },
            sunday: { enabled: false, slots: [] },
          },
        });
        // If there's saved vendor data, switch to vendor role
        setRole("vendor");
      }

      if (savedStep) {
        setVendorStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      console.error("Error loading saved form data:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save vendor form data to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated || role !== "vendor") return;

    try {
      // Serialize services without File objects
      const serializableServices = vendorFormData.services.map(s => ({
        ...s,
        image: undefined,
        imageName: s.image?.name,
      }));
      const dataToSave: SerializableVendorFormData = {
        ...vendorFormData,
        tradeLicenseFileName: vendorFormData.tradeLicenseFile?.name,
        vatCertificateFileName: vendorFormData.vatCertificateFile?.name,
        emiratesIdFrontName: vendorFormData.emiratesIdFront?.name,
        emiratesIdBackName: vendorFormData.emiratesIdBack?.name,
        services: serializableServices,
      };
      const { tradeLicenseFile, vatCertificateFile, emiratesIdFront, emiratesIdBack, ...rest } = dataToSave as VendorFormData & SerializableVendorFormData;
      localStorage.setItem(VENDOR_STORAGE_KEY, JSON.stringify(rest));
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  }, [vendorFormData, isHydrated, role]);

  // Save current vendor step to localStorage
  useEffect(() => {
    if (!isHydrated || role !== "vendor") return;
    localStorage.setItem(VENDOR_STEP_STORAGE_KEY, vendorStep.toString());
  }, [vendorStep, isHydrated, role]);

  // Load saved customer form data from localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const savedData = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      const savedStep = localStorage.getItem(CUSTOMER_STEP_STORAGE_KEY);

      if (savedData && role === "customer") {
        const parsed: SerializableCustomerFormData = JSON.parse(savedData);
        setCustomerFormData({
          ...parsed,
          emiratesIdFront: null,
          emiratesIdBack: null,
        });
      }

      if (savedStep && role === "customer") {
        setCustomerStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      console.error("Error loading saved customer form data:", error);
    }
  }, [isHydrated, role]);

  // Save customer form data to localStorage
  useEffect(() => {
    if (!isHydrated || role !== "customer") return;

    try {
      const dataToSave: SerializableCustomerFormData = {
        ...customerFormData,
        emiratesIdFrontName: customerFormData.emiratesIdFront?.name,
        emiratesIdBackName: customerFormData.emiratesIdBack?.name,
      };
      const { emiratesIdFront, emiratesIdBack, ...rest } = dataToSave as CustomerFormData & SerializableCustomerFormData;
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(rest));
    } catch (error) {
      console.error("Error saving customer form data:", error);
    }
  }, [customerFormData, isHydrated, role]);

  // Save current customer step to localStorage
  useEffect(() => {
    if (!isHydrated || role !== "customer") return;
    localStorage.setItem(CUSTOMER_STEP_STORAGE_KEY, customerStep.toString());
  }, [customerStep, isHydrated, role]);

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Clear localStorage on successful registration
  const clearSavedProgress = useCallback(() => {
    localStorage.removeItem(VENDOR_STORAGE_KEY);
    localStorage.removeItem(VENDOR_STEP_STORAGE_KEY);
  }, []);

  // Clear customer localStorage on successful registration
  const clearCustomerSavedProgress = useCallback(() => {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    localStorage.removeItem(CUSTOMER_STEP_STORAGE_KEY);
  }, []);

  // Pre-fill contact info when reaching step 2
  useEffect(() => {
    if (vendorStep === 2) {
      setVendorFormData((prev) => ({
        ...prev,
        contactFirstName: prev.contactFirstName || prev.firstName,
        contactLastName: prev.contactLastName || prev.lastName,
        contactEmail: prev.contactEmail || prev.email,
      }));
    }
  }, [vendorStep]);

  // Fetch service areas when customer or vendor role is selected
  useEffect(() => {
    if (role === "vendor" || role === "customer") {
      // Fetch service areas if not already loaded
      if (!serviceAreasFetched) {
        const fetchServiceAreas = async () => {
          setServiceAreasLoading(true);
          try {
            console.log("Fetching service areas for", role);
            const serviceAreasResponse = await getPublicServiceAreas(1);
            setServiceAreas(serviceAreasResponse.data || []);
            setServiceAreasFetched(true);
            console.log("Service areas fetched:", serviceAreasResponse.data?.length || 0);
          } catch (error) {
            console.error("Error fetching service areas:", error);
          } finally {
            setServiceAreasLoading(false);
          }
        };

        fetchServiceAreas();
      }
    }
  }, [role, serviceAreasFetched]);

  // Fetch categories and service areas on mount using public APIs (for vendor)
  useEffect(() => {
    if (!dataFetched && role === "vendor") {
      const fetchData = async () => {
        // Fetch categories only for vendor
        setCategoriesLoading(true);
        try {
          const categoriesResponse = await getPublicCategories(1);
          setCategories(categoriesResponse.data || []);
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          setCategoriesLoading(false);
        }
      };

      fetchData();
      setDataFetched(true);
    }
  }, [dataFetched, role]);

  // Reset dataFetched when switching roles
  useEffect(() => {
    if (role === "vendor" && !dataFetched) {
      setDataFetched(false);
    }
  }, [role, dataFetched]);

  // Vendor form helpers
  const updateVendorFormData = (field: keyof VendorFormData, value: string | string[] | File | null | VendorService[] | number | VendorFormData["companyHours"]) => {
    setVendorFormData((prev) => ({ ...prev, [field]: value }));
    if (vendorFieldErrors[field]) {
      setVendorFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateVendorStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!vendorFormData.firstName.trim()) errors.firstName = "First name is required";
        if (!vendorFormData.lastName.trim()) errors.lastName = "Last name is required";
        if (!vendorFormData.email.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorFormData.email)) {
          errors.email = "Please enter a valid email";
        }
        if (!vendorFormData.password) errors.password = "Password is required";
        else if (vendorFormData.password.length < 8) {
          errors.password = "Password must be at least 8 characters";
        }
        if (!vendorFormData.passwordConfirmation) {
          errors.passwordConfirmation = "Please confirm your password";
        } else if (vendorFormData.password !== vendorFormData.passwordConfirmation) {
          errors.passwordConfirmation = "Passwords do not match";
        }
        break;

      case 1:
        if (!vendorFormData.companyName.trim()) errors.companyName = "Company name is required";
        if (!vendorFormData.tradeLicenseNumber.trim()) {
          errors.tradeLicenseNumber = "Trade license number is required";
        }
        // Validate location is within UAE if provided
        if (vendorFormData.latitude !== null && vendorFormData.longitude !== null) {
          const UAE_BOUNDS = {
            minLat: 22.5,
            maxLat: 26.0,
            minLng: 51.0,
            maxLng: 56.4,
          };
          if (
            vendorFormData.latitude < UAE_BOUNDS.minLat ||
            vendorFormData.latitude > UAE_BOUNDS.maxLat ||
            vendorFormData.longitude < UAE_BOUNDS.minLng ||
            vendorFormData.longitude > UAE_BOUNDS.maxLng
          ) {
            errors.latitude = "Business location must be within the United Arab Emirates (UAE)";
          }
        }
        break;

      case 2:
        if (!vendorFormData.contactFirstName.trim()) errors.contactFirstName = "First name is required";
        if (!vendorFormData.contactLastName.trim()) errors.contactLastName = "Last name is required";
        if (!vendorFormData.contactEmail.trim()) errors.contactEmail = "Email is required";
        if (!vendorFormData.mobileNumber.trim()) errors.mobileNumber = "Mobile number is required";
        if (!vendorFormData.emiratesId.trim()) errors.emiratesId = "Emirates ID number is required";
        if (!vendorFormData.emiratesIdFront) errors.emiratesIdFront = "Emirates ID front side is required";
        if (!vendorFormData.emiratesIdBack) errors.emiratesIdBack = "Emirates ID back side is required";
        break;

      case 3:
        if (vendorFormData.selectedCategories.length === 0) {
          errors.selectedCategories = "Please select at least one category";
        }
        break;

      case 4:
        if (vendorFormData.selectedServiceAreas.length === 0) {
          errors.selectedServiceAreas = "Please select at least one service area";
        }
        break;

      case 5:
        if (!vendorFormData.tradeLicenseFile) errors.tradeLicenseFile = "Trade license document is required";
        if (!vendorFormData.bankName.trim()) errors.bankName = "Bank name is required";
        if (!vendorFormData.accountHolderName.trim()) errors.accountHolderName = "Account holder name is required";
        if (!vendorFormData.iban.trim()) errors.iban = "IBAN is required";
        break;

      case 6:
        // Company hours validation is optional - no errors if not set
        break;
    }

    setVendorFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVendorNext = async () => {
    if (!validateVendorStep(vendorStep)) return;
    if (vendorStep < 6) {
      setVendorStep((prev) => prev + 1);
    }
  };

  const handleVendorBack = () => {
    if (vendorStep > 0) {
      setVendorStep((prev) => prev - 1);
    }
  };

  const handleVendorSubmit = async () => {
    if (!validateVendorStep(6)) return;

    setIsLoading(true);
    setGeneralError("");

    // Format services for backend (without File objects, those need separate upload)
    const formattedServices = vendorFormData.services.map((service) => ({
      name: service.name,
      description: service.description,
      // image will be handled separately if needed
      sub_services: service.subServices.map((sub) => ({
        name: sub.name,
        price: sub.price,
        duration: sub.duration,
        description: sub.description,
      })),
    }));

    try {
      await register({
        first_name: vendorFormData.firstName,
        last_name: vendorFormData.lastName,
        email: vendorFormData.email,
        password: vendorFormData.password,
        password_confirmation: vendorFormData.passwordConfirmation,
        role: "vendor",
        // Company profile
        company_name: vendorFormData.companyName,
        company_email: vendorFormData.companyEmail || undefined,
        trade_license_number: vendorFormData.tradeLicenseNumber,
        company_description: vendorFormData.description || undefined,
        landline: vendorFormData.businessLandline || undefined,
        website: vendorFormData.website || undefined,
        establishment: vendorFormData.establishmentDate || undefined,
        latitude: vendorFormData.latitude || undefined,
        longitude: vendorFormData.longitude || undefined,
        // Primary contact
        contact_first_name: vendorFormData.contactFirstName || undefined,
        contact_last_name: vendorFormData.contactLastName || undefined,
        designation: vendorFormData.designation || undefined,
        contact_email: vendorFormData.contactEmail || undefined,
        phone: vendorFormData.mobileNumber || undefined,
        emirates_id: vendorFormData.emiratesId || undefined,
        emirates_id_front: vendorFormData.emiratesIdFront || undefined,
        emirates_id_back: vendorFormData.emiratesIdBack || undefined,
        // Services & service areas
        category_id: vendorFormData.selectedCategories[0] || undefined,
        service_area_ids: vendorFormData.selectedServiceAreas,
        services: formattedServices.length > 0 ? formattedServices : undefined,
        // Legal & bank
        trade_license_document: vendorFormData.tradeLicenseFile || undefined,
        vat_certificate: vendorFormData.vatCertificateFile || undefined,
        bank_name: vendorFormData.bankName,
        account_holder_name: vendorFormData.accountHolderName,
        iban: vendorFormData.iban,
        swift_code: vendorFormData.swiftCode || undefined,
        trn: vendorFormData.trn || undefined,
      });

      // Save company hours after successful registration
      const companyHoursToSave = vendorFormData.companyHours;
      // Get token from localStorage (saved by useAuth hook after registration)
      const authData = typeof window !== 'undefined' ? localStorage.getItem('np_admin_auth') : null;
      const tokenData = typeof window !== 'undefined' ? localStorage.getItem('np_admin_token') : null;
      const registrationToken = tokenData || token;

      // Save company hours after successful registration
      if (companyHoursToSave) {
        try {
          const dayOrder: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'> = 
            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          
          const hours = dayOrder.map((day) => {
            const daySchedule = companyHoursToSave[day];
            const slots = daySchedule.enabled && daySchedule.slots.length > 0
              ? daySchedule.slots.map((slot) => {
                  // Normalize time format to HH:mm
                  const normalizeTime = (time: string): string => {
                    if (time.length === 5) return time; // Already HH:mm
                    if (time.length === 8) return time.substring(0, 5); // HH:mm:ss -> HH:mm
                    return time;
                  };
                  return {
                    start_time: normalizeTime(slot.start),
                    end_time: normalizeTime(slot.end),
                  };
                })
              : [];

            return {
              day,
              is_available: daySchedule.enabled && slots.length > 0,
              slots,
            };
          });

          // Save company hours using the registration token
          const { API_BASE_URL } = await import('@/config');
          const response = await fetch(`${API_BASE_URL}/vendor/company-hours`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${registrationToken}`,
            },
            body: JSON.stringify({ hours }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error saving company hours:', errorData);
            // Don't fail registration if company hours save fails
          }
        } catch (error) {
          console.error('Error saving company hours:', error);
          // Don't fail registration if company hours save fails
        }
      }

      clearSavedProgress();
      setIsVendorSubmitted(true);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.errors) {
        const newErrors: Record<string, string> = {};
        const fieldMapping: Record<string, string> = {
          first_name: "firstName",
          last_name: "lastName",
          email: "email",
          password: "password",
          company_name: "companyName",
          company_email: "companyEmail",
          trade_license_number: "tradeLicenseNumber",
          company_description: "description",
          landline: "businessLandline",
          website: "website",
          establishment: "establishmentDate",
          contact_first_name: "contactFirstName",
          contact_last_name: "contactLastName",
          designation: "designation",
          contact_email: "contactEmail",
          phone: "mobileNumber",
          emirates_id: "emiratesId",
          emirates_id_front: "emiratesIdFront",
          emirates_id_back: "emiratesIdBack",
          category_id: "selectedCategories",
          service_area_ids: "selectedServiceAreas",
          services: "services",
          trade_license_document: "tradeLicenseFile",
          vat_certificate: "vatCertificateFile",
          bank_name: "bankName",
          account_holder_name: "accountHolderName",
          iban: "iban",
          swift_code: "swiftCode",
          trn: "trn",
        };

        Object.entries(apiError.errors).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            const frontendKey = fieldMapping[key] || key;
            newErrors[frontendKey] = value[0];
          }
        });
        setVendorFieldErrors(newErrors);

        const errorSteps: Record<string, number> = {
          firstName: 0, lastName: 0, email: 0, password: 0,
          companyName: 1, companyEmail: 1, tradeLicenseNumber: 1, description: 1, businessLandline: 1, website: 1, establishmentDate: 1,
          contactFirstName: 2, contactLastName: 2, designation: 2, contactEmail: 2, mobileNumber: 2, emiratesId: 2, emiratesIdFront: 2, emiratesIdBack: 2,
          selectedCategories: 3, services: 3,
          selectedServiceAreas: 4,
          tradeLicenseFile: 5, vatCertificateFile: 5, bankName: 5, accountHolderName: 5, iban: 5, swiftCode: 5, trn: 5,
        };

        const firstErrorKey = Object.keys(newErrors)[0];
        if (firstErrorKey && errorSteps[firstErrorKey] !== undefined) {
          setVendorStep(errorSteps[firstErrorKey]);
        }
      } else {
        setGeneralError(apiError?.message || "Failed to submit application. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Customer form helpers
  const updateCustomerFormData = (field: keyof CustomerFormData, value: string | boolean | number | File | null) => {
    setCustomerFormData((prev) => ({ ...prev, [field]: value }));
    if (customerFieldErrors[field]) {
      setCustomerFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateCustomerStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 0: // Account
        if (!customerFormData.firstName.trim()) errors.firstName = "First name is required";
        if (!customerFormData.lastName.trim()) errors.lastName = "Last name is required";
        if (!customerFormData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
        else {
          const dob = new Date(customerFormData.dateOfBirth);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            const actualAge = age - 1;
            if (actualAge < 18) {
              errors.dateOfBirth = "You must be at least 18 years old";
            }
          } else if (age < 18) {
            errors.dateOfBirth = "You must be at least 18 years old";
          }
        }
        if (!customerFormData.nationality) errors.nationality = "Nationality is required";
        if (!customerFormData.email.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerFormData.email)) {
          errors.email = "Please enter a valid email";
        }
        if (!customerFormData.phone.trim()) errors.phone = "Phone number is required";
        if (!customerFormData.password) errors.password = "Password is required";
        else if (customerFormData.password.length < 8) {
          errors.password = "Password must be at least 8 characters";
        }
        if (!customerFormData.passwordConfirmation) {
          errors.passwordConfirmation = "Please confirm your password";
        } else if (customerFormData.password !== customerFormData.passwordConfirmation) {
          errors.passwordConfirmation = "Passwords do not match";
        }
        break;

      case 1: // Emirates ID
        if (!customerFormData.emiratesIdNumber.trim()) {
          errors.emiratesIdNumber = "Emirates ID number is required";
        }
        if (!customerFormData.emiratesIdFront) {
          errors.emiratesIdFront = "Emirates ID front image is required";
        }
        if (!customerFormData.emiratesIdBack) {
          errors.emiratesIdBack = "Emirates ID back image is required";
        }
        break;

      case 2: // Location
        if (!customerFormData.street.trim()) errors.street = "Street address is required";
        if (!customerFormData.city.trim()) errors.city = "City is required";
        if (!customerFormData.emirate) errors.emirate = "Emirate is required";
        if (!customerFormData.serviceAreaId) errors.serviceAreaId = "Service area is required";
        break;

      case 3: // Phone Verification
        // Phone verification is optional - can proceed without it
        break;

      case 4: // Payment
        if (!customerFormData.skipPayment) {
          if (!customerFormData.cardNumber || customerFormData.cardNumber.length !== 16) {
            errors.cardNumber = "Valid 16-digit card number is required";
          }
          if (!customerFormData.cardName.trim()) errors.cardName = "Cardholder name is required";
          if (!customerFormData.cardExpiry || !/^\d{2}\/\d{2}$/.test(customerFormData.cardExpiry)) {
            errors.cardExpiry = "Valid expiry date (MM/YY) is required";
          }
          if (!customerFormData.cardCvv || customerFormData.cardCvv.length < 3) {
            errors.cardCvv = "Valid CVV is required";
          }
        }
        break;
    }

    setCustomerFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCustomerNext = async () => {
    if (!validateCustomerStep(customerStep)) return;
    if (customerStep < 4) {
      setCustomerStep((prev) => prev + 1);
    }
  };

  const handleCustomerBack = () => {
    if (customerStep > 0) {
      setCustomerStep((prev) => prev - 1);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned && !cleaned.startsWith("+")) {
      cleaned = "+" + cleaned;
    }
    return cleaned;
  };

  const handleSendOtp = async () => {
    const formattedPhone = formatPhoneNumber(customerFormData.phone);

    if (!formattedPhone || formattedPhone === "+") {
      setCustomerFieldErrors(prev => ({ ...prev, phone: "Phone number is required" }));
      return;
    }

    setIsLoading(true);
    setGeneralError("");

    try {
      const result = await sendPhoneOTP(formattedPhone);
      setConfirmationResult(result.confirmationResult);
      setOtpSent(true);
      setOtpCountdown(60);
    } catch (error) {
      console.error("Send OTP error:", error);
      if (error instanceof Error) {
        if (error.message.includes('billing-not-enabled')) {
          setGeneralError("Phone verification is currently unavailable. You can skip this step.");
        } else if (error.message.includes('too-many-requests')) {
          setGeneralError("Too many attempts. Please try again later.");
        } else if (error.message.includes('invalid-phone-number')) {
          setGeneralError("Invalid phone number format. Please check and try again.");
        } else if (error.message.includes('captcha-check-failed')) {
          setGeneralError("reCAPTCHA verification failed. Please refresh the page and try again.");
        } else {
          setGeneralError(error.message || "Failed to send OTP. Please try again.");
        }
      } else {
        setGeneralError("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (customerFormData.otpCode.length !== 6) {
      setCustomerFieldErrors(prev => ({ ...prev, otpCode: "Please enter a valid 6-digit code" }));
      return;
    }

    if (!confirmationResult) {
      setGeneralError("Please request a new OTP code");
      return;
    }

    setIsLoading(true);
    setGeneralError("");

    try {
      const userCredential = await confirmationResult.confirm(customerFormData.otpCode);
      // Get the Firebase ID token to send to backend
      const idToken = await userCredential.user.getIdToken();
      console.log("[DEBUG] Firebase ID Token obtained:", idToken ? "Yes (length: " + idToken.length + ")" : "No");
      console.log("[DEBUG] Firebase user phone:", userCredential.user.phoneNumber);
      setFirebaseIdToken(idToken);
      updateCustomerFormData("isPhoneVerified", true);
    } catch (error) {
      console.error("Verify OTP error:", error);
      if (error instanceof Error) {
        if (error.message.includes('invalid-verification-code')) {
          setCustomerFieldErrors(prev => ({ ...prev, otpCode: "Invalid OTP code" }));
        } else if (error.message.includes('code-expired')) {
          setGeneralError("OTP code has expired. Please request a new one.");
          setOtpSent(false);
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerSubmit = async () => {
    if (!validateCustomerStep(4)) return;

    setIsLoading(true);
    setGeneralError("");

    const formattedPhone = customerFormData.phone ? formatPhoneNumber(customerFormData.phone) : undefined;
    console.log("[DEBUG] Submitting customer registration:");
    console.log("[DEBUG] - Phone from form:", customerFormData.phone);
    console.log("[DEBUG] - Formatted phone:", formattedPhone);
    console.log("[DEBUG] - Firebase ID Token:", firebaseIdToken ? "Yes (length: " + firebaseIdToken.length + ")" : "No");
    console.log("[DEBUG] - Is phone verified:", customerFormData.isPhoneVerified);

    try {
      await register({
        first_name: customerFormData.firstName,
        last_name: customerFormData.lastName,
        email: customerFormData.email,
        password: customerFormData.password,
        password_confirmation: customerFormData.passwordConfirmation,
        role: "customer",
        // Firebase ID token for phone verification
        firebase_id_token: firebaseIdToken || undefined,
        // Customer-specific fields (format phone with + to match Firebase format)
        phone: formattedPhone,
        date_of_birth: customerFormData.dateOfBirth || undefined,
        nationality: customerFormData.nationality || undefined,
        // Emirates ID
        emirates_id_number: customerFormData.emiratesIdNumber || undefined,
        emirates_id_front: customerFormData.emiratesIdFront || undefined,
        emirates_id_back: customerFormData.emiratesIdBack || undefined,
        // Address
        address_label: customerFormData.addressLabel || undefined,
        address_street: customerFormData.street || undefined,
        address_building: customerFormData.building || undefined,
        address_apartment: customerFormData.apartment || undefined,
        address_city: customerFormData.city || undefined,
        address_emirate: customerFormData.emirate || undefined,
        service_area_id: customerFormData.serviceAreaId || undefined,
        address_latitude: customerFormData.latitude || undefined,
        address_longitude: customerFormData.longitude || undefined,
        // Payment (optional)
        skip_payment: customerFormData.skipPayment,
        card_number: !customerFormData.skipPayment ? customerFormData.cardNumber || undefined : undefined,
        card_expiry: !customerFormData.skipPayment ? customerFormData.cardExpiry || undefined : undefined,
        card_cvv: !customerFormData.skipPayment ? customerFormData.cardCvv || undefined : undefined,
        card_name: !customerFormData.skipPayment ? customerFormData.cardName || undefined : undefined,
      });

      clearCustomerSavedProgress();
      setIsCustomerSubmitted(true);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.errors) {
        const newErrors: Record<string, string> = {};
        const fieldMapping: Record<string, string> = {
          first_name: "firstName",
          last_name: "lastName",
          email: "email",
          password: "password",
          phone: "phone",
          nationality: "nationality",
          emirates_id_number: "emiratesIdNumber",
          emirates_id_front: "emiratesIdFront",
          emirates_id_back: "emiratesIdBack",
          address_label: "addressLabel",
          address_street: "street",
          address_building: "building",
          address_apartment: "apartment",
          address_city: "city",
          address_emirate: "emirate",
          address_latitude: "latitude",
          address_longitude: "longitude",
          card_number: "cardNumber",
          card_expiry: "cardExpiry",
          card_cvv: "cardCvv",
          card_name: "cardName",
        };

        Object.entries(apiError.errors).forEach(([key, messages]) => {
          const frontendField = fieldMapping[key] || key;
          if (Array.isArray(messages)) {
            newErrors[frontendField] = messages[0];
          } else {
            newErrors[frontendField] = messages;
          }
        });
        setCustomerFieldErrors(newErrors);

        // Navigate to the step with the first error
        const errorSteps: Record<string, number> = {
          firstName: 0, lastName: 0, nationality: 0, email: 0, phone: 0, password: 0,
          emiratesIdNumber: 1, emiratesIdFront: 1, emiratesIdBack: 1,
          addressLabel: 2, street: 2, building: 2, apartment: 2, city: 2, emirate: 2, latitude: 2, longitude: 2,
          cardNumber: 4, cardExpiry: 4, cardCvv: 4, cardName: 4,
        };

        const firstErrorKey = Object.keys(newErrors)[0];
        if (firstErrorKey && errorSteps[firstErrorKey] !== undefined) {
          setCustomerStep(errorSteps[firstErrorKey]);
        }
      }
      setGeneralError(apiError?.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get vendor step renderers from VendorSteps component
  const vendorStepRenderers = VendorSteps({
    formData: vendorFormData,
    updateFormData: updateVendorFormData,
    fieldErrors: vendorFieldErrors,
    categories,
    categoriesLoading,
    serviceAreas,
    serviceAreasLoading,
    tradeLicenseInputRef: tradeLicenseRef as React.RefObject<HTMLInputElement>,
    vatCertificateInputRef: vatCertificateRef as React.RefObject<HTMLInputElement>,
    emiratesIdFrontRef: emiratesIdFrontRef as React.RefObject<HTMLInputElement>,
    emiratesIdBackRef: emiratesIdBackRef as React.RefObject<HTMLInputElement>,
  });

  // Get customer step renderers from CustomerSteps component
  const customerStepRenderers = CustomerSteps({
    formData: customerFormData,
    updateFormData: updateCustomerFormData,
    fieldErrors: customerFieldErrors,
    otpSent,
    otpCountdown,
    handleSendOtp,
    handleVerifyOtp,
    emiratesIdFrontRef: emiratesIdFrontRef as React.RefObject<HTMLInputElement>,
    emiratesIdBackRef: emiratesIdBackRef as React.RefObject<HTMLInputElement>,
    serviceAreas,
    serviceAreasLoading,
  });

  // Vendor current step renderer
  const renderVendorCurrentStep = () => {
    switch (vendorStep) {
      case 0: return vendorStepRenderers.renderStep0();
      case 1: return vendorStepRenderers.renderStep1();
      case 2: return vendorStepRenderers.renderStep2();
      case 3: return vendorStepRenderers.renderStep3();
      case 4: return vendorStepRenderers.renderStep4();
      case 5: return vendorStepRenderers.renderStep5();
      case 6: return vendorStepRenderers.renderStep6();
      default: return null;
    }
  };

  // Customer current step renderer
  const renderCustomerCurrentStep = () => {
    switch (customerStep) {
      case 0: return customerStepRenderers.renderStep0();
      case 1: return customerStepRenderers.renderStep1();
      case 2: return customerStepRenderers.renderStep2();
      case 3: return customerStepRenderers.renderStep3();
      case 4: return customerStepRenderers.renderStep4();
      default: return null;
    }
  };

  // Vendor Success Step
  const renderVendorSuccessStep = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        Thank you for registering. Our team will review your application and get back to you within 2-3 business days.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/login"
          className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );

  // Customer Success Step
  const renderCustomerSuccessStep = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <PartyPopper className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to NoProblem!</h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        Your account has been created successfully. You can now browse services and place orders.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/customer"
          className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );


  // Render Vendor Form
  const renderVendorForm = () => {
    if (isVendorSubmitted) {
      return renderVendorSuccessStep();
    }

    return (
      <div className="flex flex-col">
        {/* Step Indicator */}
        <StepIndicator steps={VENDOR_STEPS} currentStep={vendorStep} />

        {/* Error Message */}
        {generalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{generalError}</p>
          </div>
        )}

        {/* Current Step Content */}
        <div>
          {renderVendorCurrentStep()}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between">
          {vendorStep > 0 ? (
            <button
              type="button"
              onClick={handleVendorBack}
              disabled={isLoading}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {vendorStep === 6 ? (
            <button
              type="button"
              onClick={handleVendorSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVendorNext}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render Customer Form
  const renderCustomerForm = () => {
    if (isCustomerSubmitted) {
      return renderCustomerSuccessStep();
    }

    return (
      <div className="flex flex-col">
        {/* Step Indicator */}
        <StepIndicator steps={CUSTOMER_STEPS} currentStep={customerStep} />

        {/* Error Message */}
        {generalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{generalError}</p>
          </div>
        )}

        {/* Current Step Content */}
        <div>
          {renderCustomerCurrentStep()}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between">
          {customerStep > 0 ? (
            <button
              type="button"
              onClick={handleCustomerBack}
              disabled={isLoading}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {customerStep === 4 ? (
            <button
              type="button"
              onClick={handleCustomerSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCustomerNext}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
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
        <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto justify-start">
          <div className="w-full max-w-2xl mx-auto">
            {/* Header Text */}
            <div className="text-left mb-6">
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
              <p className="text-lg text-gray-500 mt-4">Create your account</p>
            </div>

            {/* General Error */}
            {generalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{generalError}</p>
              </div>
            )}

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to sign up as
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-3 text-sm font-medium rounded-lg border transition-all duration-200 disabled:opacity-50 ${
                    role === "vendor"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Store className="w-4 h-4 inline mr-1" />
                  Vendor
                </button>
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-3 text-sm font-medium rounded-lg border transition-all duration-200 disabled:opacity-50 ${
                    role === "customer"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  Customer
                </button>
              </div>
            </div>

            {/* Back to role selection for vendor */}
            {role === "vendor" && !isVendorSubmitted && vendorStep > 0 && (
              <button
                type="button"
                onClick={() => {
                  setRole("vendor");
                  setVendorStep(0);
                  setVendorFieldErrors({});
                  setGeneralError("");
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to role selection
              </button>
            )}

            {/* Back to role selection for customer */}
            {role === "customer" && !isCustomerSubmitted && customerStep > 0 && (
              <button
                type="button"
                onClick={() => {
                  setRole("customer");
                  setCustomerStep(0);
                  setCustomerFieldErrors({});
                  setGeneralError("");
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to role selection
              </button>
            )}

            {/* Form Content */}
            {role === "vendor" && renderVendorForm()}
            {role === "customer" && renderCustomerForm()}

            {/* Sign in link */}
            {((role === "vendor" && !isVendorSubmitted) || (role === "customer" && !isCustomerSubmitted)) && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-900 hover:underline transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* reCAPTCHA container for Firebase phone auth */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
