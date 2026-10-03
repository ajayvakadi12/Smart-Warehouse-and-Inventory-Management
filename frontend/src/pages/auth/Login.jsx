import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import { Lock, Mail, ShieldCheck, Box, UserCheck } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "admin@warehouse.com",
    password: "Admin@123",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function setDemoCredentials(role) {
    if (role === "Admin") {
      setFormData({ email: "admin@warehouse.com", password: "Admin@123" });
    } else if (role === "Manager") {
      setFormData({ email: "manager@warehouse.com", password: "Manager@123" });
    } else if (role === "Staff") {
      setFormData({ email: "staff@warehouse.com", password: "Staff@123" });
    }
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(formData);
      // res is { success: true, data: { token, user } }
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Left Branding */}
      <div className="hidden lg:flex w-1/2 text-white flex-col justify-center px-16 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 border-r border-slate-800">
        <div className="inline-flex items-center gap-3 mb-6 bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full w-fit border border-blue-500/30 text-sm font-medium">
          <Box size={18} /> Smart Warehouse Inventory System
        </div>

        <h1 className="text-5xl font-black mb-5 tracking-tight text-white">
          Precision Inventory & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            Logistics Management
          </span>
        </h1>

        <p className="text-lg text-slate-300 mb-10 max-w-lg leading-relaxed">
          Full-lifecycle warehouse control: real-time stock levels, automated status transitions, role-based access control, and predictive restocking analytics.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <span className="bg-blue-600/30 text-blue-400 p-2.5 rounded-lg">📦</span>
            <div>
              <p className="font-semibold text-white">Real-time Stock Tracking</p>
              <p className="text-xs text-slate-400">Strict zero-floor limits preventing negative inventory levels.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <span className="bg-green-600/30 text-green-400 p-2.5 rounded-lg">🛡️</span>
            <div>
              <p className="font-semibold text-white">Role-Based Access Control</p>
              <p className="text-xs text-slate-400">Distinct workflows for Admin, Warehouse Manager, and Operations Staff.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Sign in with your role-based credentials to access the console.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@warehouse.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              One-Click Demo Roles
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials("Admin")}
                className="py-2 px-2 text-xs font-semibold rounded-lg border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("Manager")}
                className="py-2 px-2 text-xs font-semibold rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
              >
                👔 Manager
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("Staff")}
                className="py-2 px-2 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
              >
                👷 Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;