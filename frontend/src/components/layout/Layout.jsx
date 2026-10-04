import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Fixed Sidebar — w-64 = 256px */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main area offset by sidebar width */}
      <div className="md:ml-64 flex flex-col min-h-screen">

        {/* Sticky Navbar */}
        <div className="sticky top-0 z-30">
          <Navbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}

export default Layout;