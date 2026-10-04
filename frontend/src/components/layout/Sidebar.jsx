import {
  Home,
  Package,
  Warehouse,
  Boxes,
  Truck,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
  LogOut,
  Bell,
  Layers,
  Box,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const MENU_GROUPS = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", path: "/", icon: Home },
    ],
  },
  {
    label: "Inventory",
    items: [
      { name: "Products",       path: "/products",   icon: Package },
      { name: "Stock Movements", path: "/inventory",  icon: Boxes },
      { name: "Warehouses",     path: "/warehouses", icon: Warehouse },
      { name: "Racks",          path: "/racks",      icon: Layers },
      { name: "Bins",           path: "/bins",       icon: Box },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Suppliers", path: "/suppliers", icon: Users },
      { name: "Shipments", path: "/shipments", icon: Truck },
      { name: "Orders",    path: "/orders",    icon: ShoppingCart },
    ],
  },
  {
    label: "Analytics",
    items: [
      { name: "Reports", path: "/reports",       icon: BarChart3 },
      { name: "Alerts",  path: "/notifications", icon: Bell },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Profile",  path: "/profile",  icon: User },
      { name: "Settings", path: "/settings", icon: Settings },
    ],
  },
];

function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 z-40">

      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-lg shadow-lg shadow-blue-500/30 shrink-0">
          📦
        </div>
        <div className="min-w-0">
          <h1 className="font-extrabold text-sm tracking-tight text-white leading-tight truncate">
            SmartWarehouse
          </h1>
          <p className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase mt-0.5">
            Inventory v1.0
          </p>
        </div>
      </div>

      {/* ── Scrollable Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
        {MENU_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 px-2 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div className="shrink-0 border-t border-slate-800 px-3 py-4 space-y-1">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md shrink-0">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-200 truncate leading-tight">
              {user?.fullName || "User"}
            </p>
            <p className="text-[11px] text-blue-400 truncate font-medium leading-tight">
              {user?.role || "Staff"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 text-sm font-medium transition-all duration-150"
        >
          <LogOut size={17} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;