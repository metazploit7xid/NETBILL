import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MOCK_PLANS } from "../store/data";
import { formatCurrency } from "../lib/utils";

export default function Plans() {
  const [plans, setPlans] = useState(MOCK_PLANS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    speed: "",
    price: ""
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", speed: "", price: "" });
    setShowForm(true);
  };

  const handleOpenEdit = (plan: any) => {
    setEditingId(plan.id);
    setFormData({ name: plan.name, speed: plan.speed, price: plan.price.toString() });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setPlans(plans.map(p => p.id === editingId ? { ...p, name: formData.name, speed: formData.speed, price: parseInt(formData.price) } : p));
    } else {
      const newPlan = {
        id: `plan-${Date.now()}`,
        name: formData.name,
        speed: formData.speed,
        price: parseInt(formData.price),
      };
      setPlans([...plans, newPlan]);
    }
    setShowForm(false);
    setFormData({ name: "", speed: "", price: "" });
    setEditingId(null);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Internet Plans</h1>
        <button 
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center px-4 py-2 bg-[#0d6efd] dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Plan
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{editingId ? "Edit Plan" : "Add New Plan"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Plan Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Basic Plan"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Speed</label>
              <input
                type="text"
                required
                placeholder="e.g. 10 Mbps"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.speed}
                onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Price (Rp)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="md:col-span-3 flex justify-end space-x-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0d6efd] dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                {editingId ? "Update Plan" : "Save Plan"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-slate-900 rounded shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Up to {plan.speed}</p>
                </div>
                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                  Active
                </span>
              </div>
              
              <div className="mt-6 flex items-baseline text-3xl font-extrabold text-[#0d6efd] dark:text-cyan-400">
                {formatCurrency(plan.price)}
                <span className="ml-1 text-sm font-medium text-gray-500 dark:text-slate-400">/mo</span>
              </div>

              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-700 dark:text-slate-300">Unlimited Quota</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-700 dark:text-slate-300">Free Installation</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-700 dark:text-slate-300">24/7 Support</p>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex justify-end space-x-3">
              <button 
                onClick={() => handleOpenEdit(plan)}
                className="text-[#0d6efd] dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 font-medium text-sm flex items-center transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button 
                onClick={() => handleDeletePlan(plan.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-medium text-sm flex items-center transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
