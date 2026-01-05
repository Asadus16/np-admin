// Service and Sub-service types for vendor signup
export interface SubServiceOption {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

export interface VendorService {
  id: string;
  name: string;
  description: string;
  image: File | null;
  imageName?: string;
  subServices: SubServiceOption[];
}

export interface VendorFormData {
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
  latitude: number | null;
  longitude: number | null;

  // Step 2 - Primary Contact
  contactFirstName: string;
  contactLastName: string;
  designation: string;
  contactEmail: string;
  mobileNumber: string;
  emiratesId: string;

  // Step 3 - Services
  selectedCategories: string[];
  services: VendorService[];

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

export interface CustomerFormData {
  // Step 0 - Account
  firstName: string;
  lastName: string;
  nationality: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;

  // Step 1 - Emirates ID
  emiratesIdNumber: string;
  emiratesIdFront: File | null;
  emiratesIdBack: File | null;

  // Step 2 - Location
  addressLabel: string;
  street: string;
  building: string;
  apartment: string;
  city: string;
  emirate: string;
  latitude: number | null;
  longitude: number | null;

  // Step 3 - Phone Verification
  otpCode: string;
  isPhoneVerified: boolean;

  // Step 4 - Payment (Optional)
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  skipPayment: boolean;
}

// Serializable versions for localStorage (without File objects)
export type SerializableVendorFormData = Omit<VendorFormData, "tradeLicenseFile" | "vatCertificateFile" | "services"> & {
  tradeLicenseFileName?: string;
  vatCertificateFileName?: string;
  services: Array<Omit<VendorService, "image"> & { imageName?: string }>;
};

export type SerializableCustomerFormData = Omit<CustomerFormData, "emiratesIdFront" | "emiratesIdBack"> & {
  emiratesIdFrontName?: string;
  emiratesIdBackName?: string;
};
