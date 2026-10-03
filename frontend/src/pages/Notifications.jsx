import { useEffect, useState } from "react";
import api from "../services/api";
import { Bell, AlertTriangle, CheckCircle, PackageX, Truck, RefreshCw } from "lucide-react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [notifRes, dashRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/dashboard/summary"),
      ]);

      setNotifications(notifRes.data.data || []);
      setLowStockAlerts(dashRes.data.data?.lowStockAlerts || []);
    } catch (error) {
      console.error("Notifications fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Mark read error:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Alerts & Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time low-stock telemetry, replenishment alerts, and warehouse event notifications.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Low Stock Telemetry Section */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-900">Critical & Low Stock Telemetry</h2>
            <p className="text-xs text-amber-700">Immediate replenishment required to maintain service level agreements.</p>
          </div>
        </div>

        {lowStockAlerts.length === 0 ? (
          <p className="text-sm text-amber-800 bg-white/70 p-4 rounded-xl border border-amber-200/50">
            ✅ All products currently meet minimum inventory thresholds.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockAlerts.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{item.productName}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">SKU: <span className="font-mono text-slate-700">{item.sku}</span></p>
                  <p className="text-xs text-slate-500">Warehouse: {item.warehouse?.warehouseName || "N/A"}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.quantity === 0
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {item.quantity === 0 ? "Out of Stock" : `${item.quantity} Units Left`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* General Notifications Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Bell size={20} className="text-blue-600" /> Operational Notifications Feed
        </h2>

        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <CheckCircle size={40} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No unhandled system notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`py-4 flex items-start justify-between gap-4 transition ${
                  notif.isRead ? "opacity-60" : "bg-blue-50/30 px-3 rounded-xl"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 ${
                      notif.type === "alert"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {notif.type === "alert" ? <PackageX size={18} /> : <Truck size={18} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{notif.title}</h3>
                    <p className="text-slate-600 text-xs mt-0.5">{notif.message}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif._id)}
                    className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium shadow-sm transition whitespace-nowrap"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
