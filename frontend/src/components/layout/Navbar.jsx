import { useState, useContext } from "react";
import { Bell, Search, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-8">
      {/* Search Header */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 hidden sm:block">
          Warehouse Console
        </h2>

        <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 w-48 sm:w-64">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU or products..."
            className="bg-transparent outline-none ml-2 w-full text-xs text-slate-700"
          />
        </div>
      </div>

      {/* Right Side: Alerts & User Profile */}
      <div className="flex items-center gap-4">
        <Link
          to="/notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="Alerts & Telemetry"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </Link>

        {/* User Menu */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.fullName || "Operator"}
              </p>
              <p className="text-[11px] text-blue-600 font-semibold leading-tight">
                {user?.role || "Staff"}
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.fullName?.charAt(0) || "U"}
            </div>
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white shadow-2xl rounded-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">{user?.fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
              >
                <User size={15} />
                Profile Settings
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-medium transition mt-1"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;