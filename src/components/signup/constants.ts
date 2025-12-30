import {
  Building2,
  User,
  Briefcase,
  MapPin,
  FileText,
  Shield,
  Phone,
  CreditCard,
  Home,
} from "lucide-react";
import { VendorFormData, CustomerFormData } from "./types";

// Vendor step definitions
export const VENDOR_STEPS = [
  { id: 0, name: "Account", icon: User },
  { id: 1, name: "Company Profile", icon: Building2 },
  { id: 2, name: "Primary Contact", icon: User },
  { id: 3, name: "Services", icon: Briefcase },
  { id: 4, name: "Service Areas", icon: MapPin },
  { id: 5, name: "Legal & Bank", icon: FileText },
];

// Customer step definitions
export const CUSTOMER_STEPS = [
  { id: 0, name: "Account", icon: User },
  { id: 1, name: "Emirates ID", icon: Shield },
  { id: 2, name: "Location", icon: Home },
  { id: 3, name: "Verify Phone", icon: Phone },
  { id: 4, name: "Payment", icon: CreditCard },
];

// Nationality options for UAE
export const NATIONALITIES = [
  "Afghan", "Albanian", "Algerian", "American", "Argentine", "Australian", "Austrian",
  "Bahraini", "Bangladeshi", "Belgian", "Brazilian", "British", "Bulgarian",
  "Canadian", "Chinese", "Colombian", "Croatian", "Czech",
  "Danish", "Dutch",
  "Egyptian", "Emirati", "Ethiopian",
  "Filipino", "Finnish", "French",
  "German", "Greek",
  "Hungarian",
  "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Italian",
  "Japanese", "Jordanian",
  "Kenyan", "Korean", "Kuwaiti",
  "Lebanese",
  "Malaysian", "Mexican", "Moroccan",
  "Nepalese", "New Zealander", "Nigerian", "Norwegian",
  "Omani",
  "Pakistani", "Palestinian", "Peruvian", "Polish", "Portuguese",
  "Qatari",
  "Romanian", "Russian",
  "Saudi", "Serbian", "Singaporean", "South African", "Spanish", "Sri Lankan", "Sudanese", "Swedish", "Swiss", "Syrian",
  "Thai", "Tunisian", "Turkish",
  "Ukrainian",
  "Vietnamese",
  "Yemeni",
  "Other",
];

// Emirates options
export const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

// Initial form data
export const initialVendorFormData: VendorFormData = {
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
  services: [],
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

export const initialCustomerFormData: CustomerFormData = {
  // Step 0
  firstName: "",
  lastName: "",
  nationality: "",
  email: "",
  phone: "",
  password: "",
  passwordConfirmation: "",
  // Step 1
  emiratesIdNumber: "",
  emiratesIdFront: null,
  emiratesIdBack: null,
  // Step 2
  addressLabel: "Home",
  street: "",
  building: "",
  apartment: "",
  city: "",
  emirate: "",
  latitude: null,
  longitude: null,
  // Step 3
  otpCode: "",
  isPhoneVerified: false,
  // Step 4
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
  cardName: "",
  skipPayment: false,
};

// LocalStorage keys
export const VENDOR_STORAGE_KEY = "np_vendor_signup_form";
export const VENDOR_STEP_STORAGE_KEY = "np_vendor_signup_step";
export const CUSTOMER_STORAGE_KEY = "np_customer_signup_form";
export const CUSTOMER_STEP_STORAGE_KEY = "np_customer_signup_step";
