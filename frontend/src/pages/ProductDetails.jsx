import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  Package,
  Warehouse,
  Tag,
  Barcode,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  QrCode,
  Scan,
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanMessage, setScanMessage] = useState("");
  const [adjustQty, setAdjustQty] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  async function fetchProductDetails() {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.data);
      setMovements(res.data.recentMovements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Simulated Barcode Scanning action
  async function simulateScan(type) {
    if (!product) return;
    try {
      setScanMessage(`Scanning SKU: ${product.sku}...`);
      if (type === "IN") {
        await api.post("/stock/in", {
          productId: product._id,
          quantity: Number(adjustQty),
          warehouse: product.warehouse?._id,
          remarks: `Barcode Scanned Check-in (${product.sku})`,
        });
        setScanMessage(`✅ Barcode Scanned: +${adjustQty} added to stock!`);
      } else {
        await api.post("/stock/out", {
          productId: product._id,
          quantity: Number(adjustQty),
          warehouse: product.warehouse?._id,
          remarks: `Barcode Scanned Dispatch (${product.sku})`,
        });
        setScanMessage(`✅ Barcode Scanned: -${adjustQty} dispatched from stock!`);
      }
      fetchProductDetails();
      setTimeout(() => setScanMessage(""), 4000);
    } catch (err) {
      setScanMessage(`❌ Scan Error: ${err.response?.data?.message || "Operation failed"}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Product not found.</p>
        <Link to="/products" className="text-blue-600 font-semibold mt-2 inline-block">
          ← Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/products"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {product.productName}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-mono mt-0.5">
            SKU: {product.sku}
          </p>
        </div>
      </div>

      {scanMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
            scanMessage.startsWith("✅")
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <Scan size={18} />
          {scanMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Info Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase">Category</p>
              <p className="text-base font-bold text-slate-800 mt-1">{product.category}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase">Unit Price</p>
              <p className="text-base font-bold text-slate-800 mt-1">₹ {product.price?.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase">Stock On Hand</p>
              <p className="text-base font-bold text-blue-600 mt-1">{product.quantity} units</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase">Status</p>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${
                  product.status === "Available"
                    ? "bg-emerald-100 text-emerald-700"
                    : product.status === "Low Stock"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.status}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
            <p className="text-sm text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {product.description || "No detailed technical description provided."}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Assigned Facility</h3>
            <p className="text-sm text-slate-700 flex items-center gap-2">
              <Warehouse size={16} className="text-slate-400" />
              {product.warehouse?.warehouseName || "Primary Hub"} —{" "}
              <span className="text-slate-500 text-xs">{product.warehouse?.location || "Central"}</span>
            </p>
          </div>

          {/* Simulated Stock Movement History */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-4">Stock Ledger & Audit Movements</h3>
            {movements.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent stock movements recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold text-left">
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Quantity</th>
                      <th className="pb-2">Warehouse</th>
                      <th className="pb-2">Remarks</th>
                      <th className="pb-2">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {movements.map((m) => (
                      <tr key={m._id} className="text-slate-700">
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold ${
                              m.transactionType === "Stock In"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {m.transactionType}
                          </span>
                        </td>
                        <td className="py-2.5 font-bold">{m.quantity}</td>
                        <td className="py-2.5">{m.warehouse?.warehouseName || "-"}</td>
                        <td className="py-2.5 text-slate-500">{m.remarks || "-"}</td>
                        <td className="py-2.5 text-slate-400">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Barcode Scanner & Simulation Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center justify-center gap-2">
              <Barcode size={18} className="text-blue-600" /> Digital Product Barcode
            </h3>

            {/* Generated Visual Barcode representation */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center">
              <div className="flex gap-1 items-end h-16 mb-2">
                {[4, 2, 6, 1, 5, 2, 7, 3, 2, 8, 4, 3, 6, 2, 5, 3, 7, 2, 4, 6].map((h, i) => (
                  <div
                    key={i}
                    className="bg-slate-900 w-1 rounded-sm"
                    style={{ height: `${h * 7}px` }}
                  />
                ))}
              </div>
              <p className="font-mono text-sm tracking-widest font-bold text-slate-800">
                *{product.sku}*
              </p>
            </div>

            <div className="pt-2 text-left">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
                Scan Units Batch
              </label>
              <input
                type="number"
                min="1"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600 mb-3"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => simulateScan("IN")}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl text-xs font-semibold shadow-sm transition"
                >
                  <TrendingUp size={14} /> Scan In (+{adjustQty})
                </button>
                <button
                  onClick={() => simulateScan("OUT")}
                  className="flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-3 rounded-xl text-xs font-semibold shadow-sm transition"
                >
                  <TrendingDown size={14} /> Scan Out (-{adjustQty})
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Simulates handheld optical laser scanning at dispatch and receiving docks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
