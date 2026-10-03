import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Layers, Plus, Warehouse, ShieldAlert } from "lucide-react";

function Racks() {
  const { user } = useContext(AuthContext);
  const [racks, setRacks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    rackCode: "",
    warehouse: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [rackRes, whRes] = await Promise.all([
        api.get("/racks"),
        api.get("/warehouses"),
      ]);
      setRacks(rackRes.data.data || []);
      setWarehouses(whRes.data.data || []);
      if (whRes.data.data?.length > 0) {
        setFormData((prev) => ({ ...prev, warehouse: whRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/racks", formData);
      setShowModal(false);
      setFormData({ rackCode: "", warehouse: warehouses[0]?._id || "", description: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create rack");
    }
  }

  const canManage = user?.role === "Admin" || user?.role === "Warehouse Manager";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Rack Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Warehouse aisle, tier, and vertical storage rack assignments.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} /> Add Storage Rack
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {racks.map((rack) => (
          <div key={rack._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Layers size={24} />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                {rack.status || "Active"}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 font-mono">{rack.rackCode}</h3>
              <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5">
                <Warehouse size={14} className="text-slate-400" />
                {rack.warehouse?.warehouseName || "Central Warehouse"}
              </p>
            </div>

            {rack.description && (
              <p className="text-slate-600 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                {rack.description}
              </p>
            )}
          </div>
        ))}

        {racks.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400">
            No racks configured yet. Click "Add Storage Rack" to initialize warehouse locations.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Warehouse Rack</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Rack Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. RACK-B2"
                  value={formData.rackCode}
                  onChange={(e) => setFormData({ ...formData, rackCode: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Warehouse Facility
                </label>
                <select
                  value={formData.warehouse}
                  onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm text-slate-800"
                >
                  {warehouses.map((wh) => (
                    <option key={wh._id} value={wh._id}>
                      {wh.warehouseName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Description / Notes
                </label>
                <textarea
                  placeholder="Aisle number, weight capacity, or designated category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded-xl shadow-md"
                >
                  Save Rack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Racks;
