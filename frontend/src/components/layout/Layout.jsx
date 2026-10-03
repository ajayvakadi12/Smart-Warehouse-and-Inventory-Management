import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

  return (

    <div className="flex min-h-screen bg-gray-100">


      {/* Sidebar */}

      <aside className="w-64 hidden md:block">

        <Sidebar />

      </aside>




      {/* Main Area */}

      <div className="flex-1 flex flex-col">


        {/* Navbar */}

        <Navbar />



        {/* Page Content */}

        <main className="flex-1 p-6 overflow-y-auto">

          {children}

        </main>


      </div>


    </div>

  );

}


export default Layout;