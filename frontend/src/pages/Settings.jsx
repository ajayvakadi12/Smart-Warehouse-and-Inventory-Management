import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Settings() {

  const { user, logout } = useContext(AuthContext);


  return (

    <div>

      <h1 className="text-3xl font-bold mb-8">
        Settings
      </h1>


      <div className="bg-white rounded-xl shadow p-8 max-w-xl">


        <h2 className="text-xl font-bold mb-6">
          Profile Information
        </h2>


        <div className="space-y-4">


          <div>
            <p className="text-gray-500">
              Name
            </p>

            <p className="font-semibold">
              {user?.fullName || "Admin"}
            </p>
          </div>



          <div>
            <p className="text-gray-500">
              Email
            </p>

            <p className="font-semibold">
              {user?.email || "admin@gmail.com"}
            </p>
          </div>


        </div>



        <hr className="my-6"/>



        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg mr-3"
        >
          Change Password
        </button>



        <button
          onClick={logout}
          className="bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>


      </div>


    </div>

  );

}


export default Settings;