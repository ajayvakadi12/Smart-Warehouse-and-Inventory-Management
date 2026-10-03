import { useEffect, useState } from "react";
import api from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function Dashboard() {

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    products: 0,
    warehouses: 0,

    lowStock: 0,
    outOfStock: 0,

    totalCost: 0,
    totalQuantity: 0,

    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,

    totalShipments: 0,
    receivedShipments: 0,

    recentOrders: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {

      setLoading(true);

      const res = await api.get("/dashboard");

      console.log("Dashboard Full Data");
console.log(JSON.stringify(res.data, null, 2));
      // Backend kabhi direct object bhej raha hoga,
      // kabhi {data:{...}} format me.
      const data = res.data.data || res.data;

      setStats({
        products:
          data.inventory?.totalProducts ??
          data.totalProducts ??
          0,

        warehouses:
          data.inventory?.totalWarehouses ??
          data.totalWarehouses ??
          0,

        lowStock:
          data.stock?.lowStockProducts ??
          data.lowStockProducts ??
          0,

        outOfStock:
          data.stock?.outOfStockProducts ??
          data.outOfStockProducts ??
          0,

        totalCost:
          data.inventory?.totalCost ??
          data.totalCost ??
          0,

        totalQuantity:
          data.inventory?.totalQuantity ??
          ((data.stock?.stockIn || 0) -
            (data.stock?.stockOut || 0)),

        totalOrders:
          data.orders?.totalOrders ??
          data.totalOrders ??
          0,

        pendingOrders:
          data.orders?.pendingOrders ??
          data.pendingOrders ??
          0,

        shippedOrders:
          data.orders?.shippedOrders ??
          data.shippedOrders ??
          0,

        totalShipments:
          data.shipments?.totalShipments ??
          data.totalShipments ??
          0,

        receivedShipments:
          data.shipments?.receivedShipments ??
          data.receivedShipments ??
          0,

        recentOrders:
          data.orders?.recentOrders ??
          data.recentOrders ??
          [],
      });

    } catch (error) {

      console.error("Dashboard Error:", error);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

    const cards = [
    {
      title: "Total Products",
      value: stats.products,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Warehouses",
      value: stats.warehouses,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Out Of Stock",
      value: stats.outOfStock,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Inventory Value",
      value: `₹ ${stats.totalCost.toLocaleString()}`,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Quantity",
      value: stats.totalQuantity,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Shipped Orders",
      value: stats.shippedOrders,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      title: "Total Shipments",
      value: stats.totalShipments,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      title: "Received Shipments",
      value: stats.receivedShipments,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const barData = [
    {
      name: "Products",
      value: stats.products,
    },
    {
      name: "Orders",
      value: stats.totalOrders,
    },
    {
      name: "Shipments",
      value: stats.totalShipments,
    },
    {
      name: "Warehouses",
      value: stats.warehouses,
    },
  ];

  const pieData = [
    {
      name: "Available",
      value: Math.max(
        stats.products -
          stats.lowStock -
          stats.outOfStock,
        0
      ),
    },
    {
      name: "Low Stock",
      value: stats.lowStock,
    },
    {
      name: "Out Of Stock",
      value: stats.outOfStock,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#facc15",
    "#ef4444",
  ];return (
  <div className="p-6 bg-gray-100 min-h-screen">

    <h1 className="text-3xl font-bold mb-8">
      Dashboard
    </h1>

    {/* Cards */}

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {cards.map((card) => (

        <div
          key={card.title}
          className={`${card.bg} rounded-xl shadow-md p-6 hover:shadow-xl transition`}
        >

          <h2 className="text-gray-600 text-sm font-medium">
            {card.title}
          </h2>

          <p className={`text-3xl font-bold mt-3 ${card.color}`}>
            {card.value}
          </p>

        </div>

      ))}

    </div>



    {/* Charts */}

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-5">
          Inventory Overview
        </h2>

        <div className="h-80">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={barData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>



      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-5">
          Stock Distribution
        </h2>

        <div className="h-80">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >

                {pieData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>



    {/* Recent Orders */}

    <div className="bg-white rounded-xl shadow-md mt-8 p-6">

      <h2 className="text-2xl font-bold mb-6">
        Recent Orders
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b bg-gray-50">

              <th className="p-3 text-left">
                Customer
              </th>

              <th className="p-3 text-left">
                Amount
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {stats.recentOrders.length === 0 ? (

              <tr>

                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-500"
                >
                  No Recent Orders
                </td>

              </tr>

            ) : (

              stats.recentOrders.map((order) => (

                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {order.customerName ||
                      order.customer ||
                      "Customer"}
                  </td>

                  <td className="p-3">
                    ₹{" "}
                    {(
                      order.totalAmount ||
                      order.amount ||
                      0
                    ).toLocaleString()}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>
);

}

export default Dashboard;