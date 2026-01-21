"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Plus, Check, MoreVertical, Edit, Trash2, X, AlertCircle } from "lucide-react";
import {
  getVendorBankDetail,
  createOrUpdateVendorBankDetail,
  deleteVendorBankDetail,
  formatIBAN,
} from "@/lib/vendorBankDetail";
import { VendorBankDetail, CreateVendorBankDetailData } from "@/types/vendorBankDetail";
import { useAuth } from "@/hooks/useAuth";

export default function PayoutMethodsPage() {
  const { token } = useAuth();
  const [bankDetail, setBankDetail] = useState<VendorBankDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [formData, setFormData] = useState<CreateVendorBankDetailData>({
    bank_name: "",
    account_holder_name: "",
    iban: "",
    swift_code: "",
    trn: "",
  });

  useEffect(() => {
    if (!token) return;
    fetchBankDetail();
  }, [token]);

  const fetchBankDetail = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await getVendorBankDetail();
      setBankDetail(response.data);
      if (response.data) {
        setFormData({
          bank_name: response.data.bank_name,
          account_holder_name: response.data.account_holder_name,
          iban: response.data.iban,
          swift_code: response.data.swift_code || "",
          trn: response.data.trn || "",
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch bank details:", err);
      if (err.status !== 404) {
        setError(err.message || "Failed to load bank details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Normalize IBAN (remove spaces, convert to uppercase)
      const normalizedData = {
        ...formData,
        iban: formData.iban.replace(/\s/g, "").toUpperCase(),
        swift_code: formData.swift_code?.trim().toUpperCase() || undefined,
        trn: formData.trn?.trim() || undefined,
      };

      await createOrUpdateVendorBankDetail(normalizedData);
      await fetchBankDetail();
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || "Failed to save bank details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await deleteVendorBankDetail();
      setBankDetail(null);
      setShowDeleteConfirm(false);
      setFormData({
        bank_name: "",
        account_holder_name: "",
        iban: "",
        swift_code: "",
        trn: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to delete bank details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (bankDetail) {
      setFormData({
        bank_name: bankDetail.bank_name,
        account_holder_name: bankDetail.account_holder_name,
        iban: bankDetail.iban,
        swift_code: bankDetail.swift_code || "",
        trn: bankDetail.trn || "",
      });
    }
    setShowForm(true);
    setOpenMenu(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">Loading bank details...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/wallet" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Payout Methods</h1>
          <p className="text-sm text-gray-500 mt-1">Manage how you receive your earnings</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="max-w-2xl">
        {!showForm && !bankDetail && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Bank Details Added</h3>
            <p className="text-sm text-gray-500 mb-6">
              Add your bank details to receive payouts from completed orders.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bank Details
            </button>
          </div>
        )}

        {!showForm && bankDetail && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Your Bank Details</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                  {openMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenMenu(false)}
                      />
                      <div className="absolute right-0 z-50 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        <button
                          onClick={handleEdit}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(true);
                            setOpenMenu(false);
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                    <p className="text-sm font-medium text-gray-900">{bankDetail.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Account Holder Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {bankDetail.account_holder_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">IBAN</p>
                    <p className="text-sm font-medium text-gray-900 font-mono">
                      {formatIBAN(bankDetail.iban)}
                    </p>
                  </div>
                  {bankDetail.swift_code && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">SWIFT Code</p>
                      <p className="text-sm font-medium text-gray-900 font-mono">
                        {bankDetail.swift_code}
                      </p>
                    </div>
                  )}
                  {bankDetail.trn && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">TRN</p>
                      <p className="text-sm font-medium text-gray-900">{bankDetail.trn}</p>
                    </div>
                  )}
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                  <Check className="h-3 w-3" />
                  Active
                </div>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {bankDetail ? "Edit Bank Details" : "Add Bank Details"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                  if (bankDetail) {
                    setFormData({
                      bank_name: bankDetail.bank_name,
                      account_holder_name: bankDetail.account_holder_name,
                      iban: bankDetail.iban,
                      swift_code: bankDetail.swift_code || "",
                      trn: bankDetail.trn || "",
                    });
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={formData.bank_name}
                  onChange={(e) =>
                    setFormData({ ...formData, bank_name: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={formData.account_holder_name}
                  onChange={(e) =>
                    setFormData({ ...formData, account_holder_name: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN *
                </label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      iban: e.target.value.replace(/\s/g, "").toUpperCase(),
                    })
                  }
                  placeholder="AE123456789012345678901"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
                  required
                  minLength={15}
                  maxLength={34}
                />
                <p className="text-xs text-gray-500 mt-1">
                  International Bank Account Number (15-34 characters)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SWIFT Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.swift_code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      swift_code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="ABCDEFGH"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
                  maxLength={11}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Bank Identifier Code (8 or 11 characters)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TRN (Tax Registration Number) (Optional)
                </label>
                <input
                  type="text"
                  value={formData.trn}
                  onChange={(e) =>
                    setFormData({ ...formData, trn: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : bankDetail ? "Update" : "Add"} Bank Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError(null);
                    if (bankDetail) {
                      setFormData({
                        bank_name: bankDetail.bank_name,
                        account_holder_name: bankDetail.account_holder_name,
                        iban: bankDetail.iban,
                        swift_code: bankDetail.swift_code || "",
                        trn: bankDetail.trn || "",
                      });
                    }
                  }}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Bank Details</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to remove your bank details? You won't be able to receive
                payouts until you add new bank details.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Payout Schedule</h3>
          <p className="text-sm text-gray-600">
            Payouts are processed manually by admin. Once your payout request is approved and
            marked as paid, funds will be transferred to the bank account listed above.
          </p>
        </div>
      </div>
    </div>
  );
}
