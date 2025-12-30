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
  Building2,
  User,
  Briefcase,
  MapPin,
  FileText,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";

const STORAGE_KEY = "np_vendor_signup_form";
const STORAGE_STEP_KEY = "np_vendor_signup_step";

interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Vendor step definitions
const VENDOR_STEPS = [
  { id: 0, name: "Account", icon: User },
  { id: 1, name: "Company Profile", icon: Building2 },
  { id: 2, name: "Primary Contact", icon: User },
  { id: 3, name: "Services", icon: Briefcase },
  { id: 4, name: "Service Areas", icon: MapPin },
  { id: 5, name: "Legal & Bank", icon: FileText },
];

interface VendorFormData {
  // Step 0 - Account
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;

  // Step 1 - Company Profile
  companyName: string;
  companyEmail: string;
  tradeLicenseNumber: string;
  description: string;
  businessLandline: string;
  website: string;
  establishmentDate: string;

  // Step 2 - Primary Contact
  contactFirstName: string;
  contactLastName: string;
  designation: string;
  contactEmail: string;
  mobileNumber: string;
  emiratesId: string;

  // Step 3 - Services
  selectedCategories: string[];

  // Step 4 - Service Areas
  selectedServiceAreas: string[];

  // Step 5 - Legal & Bank
  tradeLicenseFile: File | null;
  vatCertificateFile: File | null;
  bankName: string;
  accountHolderName: string;
  iban: string;
  swiftCode: string;
  trn: string;
}

// Serializable version for localStorage (without File objects)
type SerializableFormData = Omit<VendorFormData, "tradeLicenseFile" | "vatCertificateFile"> & {
  tradeLicenseFileName?: string;
  vatCertificateFileName?: string;
};

