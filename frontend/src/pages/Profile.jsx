import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { User, Mail, Shield, Phone, KeyRound, Check } from "lucide-react";

function Profile() {
  const { user } = useContext(AuthContext);
  const [phone, setPhone] = useState(user?.phone || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    try {
      await api.put("/users/profile", { fullName, phone });
      setSuccess("Profile details updated successfully.");
      const updated = { ...user, fullName, phone };
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const roleColor = {
    Admin: "bg-purple-100 text-purple-700 border-purple-300",
    "Warehouse Manager": "bg-blue-100 text-blue-700 border-blue-300",
    Staff: "bg-emerald-100 text-emerald-700 border-emerald-300",
  }[user?.role] || "bg-slate-100 text-slate-700 border-slate-300";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Profile & Access Control</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review your account credentials, assigned warehouse role, and operational privileges.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <Check size={18} /> {success}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/20">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.fullName}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${roleColor}`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-800 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Registered Email (Immutable)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Role Permissions Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-base">
          <Shield size={18} className="text-blue-600" /> Authorized System Privileges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <p className="font-bold text-slate-700 mb-1">Products & Stock</p>
            <p className="text-slate-500">
              {user?.role === "Staff" ? "Stock In / Out, view inventory" : "Full CRUD, stock adjustments & audits"}
            </p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <p className="font-bold text-slate-700 mb-1">Warehouses & Racks</p>
            <p className="text-slate-500">
              {user?.role === "Staff" ? "Read-only location lookup" : "Create racks, bins & warehouse nodes"}
            </p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <p className="font-bold text-slate-700 mb-1">Reports & Export</p>
            <p className="text-slate-500">
              {user?.role === "Staff" ? "View stock telemetry" : "Export Excel & PDF audit sheets"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
