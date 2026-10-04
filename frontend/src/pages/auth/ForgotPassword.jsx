import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Mail,
  KeyRound,
  Lock,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Box,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Step indicators ────────────────────────────────────────────────────────
const STEPS = ["Enter Email", "Verify OTP", "New Password"];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  done
                    ? "bg-blue-600 border-blue-600 text-white"
                    : active
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-slate-200 text-slate-400 bg-white"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-[10px] font-semibold mt-1 whitespace-nowrap ${
                  active ? "text-blue-600" : done ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mt-[-18px] mx-1 rounded transition-all ${
                  done ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep]       = useState(0); // 0 = email, 1 = otp, 2 = new password
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [newPw, setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [devMode, setDevMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [info, setInfo]       = useState("");

  // ── Helpers ────────────────────────────────────────────────────────────────
  function clearMessages() {
    setError("");
    setInfo("");
  }

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────
  async function handleSendOTP(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setDevMode(!!res.data.devMode);
      setInfo(res.data.message);
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
  async function handleVerifyOTP(e) {
    e.preventDefault();
    clearMessages();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, otp: code });
      setInfo(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  }

  // OTP input box navigation
  function handleOtpInput(value, index) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }
  function handleOtpKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }
  function handleOtpPaste(e) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = [...otp];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    document.getElementById(`otp-${Math.min(digits.length, 5)}`)?.focus();
  }

  // ── Step 3: Reset Password ─────────────────────────────────────────────────
  async function handleResetPassword(e) {
    e.preventDefault();
    clearMessages();
    if (newPw !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    if (newPw.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { email, newPassword: newPw });
      setInfo(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  // ── Resend OTP ──────────────────────────────────────────────────────────────
  async function handleResend() {
    clearMessages();
    setOtp(["", "", "", "", "", ""]);
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setInfo("A new OTP has been sent to your email.");
    } catch {
      setError("Could not resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Left Branding */}
      <div className="hidden lg:flex w-1/2 text-white flex-col justify-center px-16 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 border-r border-slate-800">
        <div className="inline-flex items-center gap-3 mb-6 bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full w-fit border border-blue-500/30 text-sm font-medium">
          <Box size={18} /> Smart Warehouse Inventory System
        </div>
        <h1 className="text-5xl font-black mb-5 tracking-tight text-white">
          Recover Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            Account Access
          </span>
        </h1>
        <p className="text-lg text-slate-300 mb-10 max-w-lg leading-relaxed">
          Enter your registered email and we&apos;ll send a 6-digit OTP to verify your identity before resetting your password.
        </p>
        <div className="space-y-4">
          {[
            { icon: "📧", title: "OTP via Email", desc: "A secure 6-digit code sent instantly to your inbox." },
            { icon: "⏱️", title: "10-Minute Expiry", desc: "OTP codes expire quickly to keep your account safe." },
            { icon: "🔒", title: "bcrypt Hashed", desc: "New passwords are cryptographically hashed before storage." },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              <span className="text-xl p-2.5 bg-slate-700/50 rounded-lg">{f.icon}</span>
              <div>
                <p className="font-semibold text-white text-sm">{f.title}</p>
                <p className="text-xs text-slate-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md">

          {/* Back to login */}
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition w-fit"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>

          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {step === 0 && "Forgot Password"}
              {step === 1 && "Enter OTP"}
              {step === 2 && "Set New Password"}
            </h2>
            <p className="text-slate-500 mt-1.5 text-sm">
              {step === 0 && "We'll send a 6-digit code to your registered email."}
              {step === 1 && `Check your inbox at ${email} for the OTP.`}
              {step === 2 && "Choose a strong new password for your account."}
            </p>
          </div>

          <StepIndicator current={step} />

          {/* Error / Info banners */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}
          {info && !error && (
            <div className="mb-5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm font-medium flex items-center gap-2">
              ✉️ {info}
            </div>
          )}

          {/* ── Step 0: Email ── */}
          {step === 0 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearMessages(); }}
                    required
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition text-slate-800"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading
                  ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending OTP…</>
                  : <><Mail size={18} /> Send OTP</>}
              </button>
            </form>
          )}

          {/* ── Step 1: OTP Boxes ── */}
          {step === 1 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">

              {/* Dev-mode banner */}
              {devMode && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs">
                  <p className="font-bold mb-1">🛠️ Dev Mode — No email credentials set</p>
                  <p>Look in your <strong>backend terminal</strong> for a line like:</p>
                  <p className="mt-1.5 font-mono bg-amber-100 rounded px-2 py-1.5 text-amber-900 tracking-widest text-center">
                    📧 OTP for {email} : <strong>XXXXXX</strong>
                  </p>
                  <p className="mt-1.5">Copy those 6 digits into the boxes below.</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  6-Digit OTP
                </label>
                <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition text-slate-800 bg-slate-50"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  You can also paste the 6-digit code directly.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading
                  ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying…</>
                  : <><ShieldCheck size={18} /> Verify OTP</>}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1.5 mx-auto disabled:opacity-50"
                >
                  <RefreshCw size={14} /> Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* ── Step 2: New Password ── */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => { setNewPw(e.target.value); clearMessages(); }}
                    required
                    minLength={6}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition text-slate-800"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Strength bar */}
                {newPw && (
                  <div className="flex gap-1.5 mt-2">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className={`h-1 flex-1 rounded-full transition-all ${
                        newPw.length >= n * 4
                          ? n === 1 ? "bg-red-400" : n === 2 ? "bg-yellow-400" : "bg-emerald-500"
                          : "bg-slate-200"}`} />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1 self-center">
                      {newPw.length < 4 ? "Weak" : newPw.length < 8 ? "Fair" : "Strong"}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type={showCPw ? "text" : "password"}
                    value={confirmPw}
                    onChange={(e) => { setConfirmPw(e.target.value); clearMessages(); }}
                    required
                    placeholder="Re-enter new password"
                    className={`w-full pl-10 pr-11 py-3 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition text-slate-800 ${
                      confirmPw && confirmPw !== newPw
                        ? "border-red-300 bg-red-50"
                        : confirmPw && confirmPw === newPw
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200"}`}
                  />
                  <button type="button" onClick={() => setShowCPw(!showCPw)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                    {showCPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading
                  ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Resetting…</>
                  : <><KeyRound size={18} /> Reset Password</>}
              </button>
            </form>
          )}

          {/* Footer links */}
          <div className="mt-7 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Remembered your password?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
