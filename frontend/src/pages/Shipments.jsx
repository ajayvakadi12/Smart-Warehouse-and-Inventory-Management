import { useEffect, useState } from "react";
import api from "../services/api";
import ShipmentForm from "../components/forms/ShipmentForm";

function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);

  async function fetchShipments() {
    try {
      const response = await api.get("/shipments");
      setShipments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function receiveShipment(id) {
    try {
      await api.put(`/shipments/${id}/receive`);

      alert("Shipment Received Successfully");

      fetchShipments();
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Failed to Receive Shipment");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Shipments
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Shipment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                Supplier
              </th>

              <th className="p-4 text-left">
                Warehouse
              </th>

              <th className="p-4 text-left">
                Products
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((shipment) => (
              <tr
                key={shipment._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">
                  {shipment.supplier?.supplierName}
                </td>

                <td className="p-4">
                  {shipment.warehouse?.warehouseName}
                </td>

                <td className="p-4">
                  {shipment.products.length}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      shipment.status === "Received"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {shipment.status}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(
                    shipment.shipmentDate
                  ).toLocaleDateString()}
                </td>

                <td className="p-4 text-center">
                  {shipment.status ===
                  "Pending" ? (
                    <button
                      onClick={() =>
                        receiveShipment(
                          shipment._id
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Receive
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium">
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {shipments.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >
                  No Shipments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ShipmentForm
          onClose={() => setShowModal(false)}
          refreshShipments={fetchShipments}
        />
      )}
    </div>
  );
}

export default Shipments;