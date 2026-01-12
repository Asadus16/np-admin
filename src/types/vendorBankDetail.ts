// Vendor bank detail types

export interface VendorBankDetail {
  id: string;
  bank_name: string;
  account_holder_name: string;
  iban: string;
  swift_code: string | null;
  trn: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorBankDetailResponse {
  status: string;
  data: VendorBankDetail | null;
  message?: string;
}

export interface CreateVendorBankDetailData {
  bank_name: string;
  account_holder_name: string;
  iban: string;
  swift_code?: string;
  trn?: string;
}

export interface UpdateVendorBankDetailData {
  bank_name?: string;
  account_holder_name?: string;
  iban?: string;
  swift_code?: string;
  trn?: string;
}
