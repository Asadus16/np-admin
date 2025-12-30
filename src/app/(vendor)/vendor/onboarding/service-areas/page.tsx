"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Search } from "lucide-react";

const serviceAreas = [
  { id: 1, name: "San Francisco", state: "CA", zip: "94102", radius: 15, active: true },
  { id: 2, name: "Oakland", state: "CA", zip: "94612", radius: 10, active: true },
  { id: 3, name: "Berkeley", state: "CA", zip: "94704", radius: 8, active: false },
];

export default function ServiceAreasPage() {
  const [areas, setAreas] = useState(serviceAreas);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleArea = (id: number) => {
    setAreas(areas.map((area) =>
      area.id === id ? { ...area, active: !area.active } : area
    ));
  };

  const removeArea = (id: number) => {
    setAreas(areas.filter((area) => area.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Service Areas</h1>
        <p className="text-sm text-gray-500 mt-1">Define the geographic areas where you provide services</p>
      </div>

      {/* Add New Area */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add Service Area</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city, ZIP code, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="sr-only">Radius</label>
              <select className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400">
                <option value="5">5 miles</option>
                <option value="10">10 miles</option>
                <option value="15">15 miles</option>
                <option value="20">20 miles</option>
                <option value="25">25 miles</option>
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Area
            </button>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Interactive map will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Active Areas */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Service Areas</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {areas.map((area) => (
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
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      area.active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
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

      {/* Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Service areas determine where customers can find and book your services.
          You can enable or disable areas at any time.
        </p>
      </div>
    </div>
  );
}
