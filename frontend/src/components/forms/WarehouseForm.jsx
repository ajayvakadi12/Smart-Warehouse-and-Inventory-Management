import { useState } from "react";
import api from "../../services/api";

function WarehouseForm({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    warehouseName: "",
    location: "",
    managerName: "",
    capacity: 10000,
    status: "Active",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/warehouses", {
        ...formData,
        capacity: Number(formData.capacity),
      });
      if (onCreated) onCreated();
      if (onClose) onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create warehouse");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Warehouse Facility</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Facility Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. South Logistics Depot"
              value={formData.warehouseName}
              onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Location / City
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bangalore, Karnataka"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Manager Name
              </label>
              <input
                type="text"
                placeholder="Manager in charge"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Storage Capacity (Units)
              </label>
              <input
                type="number"
                min="100"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold rounded-xl shadow-md disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Facility"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WarehouseForm;
