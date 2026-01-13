"use client";

import { User, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { TechnicianTrackerProps } from "./types";
import { getTechnicianStatusInfo } from "./helpers/orderFormatters";

const TRACKING_STEPS = ["Assigned", "Accepted", "On the Way", "Arrived", "Working"];

export function TechnicianTracker({
  technician,
  technicianStatus,
  onChatWithTechnician,
}: TechnicianTrackerProps) {
  const statusInfo = getTechnicianStatusInfo(technicianStatus);

  if (!statusInfo) return null;

  const StatusIcon = statusInfo.icon;

  return (
    <div className={`border rounded-lg p-4 ${statusInfo.color}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full bg-white/80 ${statusInfo.iconColor}`}>
          <StatusIcon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{statusInfo.label}</h3>
          <p className="text-sm opacity-80 mt-1">{statusInfo.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{technician.name}</span>
            </div>
            {technician.phone && (
              <a
                href={`tel:${technician.phone}`}
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            )}
            <button
              onClick={onChatWithTechnician}
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </button>
          </div>
        </div>
      </div>
      {/* Progress Steps */}
      <div className="mt-4 pt-4 border-t border-current/20">
        <div className="flex items-center justify-between">
          {TRACKING_STEPS.map((step, idx) => {
            const currentStep = statusInfo.step;
            const isCompleted = idx + 1 < currentStep;
            const isCurrent = idx + 1 === currentStep;
            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCompleted
                      ? "bg-white text-current"
                      : isCurrent
                      ? "bg-white text-current ring-2 ring-white"
                      : "bg-current/20 text-current/60"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${isCurrent ? "font-medium" : "opacity-60"}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
