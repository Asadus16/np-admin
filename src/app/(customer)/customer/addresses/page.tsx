"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star, Home, Building, Check } from "lucide-react";

// Static addresses data
const initialAddresses = [
  {
    id: "1",
    label: "Home",
    street: "123 Sheikh Zayed Road",
    building: "Marina Tower",
    apartment: "Apt 1502",
    city: "Dubai Marina",
    emirate: "Dubai",
    isDefault: true,
    type: "home",
  },
  {
    id: "2",
    label: "Office",
    street: "456 Business Bay Boulevard",
    building: "Bay Square",
    apartment: "Office 801",
    city: "Business Bay",
    emirate: "Dubai",
    isDefault: false,
    type: "office",
  },
  {
    id: "3",
    label: "Parents House",
    street: "789 Al Wasl Road",
    building: "Villa 42",
    apartment: "",
    city: "Jumeirah",
    emirate: "Dubai",
    isDefault: false,
    type: "home",
  },
];

const emirates = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    street: "",
    building: "",
    apartment: "",
    city: "",
    emirate: "Dubai",
    type: "home",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleEdit = (address: typeof initialAddresses[0]) => {
    setFormData({
      label: address.label,
      street: address.street,
      building: address.building,
      apartment: address.apartment,
      city: address.city,
      emirate: address.emirate,
      type: address.type,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingId
            ? { ...addr, ...formData }
            : addr
        )
      );
    } else {
      const newAddress = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddress]);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({
      label: "",
      street: "",
      building: "",
      apartment: "",
      city: "",
      emirate: "Dubai",
      type: "home",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5 text-gray-500" />;
      case "office":
        return <Building className="h-5 w-5 text-gray-500" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your saved addresses</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              label: "",
              street: "",
              building: "",
              apartment: "",
              city: "",
              emirate: "Dubai",
              type: "home",
            });
          }}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                name="label"
                placeholder="e.g., Home, Office, Parents"
                value={formData.label}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                placeholder="Street name and number"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Building/Villa Name</label>
              <input
                type="text"
                name="building"
                placeholder="Building or villa name"
                value={formData.building}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apartment/Office (Optional)</label>
              <input
                type="text"
                name="apartment"
                placeholder="Apt/Office number"
                value={formData.apartment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City/Area</label>
              <input
                type="text"
                name="city"
                placeholder="City or area name"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emirate</label>
              <select
                name="emirate"
                value={formData.emirate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                {emirates.map((em) => (
                  <option key={em} value={em}>{em}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Location</label>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Map integration placeholder</p>
                <p className="text-xs text-gray-400">Click to pin exact location</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              {editingId ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No addresses saved</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white border rounded-lg p-4 ${
                address.isDefault ? "border-gray-900" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(address.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{address.label}</p>
                      {address.isDefault && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.street}
                      {address.building && `, ${address.building}`}
                      {address.apartment && `, ${address.apartment}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {address.city}, {address.emirate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Set as default"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
