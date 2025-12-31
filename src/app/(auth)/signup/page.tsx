"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getRedirectPathForUser } from "@/lib/auth";
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
  const { register } = useAuth();

  // Role selection
  const [role, setRole] = useState<Role>("admin");

  // Admin form state
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [adminFirstNameError, setAdminFirstNameError] = useState("");
  const [adminLastNameError, setAdminLastNameError] = useState("");
  const [adminEmailError, setAdminEmailError] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState("");
  const [adminConfirmPasswordError, setAdminConfirmPasswordError] = useState("");

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
          services: restoredServices,
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
        services: serializableServices,
      };
      const { tradeLicenseFile, vatCertificateFile, ...rest } = dataToSave as VendorFormData & SerializableVendorFormData;
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

  // Fetch categories and service areas on mount using public APIs
  useEffect(() => {
    if (!dataFetched && role === "vendor") {
      const fetchData = async () => {
        setCategoriesLoading(true);
        try {
          const categoriesResponse = await getPublicCategories(1);
          setCategories(categoriesResponse.data || []);
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          setCategoriesLoading(false);
        }

        setServiceAreasLoading(true);
        try {
          const serviceAreasResponse = await getPublicServiceAreas(1);
          setServiceAreas(serviceAreasResponse.data || []);
        } catch (error) {
          console.error("Error fetching service areas:", error);
        } finally {
          setServiceAreasLoading(false);
        }
      };

      fetchData();
      setDataFetched(true);
    }
  }, [dataFetched, role]);

  // Fetch data when switching to vendor role
  useEffect(() => {
    if (role === "vendor" && !dataFetched) {
      setDataFetched(false);
    }
  }, [role, dataFetched]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Admin form submit
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFirstNameError("");
    setAdminLastNameError("");
    setAdminEmailError("");
    setAdminPasswordError("");
    setAdminConfirmPasswordError("");
    setGeneralError("");

    if (!adminFirstName) {
      setAdminFirstNameError("First name is required");
      return;
    }
    if (!adminLastName) {
      setAdminLastNameError("Last name is required");
      return;
    }
    if (!adminEmail) {
      setAdminEmailError("Email is required");
      return;
    }
    if (!validateEmail(adminEmail)) {
      setAdminEmailError("Please enter a valid email address");
      return;
    }
    if (!adminPassword) {
      setAdminPasswordError("Password is required");
      return;
    }
    if (adminPassword.length < 8) {
      setAdminPasswordError("Password must be at least 8 characters");
      return;
    }
    if (!adminConfirmPassword) {
      setAdminConfirmPasswordError("Please confirm your password");
      return;
    }
    if (adminPassword !== adminConfirmPassword) {
      setAdminConfirmPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const user = await register({
        first_name: adminFirstName,
        last_name: adminLastName,
        email: adminEmail,
        password: adminPassword,
        password_confirmation: adminConfirmPassword,
        role: "admin",
      });
      const redirectPath = getRedirectPathForUser(user);
      router.push(redirectPath);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError && typeof apiError === 'object' && 'message' in apiError) {
        if (apiError.errors) {
          if (apiError.errors.first_name) setAdminFirstNameError(apiError.errors.first_name[0]);
          if (apiError.errors.last_name) setAdminLastNameError(apiError.errors.last_name[0]);
          if (apiError.errors.email) setAdminEmailError(apiError.errors.email[0]);
          if (apiError.errors.password) setAdminPasswordError(apiError.errors.password[0]);
          if (!apiError.errors.first_name && !apiError.errors.last_name && !apiError.errors.email && !apiError.errors.password) {
            setGeneralError(apiError.message);
          }
        } else {
          setGeneralError(apiError.message);
        }
      } else if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isAdminFormValid =
    adminFirstName &&
    adminLastName &&
    adminEmail &&
    adminPassword &&
    adminConfirmPassword &&
    !adminFirstNameError &&
    !adminLastNameError &&
    !adminEmailError &&
    !adminPasswordError &&
    !adminConfirmPasswordError;

  // Vendor form helpers
  const updateVendorFormData = (field: keyof VendorFormData, value: string | string[] | File | null | VendorService[]) => {
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
        break;

      case 2:
        if (!vendorFormData.contactFirstName.trim()) errors.contactFirstName = "First name is required";
        if (!vendorFormData.contactLastName.trim()) errors.contactLastName = "Last name is required";
        if (!vendorFormData.contactEmail.trim()) errors.contactEmail = "Email is required";
        if (!vendorFormData.mobileNumber.trim()) errors.mobileNumber = "Mobile number is required";
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
    }

    setVendorFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVendorNext = async () => {
    if (!validateVendorStep(vendorStep)) return;
    if (vendorStep < 5) {
      setVendorStep((prev) => prev + 1);
    }
  };

  const handleVendorBack = () => {
    if (vendorStep > 0) {
      setVendorStep((prev) => prev - 1);
    }
  };

  const handleVendorSubmit = async () => {
    if (!validateVendorStep(5)) return;

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
        // Primary contact
        contact_first_name: vendorFormData.contactFirstName || undefined,
        contact_last_name: vendorFormData.contactLastName || undefined,
        designation: vendorFormData.designation || undefined,
        contact_email: vendorFormData.contactEmail || undefined,
        phone: vendorFormData.mobileNumber || undefined,
        emirates_id: vendorFormData.emiratesId || undefined,
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
          contactFirstName: 2, contactLastName: 2, designation: 2, contactEmail: 2, mobileNumber: 2, emiratesId: 2,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validateCustomerStep = (_step: number): boolean => {
    // Validation disabled for testing - no backend yet
    return true;
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

  const handleSendOtp = () => {
    // Static implementation - just simulate OTP sent
    setOtpSent(true);
    setOtpCountdown(60);
  };

  const handleVerifyOtp = () => {
    // Static implementation - accept any 6-digit code
    if (customerFormData.otpCode.length === 6) {
      updateCustomerFormData("isPhoneVerified", true);
    }
  };

  const handleCustomerSubmit = async () => {
    if (!validateCustomerStep(4)) return;

    setIsLoading(true);
    setGeneralError("");

    try {
      await register({
        first_name: customerFormData.firstName,
        last_name: customerFormData.lastName,
        email: customerFormData.email,
        password: customerFormData.password,
        password_confirmation: customerFormData.passwordConfirmation,
        role: "customer",
        // Customer-specific fields
        phone: customerFormData.phone || undefined,
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
          href="/login"
          className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );

  // Render Admin Form
  const renderAdminForm = () => (
    <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4 w-full">
      {/* Name Fields Row */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={adminFirstName}
            onChange={(e) => {
              setAdminFirstName(e.target.value);
              setAdminFirstNameError("");
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              adminFirstNameError
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
            placeholder="John"
          />
          {adminFirstNameError && (
            <p className="text-sm text-red-500 mt-1">{adminFirstNameError}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={adminLastName}
            onChange={(e) => {
              setAdminLastName(e.target.value);
              setAdminLastNameError("");
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              adminLastNameError
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
            placeholder="Doe"
          />
          {adminLastNameError && (
            <p className="text-sm text-red-500 mt-1">{adminLastNameError}</p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={adminEmail}
          onChange={(e) => {
            setAdminEmail(e.target.value);
            setAdminEmailError("");
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
            adminEmailError
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
          placeholder="john@example.com"
        />
        {adminEmailError && (
          <p className="text-sm text-red-500 mt-1">{adminEmailError}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          type="password"
          value={adminPassword}
          onChange={(e) => {
            setAdminPassword(e.target.value);
            setAdminPasswordError("");
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
            adminPasswordError
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
          placeholder="Create a password"
        />
        {adminPasswordError && (
          <p className="text-sm text-red-500 mt-1">{adminPasswordError}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <input
          type="password"
          value={adminConfirmPassword}
          onChange={(e) => {
            setAdminConfirmPassword(e.target.value);
            setAdminConfirmPasswordError("");
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
            adminConfirmPasswordError
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
          placeholder="Confirm your password"
        />
        {adminConfirmPasswordError && (
          <p className="text-sm text-red-500 mt-1">{adminConfirmPasswordError}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isAdminFormValid}
        className="w-full py-3 px-4 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
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

          {vendorStep === 5 ? (
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
        <div className={`flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto ${role === "admin" ? "justify-center" : "justify-start"}`}>
          <div className="w-full max-w-md mx-auto">
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
            {generalError && role === "admin" && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{generalError}</p>
              </div>
            )}

            {/* Role Selection - Only show for admin */}
            {role === "admin" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I want to sign up as
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    disabled={isLoading}
                    className="flex-1 py-3 px-3 text-sm font-medium rounded-lg border transition-all duration-200 disabled:opacity-50 bg-blue-600 text-white border-blue-600"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("vendor")}
                    disabled={isLoading}
                    className="flex-1 py-3 px-3 text-sm font-medium rounded-lg border transition-all duration-200 disabled:opacity-50 bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  >
                    <Store className="w-4 h-4 inline mr-1" />
                    Vendor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    disabled={isLoading}
                    className="flex-1 py-3 px-3 text-sm font-medium rounded-lg border transition-all duration-200 disabled:opacity-50 bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  >
                    <Users className="w-4 h-4 inline mr-1" />
                    Customer
                  </button>
                </div>
              </div>
            )}

            {/* Back to signup for vendor */}
            {role === "vendor" && !isVendorSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  setVendorStep(0);
                  setVendorFieldErrors({});
                  setGeneralError("");
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to signup
              </button>
            )}

            {/* Back to signup for customer */}
            {role === "customer" && !isCustomerSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  setCustomerStep(0);
                  setCustomerFieldErrors({});
                  setGeneralError("");
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to signup
              </button>
            )}

            {/* Form Content */}
            {role === "admin" && renderAdminForm()}
            {role === "vendor" && renderVendorForm()}
            {role === "customer" && renderCustomerForm()}

            {/* Sign in link */}
            {(role === "admin" || (role === "vendor" && !isVendorSubmitted) || (role === "customer" && !isCustomerSubmitted)) && (
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
    </div>
  );
}
