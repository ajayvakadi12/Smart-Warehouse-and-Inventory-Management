import { useEffect, useState } from "react";
import api from "../services/api";
import OrderForm from "../components/forms/OrderForm";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await api.get("/orders");
      setOrders(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.put(`/orders/${id}/status`, {
        status,
      });

      alert("Order Updated");
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  }

  async function deleteOrder(id) {
    if (!window.confirm("Delete this order?")) return;

    try {
      await api.delete(`/orders/${id}`);

      alert("Order Deleted");
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Add Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6"
                >
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t"
                >
                  <td className="p-3">
                    {order.customerName}
                  </td>

                  <td className="p-3">
                    {order.customerEmail}
                  </td>

                  <td className="p-3">
                    ₹ {order.totalAmount}
                  </td>

                  <td className="p-3">
                    {order.status}
                  </td>

                  <td className="p-3 space-x-2">
                    {order.status !== "Shipped" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "Shipped"
                          )
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Ship
                      </button>
                    )}

                    <button
                      onClick={() =>
                        deleteOrder(order._id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <OrderForm
          onClose={() => setShowForm(false)}
          refreshOrders={fetchOrders}
        />
      )}
    </div>
  );
}

export default Orders;