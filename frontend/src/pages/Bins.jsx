import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Box, Plus, Layers, Warehouse } from "lucide-react";

function Bins() {
  const { user } = useContext(AuthContext);
  const [bins, setBins] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [racks, setRacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    binCode: "",
    warehouse: "",
    rack: "",
    capacity: 100,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [binRes, whRes, rackRes] = await Promise.all([
        api.get("/bins"),
        api.get("/warehouses"),
        api.get("/racks"),
      ]);
      setBins(binRes.data.data || []);
      setWarehouses(whRes.data.data || []);
      setRacks(rackRes.data.data || []);
      if (whRes.data.data?.length > 0 && rackRes.data.data?.length > 0) {
        setFormData((prev) => ({
          ...prev,
          warehouse: whRes.data.data[0]._id,
          rack: rackRes.data.data[0]._id,
        }));
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
      await api.post("/bins", {
        ...formData,
        capacity: Number(formData.capacity),
      });
      setShowModal(false);
      setFormData({
        binCode: "",
        warehouse: warehouses[0]?._id || "",
        rack: racks[0]?._id || "",
        capacity: 100,
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create bin");
    }
  }

  const canManage = user?.role === "Admin" || user?.role === "Warehouse Manager";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Bin Compartments</h1>
          <p className="text-slate-500 text-sm mt-1">
            Sub-divided rack storage bins for exact item SKU locator tracking.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} /> Add Storage Bin
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {bins.map((bin) => (
          <div key={bin._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Box size={20} />
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  bin.status === "Full"
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {bin.status || "Available"}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 font-mono">{bin.binCode}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Layers size={13} className="text-slate-400" />
                Rack: <span className="font-semibold text-slate-700">{bin.rack?.rackCode || "RACK-1"}</span>
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Warehouse size={13} className="text-slate-400" />
                {bin.warehouse?.warehouseName || "Main Facility"}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>Capacity: {bin.capacity || 100}</span>
              <span>Stock: {bin.currentStock || 0}</span>
            </div>
          </div>
        ))}

        {bins.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400">
            No bin locations registered. Click "Add Storage Bin" to partition warehouse racks.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Storage Bin</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Bin Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g. BIN-A1-02"
                  value={formData.binCode}
                  onChange={(e) => setFormData({ ...formData, binCode: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Assigned Rack
                </label>
                <select
                  value={formData.rack}
                  onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm text-slate-800"
                >
                  {racks.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.rackCode} ({r.warehouse?.warehouseName || "Warehouse"})
                    </option>
                  ))}
                </select>
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
                  Holding Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
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
                  Save Bin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bins;
