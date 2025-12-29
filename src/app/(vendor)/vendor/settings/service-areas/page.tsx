"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";

const areas = [
  { id: 1, name: "San Francisco", state: "CA", zip: "94102", radius: 15, active: true },
  { id: 2, name: "Oakland", state: "CA", zip: "94612", radius: 10, active: true },
  { id: 3, name: "Berkeley", state: "CA", zip: "94704", radius: 8, active: false },
];

export default function ServiceAreasSettingsPage() {
  const [serviceAreas, setServiceAreas] = useState(areas);

  const toggleArea = (id: number) => {
    setServiceAreas(serviceAreas.map((area) =>
      area.id === id ? { ...area, active: !area.active } : area
    ));
  };

  const removeArea = (id: number) => {
    setServiceAreas(serviceAreas.filter((area) => area.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/settings" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Service Areas</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your service coverage areas</p>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Add New */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter city or ZIP code"
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
            <select className="px-4 py-2 text-sm border border-gray-300 rounded-lg">
              <option>10 miles</option>
              <option>15 miles</option>
              <option>20 miles</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
        </div>

        {/* List */}
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          {serviceAreas.map((area) => (
            <div key={area.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${area.active ? "bg-green-100" : "bg-gray-100"}`}>
                  <MapPin className={`h-5 w-5 ${area.active ? "text-green-600" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {area.name}, {area.state} {area.zip}
                  </p>
                  <p className="text-xs text-gray-500">{area.radius} mile radius</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleArea(area.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    area.active ? "bg-green-500" : "bg-gray-200"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    area.active ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
                <button
                  onClick={() => removeArea(area.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
