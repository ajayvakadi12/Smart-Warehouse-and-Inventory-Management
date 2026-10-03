import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow">
          <span className="text-4xl">🚫</span>
          <h2 className="text-xl font-bold text-slate-800 mt-4">Access Denied</h2>
          <p className="text-slate-500 text-sm mt-2">
            Your role (<span className="font-semibold">{user.role}</span>) does not have permission to view this section.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
