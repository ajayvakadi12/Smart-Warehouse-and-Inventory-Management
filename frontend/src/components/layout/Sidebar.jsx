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

function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  const menu = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Products", path: "/products", icon: Package },
    { name: "Warehouses", path: "/warehouses", icon: Warehouse },
    { name: "Racks", path: "/racks", icon: Layers },
    { name: "Bins", path: "/bins", icon: Box },
    { name: "Stock Movements", path: "/inventory", icon: Boxes },
    { name: "Suppliers", path: "/suppliers", icon: Users },
    { name: "Shipments", path: "/shipments", icon: Truck },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Alerts", path: "/notifications", icon: Bell },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between p-5 border-r border-slate-800">
      <div>
        {/* Logo Branding */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30">
            📦
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
              SmartWarehouse
            </h1>
            <p className="text-[11px] text-blue-400 font-semibold tracking-wider uppercase">
              Inventory v1.0
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout Button */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-sm text-slate-200 truncate">
              {user?.fullName || "User"}
            </p>
            <p className="text-[11px] text-blue-400 truncate font-medium">
              {user?.role || "Staff"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 text-sm font-medium transition"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;