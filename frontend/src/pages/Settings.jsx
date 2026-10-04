import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import {
  User,
  Mail,
  Shield,
  KeyRound,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";

function Settings() {
  const { user, logout } = useContext(AuthContext);

  // ── Change Password state ──
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent]     = useState(false);
  const [showNew, setShowNew]             = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [pwLoading, setPwLoading]         = useState(false);
  const [pwSuccess, setPwSuccess]         = useState("");
  const [pwError, setPwError]             = useState("");

  function handlePwChange(e) {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
    setPwError("");
    setPwSuccess("");
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (pwForm.newPassword === pwForm.currentPassword) {
      setPwError("New password must be different from the current password.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await api.put("/users/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess(res.data.message || "Password changed successfully.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(
        err.response?.data?.message || "Failed to change password. Please try again."
      );
    } finally {
      setPwLoading(false);
    }
  }

  const roleColor = {
    Admin: "bg-purple-100 text-purple-700 border-purple-300",
    "Warehouse Manager": "bg-blue-100 text-blue-700 border-blue-300",
    Staff: "bg-emerald-100 text-emerald-700 border-emerald-300",
  }[user?.role] || "bg-slate-100 text-slate-700 border-slate-300";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your account preferences and security.
        </p>
      </div>

      {/* ── Profile Info Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <User size={17} className="text-blue-600" />
          Profile Information
        </h2>

        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20 shrink-0">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-bold text-slate-800">{user?.fullName}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className={`inline-block mt-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full border ${roleColor}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User size={13} /> Full Name
            </p>
            <p className="font-semibold text-slate-800">{user?.fullName || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail size={13} /> Email Address
            </p>
            <p className="font-semibold text-slate-800">{user?.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Shield size={13} /> Role
            </p>
            <p className="font-semibold text-slate-800">{user?.role || "—"}</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          To update your name or phone number, visit the{" "}
          <a href="/profile" className="text-blue-600 font-medium hover:underline">
            Profile
          </a>{" "}
          page.
        </p>
      </div>

      {/* ── Change Password Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
          <KeyRound size={17} className="text-blue-600" />
          Change Password
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Choose a strong password of at least 6 characters.
        </p>

        {/* Success banner */}
        {pwSuccess && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
            <Check size={17} className="shrink-0" />
            {pwSuccess}
          </div>
        )}

        {/* Error banner */}
        {pwError && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertCircle size={17} className="shrink-0" />
            {pwError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Current Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={pwForm.currentPassword}
                onChange={handlePwChange}
                required
                placeholder="Enter current password"
                className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition text-slate-800 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
              >
                {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={pwForm.newPassword}
                onChange={handlePwChange}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition text-slate-800 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
              >
                {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {/* Strength hint */}
            {pwForm.newPassword && (
              <div className="mt-2 flex gap-1.5">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      pwForm.newPassword.length >= n * 4
                        ? n === 1
                          ? "bg-red-400"
                          : n === 2
                          ? "bg-yellow-400"
                          : "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
                <span className="text-[10px] text-slate-400 ml-1 self-center">
                  {pwForm.newPassword.length < 4
                    ? "Weak"
                    : pwForm.newPassword.length < 8
                    ? "Fair"
                    : "Strong"}
                </span>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={pwForm.confirmPassword}
                onChange={handlePwChange}
                required
                placeholder="Re-enter new password"
                className={`w-full pl-10 pr-11 py-3 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition text-slate-800 text-sm ${
                  pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword
                    ? "border-red-300 bg-red-50"
                    : pwForm.confirmPassword && pwForm.confirmPassword === pwForm.newPassword
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={pwLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              {pwLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating…
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Danger Zone ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
        <h2 className="text-base font-bold text-red-600 mb-1 flex items-center gap-2">
          <LogOut size={17} />
          Sign Out
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          End your current session and return to the login screen.
        </p>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Settings;