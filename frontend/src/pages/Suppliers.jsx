import { useEffect, useState } from "react";
import api from "../services/api";
import SupplierForm from "../components/forms/SupplierForm";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      const response = await api.get("/suppliers");
      setSuppliers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Delete this supplier?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/suppliers/${id}`);

      alert("Supplier Deleted Successfully");

      fetchSuppliers();

    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.supplierName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      supplier.contactPerson
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      supplier.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Suppliers
        </h1>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search Supplier..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-lg px-4 py-2"
          />

          <button
            onClick={() => {
              setSelectedSupplier(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + Add Supplier
          </button>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Supplier
              </th>

              <th className="p-4 text-left">
                Contact Person
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredSuppliers.map((supplier) => (

              <tr
                key={supplier._id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">
                  {supplier.supplierName}
                </td>

                <td className="p-4">
                  {supplier.contactPerson}
                </td>

                <td className="p-4">
                  {supplier.email}
                </td>

                <td className="p-4">
                  {supplier.phone}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      supplier.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {supplier.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => {
                        setSelectedSupplier(
                          supplier
                        );
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          supplier._id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {filteredSuppliers.length === 0 && (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >
                  No Suppliers Found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {showModal && (

        <SupplierForm
          supplier={selectedSupplier}
          refreshSuppliers={fetchSuppliers}
          onClose={() => setShowModal(false)}
        />          

      )}

    </div>
  );
}

export default Suppliers;