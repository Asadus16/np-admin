"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Calendar,
  Navigation,
  MessageSquare,
  Camera,
  CheckCircle,
  PlayCircle,
  FileText,
  CreditCard,
  User,
  Building2,
  AlertCircle,
  Loader2,
  Car,
  MapPinned,
  X,
  Upload,
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchJob,
  acknowledgeJob,
  markOnTheWay,
  markArrived,
  startJob,
  completeJob,
  addNote,
  uploadEvidence,
  deleteEvidence,
  clearCurrentJob,
  clearError,
} from "@/store/slices/technicianJobSlice";
import { TechnicianStatus } from "@/types/technicianJob";
import { formatDate, formatTime, formatCurrency } from "@/lib/vendorOrder";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentJob: job, isLoading, isSubmitting, error } = useAppSelector(
    (state) => state.technicianJob
  );

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [jobNotes, setJobNotes] = useState("");
  const [evidenceType, setEvidenceType] = useState<"before" | "after" | "other">("before");
  const [evidenceCaption, setEvidenceCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchJob(params.id as string));
    }
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [dispatch, params.id]);

  const getStatusColor = (status: TechnicianStatus) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-700";
      case "acknowledged":
        return "bg-blue-100 text-blue-700";
      case "on_the_way":
        return "bg-orange-100 text-orange-700";
      case "arrived":
        return "bg-purple-100 text-purple-700";
      case "in_progress":
        return "bg-indigo-100 text-indigo-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: TechnicianStatus) => {
    switch (status) {
      case "assigned":
        return "Assigned";
      case "acknowledged":
        return "Acknowledged";
      case "on_the_way":
        return "On the Way";
      case "arrived":
        return "Arrived";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const handleAction = async () => {
    if (!job) return;

    switch (job.technician_status) {
      case "assigned":
        await dispatch(acknowledgeJob(job.id));
        break;
      case "acknowledged":
        await dispatch(markOnTheWay(job.id));
        openNavigation();
        break;
      case "on_the_way":
        await dispatch(markArrived(job.id));
        break;
      case "arrived":
        await dispatch(startJob(job.id));
        break;
      case "in_progress":
        setShowCompleteModal(true);
        break;
    }
  };

  const handleComplete = async () => {
    if (!job) return;
    await dispatch(completeJob(job.id));
    setShowCompleteModal(false);
  };

  const handleAddNote = async () => {
    if (!job || !jobNotes.trim()) return;
    await dispatch(addNote({ jobId: job.id, content: jobNotes }));
    setJobNotes("");
    setShowNotesModal(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!job || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    await dispatch(
      uploadEvidence({ jobId: job.id, file, type: evidenceType, caption: evidenceCaption || undefined })
    );
    setEvidenceCaption("");
    setShowEvidenceModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteEvidence = async (evidenceId: string) => {
    if (!job) return;
    await dispatch(deleteEvidence({ jobId: job.id, evidenceId }));
  };

  const openNavigation = () => {
    if (job?.address.latitude && job?.address.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${job.address.latitude},${job.address.longitude}`;
      window.open(url, "_blank");
    }
  };

  const getNextAction = () => {
    if (!job) return null;

    switch (job.technician_status) {
      case "assigned":
        return { label: "Accept Job", icon: CheckCircle, color: "bg-green-600 hover:bg-green-700" };
      case "acknowledged":
        return { label: "On the Way", icon: Car, color: "bg-orange-600 hover:bg-orange-700" };
      case "on_the_way":
        return { label: "Mark Arrived", icon: MapPinned, color: "bg-purple-600 hover:bg-purple-700" };
      case "arrived":
        return { label: "Start Job", icon: PlayCircle, color: "bg-blue-600 hover:bg-blue-700" };
      case "in_progress":
        return { label: "Complete Job", icon: CheckCircle, color: "bg-green-600 hover:bg-green-700" };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  const getTimeline = () => {
    if (!job) return [];
    return [
      { status: "Assigned", time: job.assigned_at, completed: !!job.assigned_at },
      { status: "Acknowledged", time: job.acknowledged_at, completed: !!job.acknowledged_at },
      { status: "On the Way", time: job.on_the_way_at, completed: !!job.on_the_way_at },
      { status: "Arrived", time: job.arrived_at, completed: !!job.arrived_at },
      { status: "Started", time: job.started_at, completed: !!job.started_at },
      { status: "Completed", time: job.completed_at, completed: !!job.completed_at },
    ];
  };

  if (isLoading && !job) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Job not found</p>
        <Link href="/technician/jobs" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/technician/jobs"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{job.order_number}</h1>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(job.technician_status)}`}>
                {getStatusLabel(job.technician_status)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{formatCurrency(job.total)}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error.message}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="ml-auto text-sm font-medium text-red-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Action Button */}
      {nextAction && job.technician_status !== "completed" && job.technician_status !== "cancelled" && (
        <button
          onClick={handleAction}
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-medium text-white rounded-lg disabled:opacity-50 ${nextAction.color}`}
        >
          {isSubmitting ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <nextAction.icon className="h-6 w-6" />
          )}
          {nextAction.label}
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Location */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Customer Details</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.customer.name}</p>
                  <a href={`tel:${job.customer.phone}`} className="text-sm text-blue-600 hover:underline">
                    {job.customer.phone}
                  </a>
                </div>
                <div className="ml-auto flex gap-2">
                  <a
                    href={`tel:${job.customer.phone}`}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Phone className="h-5 w-5 text-gray-600" />
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">
                      {job.address.street_address}
                      {job.address.building && `, ${job.address.building}`}
                      {job.address.apartment && `, Apt ${job.address.apartment}`}
                    </p>
                    <p className="text-sm text-gray-500">{job.address.city}, {job.address.emirate}</p>
                  </div>
                </div>
                <button
                  onClick={openNavigation}
                  disabled={!job.address.latitude || !job.address.longitude}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  <Navigation className="h-4 w-4" />
                  Open in Maps
                </button>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Services</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {job.items.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {item.service_name}
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{item.sub_service_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {item.duration_minutes} mins
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatCurrency(item.total_price)}
                      </p>
                    </div>
                  </div>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Special Instructions</p>
                  <p className="text-sm text-yellow-700 mt-1">{job.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Evidence Photos */}
          {job.evidence && job.evidence.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Evidence Photos</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {job.evidence.map((e) => (
                    <div key={e.id} className="relative group">
                      <img
                        src={e.url}
                        alt={e.caption || e.type}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 text-xs font-medium bg-black/50 text-white rounded">
                          {e.type}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteEvidence(e.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {e.caption && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{e.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Order Notes */}
          {job.order_notes && job.order_notes.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Job Notes</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {job.order_notes.map((note) => (
                  <div key={note.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{note.author.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{job.payment_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(job.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    job.payment_status === "paid" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {job.payment_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Scheduled For</h3>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>{formatDate(job.scheduled_date)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 mt-2">
              <Clock className="h-5 w-5" />
              <span>{formatTime(job.scheduled_time)}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Duration: {job.total_duration_minutes} mins
            </div>
          </div>

          {/* Company/Vendor */}
          {job.company && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Company</h3>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">{job.company.name}</p>
                  {job.company.phone && (
                    <p className="text-xs text-gray-500">{job.company.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Job Timeline</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {getTimeline().map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      item.completed ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${item.completed ? "text-gray-900" : "text-gray-400"}`}>
                        {item.status}
                      </p>
                      {item.time && (
                        <p className="text-xs text-gray-500">
                          {new Date(item.time).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {job.technician_status !== "completed" && job.technician_status !== "cancelled" && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <button
                onClick={() => setShowNotesModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <FileText className="h-4 w-4" />
                Add Job Notes
              </button>
              <button
                onClick={() => setShowEvidenceModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Camera className="h-4 w-4" />
                Upload Photos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Job Notes</h3>
              <button onClick={() => setShowNotesModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <textarea
              rows={4}
              value={jobNotes}
              onChange={(e) => setJobNotes(e.target.value)}
              placeholder="Enter notes about this job..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={isSubmitting || !jobNotes.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Evidence</h3>
              <button onClick={() => setShowEvidenceModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo Type</label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value as "before" | "after" | "other")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                >
                  <option value="before">Before</option>
                  <option value="after">After</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  value={evidenceCaption}
                  onChange={(e) => setEvidenceCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                />
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      Select Photo
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Job Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Complete Job</h3>
              <button onClick={() => setShowCompleteModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to mark this job as complete? Please ensure all services have been performed.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Mark Complete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
