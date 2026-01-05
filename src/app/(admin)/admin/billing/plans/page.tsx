"use client";

import { useState, useEffect } from "react";
import { Check, Zap, Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPlans, createPlan, updatePlan, deletePlan } from "@/store/slices/planSlice";
import { Plan, PlanFormData } from "@/types/plan";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null;
  onSubmit: (data: PlanFormData) => void;
  isSubmitting: boolean;
}

function PlanModal({ isOpen, onClose, plan, onSubmit, isSubmitting }: PlanModalProps) {
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    description: "",
    monthly_price: null,
    yearly_price: null,
    status: true,
    discount: null,
    commission: null,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description || "",
        monthly_price: plan.monthly_price,
        yearly_price: plan.yearly_price,
        status: plan.status,
        discount: plan.discount,
        commission: plan.commission,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        monthly_price: null,
        yearly_price: null,
        status: true,
        discount: null,
        commission: null,
      });
    }
  }, [plan, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {plan ? "Edit Plan" : "Create Plan"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g., Basic, Pro, Enterprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                rows={2}
                placeholder="Brief description of the plan"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (AED)</label>
                <input
                  type="number"
                  value={formData.monthly_price ?? ""}
                  onChange={(e) => setFormData({ ...formData, monthly_price: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price (AED)</label>
                <input
                  type="number"
                  value={formData.yearly_price ?? ""}
                  onChange={(e) => setFormData({ ...formData, yearly_price: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Save on yearly (%)</label>
                <input
                  type="number"
                  value={formData.discount ?? ""}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="10"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
                <input
                  type="number"
                  value={formData.commission ?? ""}
                  onChange={(e) => setFormData({ ...formData, commission: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="5"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="status"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="status" className="text-sm font-medium text-gray-700">Active</label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : plan ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const dispatch = useAppDispatch();
  const { plans, isLoading, isSubmitting, error } = useAppSelector((state) => state.plan);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPlans(1));
  }, [dispatch]);

  const getPrice = (plan: Plan) => {
    if (billingCycle === "monthly") {
      return plan.monthly_price || 0;
    }
    return plan.yearly_price || 0;
  };

  const getIsPopular = (index: number, total: number) => {
    if (total === 3) return index === 1;
    return false;
  };

  // Get max discount from all plans for the "Save up to X%" display
  const maxDiscount = plans.reduce((max, plan) => {
    return plan.discount && plan.discount > max ? plan.discount : max;
  }, 0);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = async (data: PlanFormData) => {
    if (editingPlan) {
      await dispatch(updatePlan({ id: editingPlan.id, data }));
    } else {
      await dispatch(createPlan(data));
    }
    handleCloseModal();
    dispatch(fetchPlans(1));
  };

  const handleDelete = async (planId: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      setDeletingPlanId(planId);
      await dispatch(deletePlan(planId));
      setDeletingPlanId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load plans</p>
          <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          <button
            onClick={() => dispatch(fetchPlans(1))}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const displayPlans = plans;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Manage Plans</h1>
          <p className="text-sm text-gray-500">Create and manage subscription plans</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add Plan
        </button>
      </div>

      {displayPlans.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 font-medium">No plans available</p>
            <p className="text-sm text-gray-500 mt-1">Create your first plan to get started</p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create Plan
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Billing Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                  billingCycle === "yearly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Yearly
                {maxDiscount > 0 && <span className="ml-2 text-xs text-green-600 font-semibold">Save up to {maxDiscount}%</span>}
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className={`grid grid-cols-1 gap-5 ${
            displayPlans.length === 1 ? 'lg:grid-cols-1 max-w-md mx-auto' :
            displayPlans.length === 2 ? 'lg:grid-cols-2 max-w-2xl mx-auto' :
            'lg:grid-cols-3'
          }`}>
            {displayPlans.map((plan, index) => {
              const price = getPrice(plan);
              const isPopular = getIsPopular(index, displayPlans.length);

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white border rounded-xl overflow-hidden ${
                    isPopular
                      ? "border-gray-900 ring-1 ring-gray-900 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  } ${!plan.status ? "opacity-60" : ""}`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gray-900 text-white text-xs font-medium py-1.5 text-center">
                      <Zap className="h-3.5 w-3.5 inline mr-1" />
                      Most Popular
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={`absolute right-3 flex gap-1 ${isPopular ? "top-10" : "top-3"}`}>
                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      title="Edit plan"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      disabled={deletingPlanId === plan.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Delete plan"
                    >
                      {deletingPlanId === plan.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className={`p-5 ${isPopular ? "pt-10" : ""}`}>
                    {/* Plan Name & Status */}
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      {!plan.status && (
                        <span className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{plan.description || "No description"}</p>

                    {/* Price */}
                    <div className="mt-4">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">AED {price}</span>
                        <span className="text-sm text-gray-500 ml-1">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>
                      {billingCycle === "yearly" && plan.discount && plan.discount > 0 && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          Save {plan.discount}%
                        </p>
                      )}
                    </div>

                    {/* Plan Details */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <ul className="space-y-2.5">
                        {plan.discount !== null && plan.discount > 0 && (
                          <li className="flex items-center gap-2.5 text-sm text-gray-600">
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                            <span>{plan.discount}% save on yearly</span>
                          </li>
                        )}
                        {plan.commission !== null && (
                          <li className="flex items-center gap-2.5 text-sm text-gray-600">
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                            <span>{plan.commission}% commission rate</span>
                          </li>
                        )}
                        {(plan.discount === null || plan.discount === 0) && plan.commission === null && (
                          <li className="text-sm text-gray-400 italic">No benefits configured</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Plan Modal */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        plan={editingPlan}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
