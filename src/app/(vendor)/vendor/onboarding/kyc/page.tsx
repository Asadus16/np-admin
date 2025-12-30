"use client";

import { useState } from "react";
import { FileText, Upload, Check, Clock, AlertCircle } from "lucide-react";

const documents = [
  { id: 1, name: "Business License", status: "verified", uploadedAt: "2024-03-10" },
  { id: 2, name: "Insurance Certificate", status: "verified", uploadedAt: "2024-03-10" },
  { id: 3, name: "Tax ID (EIN)", status: "pending", uploadedAt: "2024-03-15" },
  { id: 4, name: "Owner ID", status: "required", uploadedAt: null },
];

export default function KYCPage() {
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
            <Check className="h-3 w-3" /> Verified
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700">
            <Clock className="h-3 w-3" /> Pending Review
          </span>
        );
      case "required":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700">
            <AlertCircle className="h-3 w-3" /> Required
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">KYC Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Upload required documents to verify your business</p>
      </div>

      {/* Progress Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900">Verification Progress</span>
          <span className="text-sm text-blue-700">2 of 4 documents verified</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "50%" }} />
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Required Documents</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  {doc.uploadedAt && (
                    <p className="text-xs text-gray-500">Uploaded {doc.uploadedAt}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(doc.status)}
                {doc.status !== "verified" && (
                  <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Upload className="h-4 w-4 mr-1" />
                    {doc.status === "required" ? "Upload" : "Replace"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New Document</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
          <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
          <button className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Select Files
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Why do we need these documents?</h3>
        <p className="text-sm text-gray-600">
          Verifying your business documents helps us ensure the safety and trust of our platform.
          All documents are securely stored and only used for verification purposes.
        </p>
      </div>
    </div>
  );
}