const initialVendorFormData: VendorFormData = {
  // Step 0
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  // Step 1
  companyName: "",
  companyEmail: "",
  tradeLicenseNumber: "",
  description: "",
  businessLandline: "",
  website: "",
  establishmentDate: "",
  // Step 2
  contactFirstName: "",
  contactLastName: "",
  designation: "",
  contactEmail: "",
  mobileNumber: "",
  emiratesId: "",
  // Step 3
  selectedCategories: [],
  // Step 4
  selectedServiceAreas: [],
  // Step 5
  tradeLicenseFile: null,
  vatCertificateFile: null,
  bankName: "",
  accountHolderName: "",
  iban: "",
  swiftCode: "",
  trn: "",
};

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

  // Shared state
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // File refs
  const tradeLicenseRef = useRef<HTMLInputElement>(null);
  const vatCertificateRef = useRef<HTMLInputElement>(null);

  // Categories and service areas
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [serviceAreasLoading, setServiceAreasLoading] = useState(false);

  // Load saved vendor form data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY);

      if (savedData) {
        const parsed: SerializableFormData = JSON.parse(savedData);
        setVendorFormData({
          ...parsed,
          tradeLicenseFile: null,
          vatCertificateFile: null,
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
      const dataToSave: SerializableFormData = {
        ...vendorFormData,
        tradeLicenseFileName: vendorFormData.tradeLicenseFile?.name,
        vatCertificateFileName: vendorFormData.vatCertificateFile?.name,
      };
      const { tradeLicenseFile, vatCertificateFile, ...rest } = dataToSave as VendorFormData & SerializableFormData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  }, [vendorFormData, isHydrated, role]);

  // Save current vendor step to localStorage
  useEffect(() => {
    if (!isHydrated || role !== "vendor") return;
    localStorage.setItem(STORAGE_STEP_KEY, vendorStep.toString());
  }, [vendorStep, isHydrated, role]);

  // Clear localStorage on successful registration
  const clearSavedProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_STEP_KEY);
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
  const updateVendorFormData = (field: keyof VendorFormData, value: string | string[] | File | null) => {
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

    try {
      await register({
        first_name: vendorFormData.firstName,
        last_name: vendorFormData.lastName,
        email: vendorFormData.email,
        password: vendorFormData.password,
        password_confirmation: vendorFormData.passwordConfirmation,
        role: "vendor",
        company_name: vendorFormData.companyName,
        company_email: vendorFormData.companyEmail || undefined,
        trade_license_number: vendorFormData.tradeLicenseNumber,
        company_description: vendorFormData.description || undefined,
        landline: vendorFormData.businessLandline || undefined,
        website: vendorFormData.website || undefined,
        establishment: vendorFormData.establishmentDate || undefined,
        category_id: vendorFormData.selectedCategories[0] || undefined,
        service_area_ids: vendorFormData.selectedServiceAreas,
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
          category_id: "selectedCategories",
          service_area_ids: "selectedServiceAreas",
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
          selectedCategories: 3,
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

  const toggleCategory = (categoryId: string) => {
    const current = vendorFormData.selectedCategories;
    if (current.includes(categoryId)) {
      updateVendorFormData("selectedCategories", current.filter((id) => id !== categoryId));
    } else {
      updateVendorFormData("selectedCategories", [...current, categoryId]);
    }
  };

  const toggleServiceArea = (areaId: string) => {
    const current = vendorFormData.selectedServiceAreas;
    if (current.includes(areaId)) {
      updateVendorFormData("selectedServiceAreas", current.filter((id) => id !== areaId));
    } else {
      updateVendorFormData("selectedServiceAreas", [...current, areaId]);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "tradeLicenseFile" | "vatCertificateFile"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      updateVendorFormData(field, file);
    }
  };

  // Vendor Step Indicator
  const renderVendorStepIndicator = () => (
    <div className="flex items-center justify-center gap-1 mb-6">
      {VENDOR_STEPS.map((step, index) => {
        const StepIcon = step.icon;
        const isCompleted = vendorStep > step.id;
        const isCurrent = vendorStep === step.id;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isCurrent
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-gray-300 text-gray-400 bg-white"
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : <StepIcon className="w-3.5 h-3.5" />}
              </div>
              <span
                className={`text-[9px] mt-1 whitespace-nowrap ${
                  isCurrent ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < VENDOR_STEPS.length - 1 && (
              <div
                className={`w-4 h-0.5 mx-0.5 -mt-4 ${
                  vendorStep > step.id ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // Vendor Step 0 - Account
  const renderVendorStep0 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Join as a Vendor</h2>
        <p className="text-sm text-gray-500">Grow your business with No Problem</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={vendorFormData.firstName}
              onChange={(e) => updateVendorFormData("firstName", e.target.value)}
              placeholder="John"
              className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                vendorFieldErrors.firstName
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
          </div>
          {vendorFieldErrors.firstName && (
            <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={vendorFormData.lastName}
              onChange={(e) => updateVendorFormData("lastName", e.target.value)}
              placeholder="Doe"
              className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                vendorFieldErrors.lastName
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
          </div>
          {vendorFieldErrors.lastName && (
            <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Work Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={vendorFormData.email}
            onChange={(e) => updateVendorFormData("email", e.target.value)}
            placeholder="name@company.com"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              vendorFieldErrors.email
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
        </div>
        {vendorFieldErrors.email && <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            value={vendorFormData.password}
            onChange={(e) => updateVendorFormData("password", e.target.value)}
            placeholder="Min. 8 characters"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              vendorFieldErrors.password
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
        </div>
        {vendorFieldErrors.password && (
          <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            value={vendorFormData.passwordConfirmation}
            onChange={(e) => updateVendorFormData("passwordConfirmation", e.target.value)}
            placeholder="Confirm your password"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              vendorFieldErrors.passwordConfirmation
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
        </div>
        {vendorFieldErrors.passwordConfirmation && (
          <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.passwordConfirmation}</p>
        )}
      </div>
    </div>
  );

  // Vendor Step 1 - Company Profile
  const renderVendorStep1 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Company Profile</h3>
        <p className="text-sm text-gray-500">Tell us about your business entity.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
          <input
            type="text"
            value={vendorFormData.companyName}
            onChange={(e) => updateVendorFormData("companyName", e.target.value)}
            placeholder="Sparkle Cleaners LLC"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              vendorFieldErrors.companyName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {vendorFieldErrors.companyName && (
            <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.companyName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Email</label>
          <input
            type="email"
            value={vendorFormData.companyEmail}
            onChange={(e) => updateVendorFormData("companyEmail", e.target.value)}
            placeholder="info@sparkle.ae"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Trade License Number</label>
        <input
          type="text"
          value={vendorFormData.tradeLicenseNumber}
          onChange={(e) => updateVendorFormData("tradeLicenseNumber", e.target.value)}
          placeholder="DXB-12345"
          className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
            vendorFieldErrors.tradeLicenseNumber
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
        />
        {vendorFieldErrors.tradeLicenseNumber && (
          <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.tradeLicenseNumber}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea
          value={vendorFormData.description}
          onChange={(e) => updateVendorFormData("description", e.target.value)}
          placeholder="We provide professional home services..."
          rows={2}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Landline</label>
          <input
            type="tel"
            value={vendorFormData.businessLandline}
            onChange={(e) => updateVendorFormData("businessLandline", e.target.value)}
            placeholder="+971 4 000 0000"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
          <input
            type="url"
            value={vendorFormData.website}
            onChange={(e) => updateVendorFormData("website", e.target.value)}
            placeholder="www.example.com"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Establishment Date</label>
        <input
          type="date"
          value={vendorFormData.establishmentDate}
          onChange={(e) => updateVendorFormData("establishmentDate", e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>
    </div>
  );

  // Vendor Step 2 - Primary Contact
  const renderVendorStep2 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Primary Contact</h3>
        <p className="text-sm text-gray-500">Who is the main point of contact?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
          <input
            type="text"
            value={vendorFormData.contactFirstName}
            onChange={(e) => updateVendorFormData("contactFirstName", e.target.value)}
            placeholder="John"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              vendorFieldErrors.contactFirstName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {vendorFieldErrors.contactFirstName && (
            <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.contactFirstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
          <input
            type="text"
            value={vendorFormData.contactLastName}
            onChange={(e) => updateVendorFormData("contactLastName", e.target.value)}
            placeholder="Doe"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              vendorFieldErrors.contactLastName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {vendorFieldErrors.contactLastName && (
            <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.contactLastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation</label>
        <input
          type="text"
          value={vendorFormData.designation}
          onChange={(e) => updateVendorFormData("designation", e.target.value)}
          placeholder="e.g. Owner, Manager, Admin"
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input
            type="email"
            value={vendorFormData.contactEmail}
            onChange={(e) => updateVendorFormData("contactEmail", e.target.value)}
            placeholder="admin@sparkle.ae"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              vendorFieldErrors.contactEmail
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {vendorFieldErrors.contactEmail && (
            <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.contactEmail}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
          <input
            type="tel"
            value={vendorFormData.mobileNumber}
            onChange={(e) => updateVendorFormData("mobileNumber", e.target.value)}
            placeholder="+971 50 123 4567"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              vendorFieldErrors.mobileNumber
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {vendorFieldErrors.mobileNumber && (
            <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.mobileNumber}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Emirates ID (Optional)</label>
        <input
          type="text"
          value={vendorFormData.emiratesId}
          onChange={(e) => updateVendorFormData("emiratesId", e.target.value)}
          placeholder="784-xxxx-xxxxxxx-x"
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>
    </div>
  );

  // Vendor Step 3 - Services
  const renderVendorStep3 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Services & Offerings</h3>
        <p className="text-sm text-gray-500">Define the specific services you offer.</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Select Primary Category</h4>
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No categories available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  vendorFormData.selectedCategories.includes(category.id)
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
        {vendorFieldErrors.selectedCategories && (
          <p className="text-xs text-red-500 mt-2">{vendorFieldErrors.selectedCategories}</p>
        )}
      </div>
    </div>
  );

  // Vendor Step 4 - Service Areas
  const renderVendorStep4 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Service Areas</h3>
        <p className="text-sm text-gray-500">Which neighborhoods do you cover?</p>
      </div>

      {serviceAreasLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-gray-500">Loading service areas...</span>
        </div>
      ) : serviceAreas.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">No service areas available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {serviceAreas.map((area) => (
            <label key={area.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={vendorFormData.selectedServiceAreas.includes(area.id)}
                onChange={() => toggleServiceArea(area.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{area.name}</span>
            </label>
          ))}
        </div>
      )}
      {vendorFieldErrors.selectedServiceAreas && (
        <p className="text-xs text-red-500 mt-2">{vendorFieldErrors.selectedServiceAreas}</p>
      )}
    </div>
  );

  // Vendor Step 5 - Legal & Bank
  const renderVendorStep5 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Legal & Financial</h3>
        <p className="text-sm text-gray-500">Verify your business and set up payouts.</p>
      </div>

      {/* Documents Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Documents</h4>
        <div className="grid grid-cols-2 gap-3">
          {/* Trade License */}
          <div
            className={`border-2 border-dashed rounded-lg p-3 text-center ${
              vendorFieldErrors.tradeLicenseFile ? "border-red-400" : "border-gray-300"
            }`}
          >
            <FileText className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-900">Trade License</p>
            <p className="text-[10px] text-gray-500 mb-1">PDF/JPG (Required)</p>
            {vendorFormData.tradeLicenseFile ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-green-600 truncate max-w-full">
                  {vendorFormData.tradeLicenseFile.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => tradeLicenseRef.current?.click()}
                    className="px-2 py-0.5 text-[10px] font-medium text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVendorFormData("tradeLicenseFile", null)}
                    className="p-0.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => tradeLicenseRef.current?.click()}
                className="px-2 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50"
              >
                Upload
              </button>
            )}
            <input
              ref={tradeLicenseRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "tradeLicenseFile")}
              className="hidden"
            />
          </div>

          {/* VAT Certificate */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
            <FileText className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-900">VAT Certificate</p>
            <p className="text-[10px] text-gray-500 mb-1">PDF/JPG (Optional)</p>
            {vendorFormData.vatCertificateFile ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-green-600 truncate max-w-full">
                  {vendorFormData.vatCertificateFile.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => vatCertificateRef.current?.click()}
                    className="px-2 py-0.5 text-[10px] font-medium text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVendorFormData("vatCertificateFile", null)}
                    className="p-0.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => vatCertificateRef.current?.click()}
                className="px-2 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50"
              >
                Upload
              </button>
            )}
            <input
              ref={vatCertificateRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "vatCertificateFile")}
              className="hidden"
            />
          </div>
        </div>
        {vendorFieldErrors.tradeLicenseFile && (
          <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.tradeLicenseFile}</p>
        )}
      </div>

      {/* Bank Details Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Bank Details</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={vendorFormData.bankName}
                onChange={(e) => updateVendorFormData("bankName", e.target.value)}
                placeholder="e.g. Emirates NBD"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  vendorFieldErrors.bankName
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
              {vendorFieldErrors.bankName && (
                <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.bankName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
              <input
                type="text"
                value={vendorFormData.accountHolderName}
                onChange={(e) => updateVendorFormData("accountHolderName", e.target.value)}
                placeholder="Sparkle Cleaners LLC"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  vendorFieldErrors.accountHolderName
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
              {vendorFieldErrors.accountHolderName && (
                <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.accountHolderName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
            <input
              type="text"
              value={vendorFormData.iban}
              onChange={(e) => updateVendorFormData("iban", e.target.value)}
              placeholder="AE00 0000 0000 0000 0000 000"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                vendorFieldErrors.iban
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
            {vendorFieldErrors.iban && <p className="text-xs text-red-500 mt-1">{vendorFieldErrors.iban}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT Code</label>
              <input
                type="text"
                value={vendorFormData.swiftCode}
                onChange={(e) => updateVendorFormData("swiftCode", e.target.value)}
                placeholder="EMIRAE..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TRN (VAT Number)</label>
              <input
                type="text"
                value={vendorFormData.trn}
                onChange={(e) => updateVendorFormData("trn", e.target.value)}
                placeholder="100xxxxx..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Vendor Success Step
  const renderVendorSuccessStep = () => (
    <div className="py-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <div className="flex items-center justify-center gap-2 mb-3">
        <PartyPopper className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-900">Application Submitted!</h2>
        <PartyPopper className="w-5 h-5 text-yellow-500" />
      </div>
      <p className="text-gray-600 mb-1 text-sm">
        Thank you for registering as a vendor with NoProblem.
      </p>
      <p className="text-xs text-gray-500 mb-6">
        Our team will review your application and get back to you within 24-48 hours.
      </p>

      <div className="space-y-2">
        <button
          onClick={() => router.push("/vendor")}
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Vendor Dashboard
        </button>
        <Link
          href="/login"
          className="block w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Login
        </Link>
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg text-left">
        <h3 className="text-xs font-medium text-blue-900 mb-2">What happens next?</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li className="flex items-start gap-2">
            <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>We&apos;ll verify your trade license and documents</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>Your company profile will be reviewed</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>Once approved, you can start listing your services</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderVendorCurrentStep = () => {
    switch (vendorStep) {
      case 0: return renderVendorStep0();
      case 1: return renderVendorStep1();
      case 2: return renderVendorStep2();
      case 3: return renderVendorStep3();
      case 4: return renderVendorStep4();
      case 5: return renderVendorStep5();
      default: return null;
    }
  };

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
            placeholder="First name"
            disabled={isLoading}
            className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 ${
              adminFirstNameError
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-gray-400 focus:ring-gray-500/20"
            }`}
          />
          <div className="h-4 mt-1">
            {adminFirstNameError && <p className="text-sm text-red-500">{adminFirstNameError}</p>}
          </div>
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
            placeholder="Last name"
            disabled={isLoading}
            className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 ${
              adminLastNameError
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-gray-400 focus:ring-gray-500/20"
            }`}
          />
          <div className="h-4 mt-1">
            {adminLastNameError && <p className="text-sm text-red-500">{adminLastNameError}</p>}
          </div>
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
        <input
          type="email"
          value={adminEmail}
          onChange={(e) => {
            setAdminEmail(e.target.value);
            if (e.target.value && !validateEmail(e.target.value)) {
              setAdminEmailError("Please enter a valid email address");
            } else {
              setAdminEmailError("");
            }
          }}
          placeholder="Email address"
          disabled={isLoading}
          className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 ${
            adminEmailError
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-gray-400 focus:ring-gray-500/20"
          }`}
        />
        <div className="h-4 mt-1">
          {adminEmailError && <p className="text-sm text-red-500">{adminEmailError}</p>}
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          type="password"
          value={adminPassword}
          onChange={(e) => {
            setAdminPassword(e.target.value);
            if (e.target.value && e.target.value.length < 8) {
              setAdminPasswordError("Password must be at least 8 characters");
            } else {
              setAdminPasswordError("");
            }
            if (adminConfirmPassword && e.target.value !== adminConfirmPassword) {
              setAdminConfirmPasswordError("Passwords do not match");
            } else {
              setAdminConfirmPasswordError("");
            }
          }}
          placeholder="Password"
          disabled={isLoading}
          className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 ${
            adminPasswordError
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-gray-400 focus:ring-gray-500/20"
          }`}
        />
        <div className="h-4 mt-1">
          {adminPasswordError && <p className="text-sm text-red-500">{adminPasswordError}</p>}
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <input
          type="password"
          value={adminConfirmPassword}
          onChange={(e) => {
            setAdminConfirmPassword(e.target.value);
            if (e.target.value && e.target.value !== adminPassword) {
              setAdminConfirmPasswordError("Passwords do not match");
            } else {
              setAdminConfirmPasswordError("");
            }
          }}
          placeholder="Confirm password"
          disabled={isLoading}
          className={`w-full px-4 py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 ${
            adminConfirmPasswordError
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-gray-400 focus:ring-gray-500/20"
          }`}
        />
        <div className="h-4 mt-1">
          {adminConfirmPasswordError && (
            <p className="text-sm text-red-500">{adminConfirmPasswordError}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isAdminFormValid}
        className="w-full h-12 text-sm font-semibold rounded-lg transition-all duration-200 text-white disabled:cursor-not-allowed mt-2"
        style={{
          background: isLoading ? "#1D4ED8" : !isAdminFormValid ? "#9CA3AF" : "#2563EB",
          border: `1px solid ${isLoading ? "#1D4ED8" : !isAdminFormValid ? "#9CA3AF" : "#2563EB"}`,
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
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creating account...
          </span>
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
        {renderVendorStepIndicator()}

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
        <div className={`flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto ${role === "admin" ? "justify-center" : ""}`}>
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
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 text-sm font-medium rounded-lg border transition-all duration-200 disabled:opacity-50 bg-blue-600 text-white border-blue-600"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("vendor")}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 text-sm font-medium rounded-lg border transition-all duration-200 disabled:opacity-50 bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  >
                    Vendor
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

            {/* Form Content */}
            {role === "admin" ? renderAdminForm() : renderVendorForm()}

            {/* Sign in link */}
            {(role === "admin" || (role === "vendor" && !isVendorSubmitted)) && (
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
