import { useEffect, useState } from "react";
import api from "../services/api";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reports() {
  const [inventory, setInventory] = useState({
    totalStock: 0,
    products: [],
  });

  const [sales, setSales] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const [inventoryRes, salesRes, stockRes] = await Promise.all([
        api.get("/reports/inventory"),
        api.get("/reports/sales"),
        api.get("/reports/stock"),
      ]);

      setInventory(inventoryRes.data.data);
      setSales(salesRes.data.data);
      setTransactions(stockRes.data.data);
    } catch (error) {
      console.log("Reports Error:", error);
    }
  }

  function exportInventoryExcel() {
    const data = inventory.products.map((product) => ({
      Product: product.productName,
      SKU: product.sku,
      Category: product.category,
      Quantity: product.quantity,
      Price: product.price,
      Status: product.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Inventory"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "Inventory_Report.xlsx");
  }

  function exportSalesPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Sales Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Metric", "Value"]],
      body: [
        [
          "Completed Orders",
          sales.totalOrders,
        ],
        [
          "Revenue",
          `₹ ${sales.totalRevenue.toLocaleString()}`,
        ],
      ],
    });

    doc.save("Sales_Report.pdf");
  }

  return (
        <div className="p-6 bg-gray-100 min-h-screen">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Reports
          </h1>

          <p className="text-gray-500 mt-2">
            Inventory, Sales & Stock Reports
          </p>

        </div>

        <div className="flex gap-3 mt-5 lg:mt-0">

          <button
            onClick={exportInventoryExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            📥 Export Excel
          </button>

          <button
            onClick={exportSalesPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            📄 Export PDF
          </button>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow-lg p-6">

          <p className="text-gray-500">
            Total Stock
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {inventory.totalStock}
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">

          <p className="text-gray-500">
            Completed Orders
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {sales.totalOrders}
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">

          <p className="text-gray-500">
            Revenue
          </p>

          <h2 className="text-4xl font-bold text-purple-600 mt-3">
            ₹ {sales.totalRevenue.toLocaleString()}
          </h2>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Inventory Report
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">
                  Product
                </th>

                <th className="p-3 text-left">
                  SKU
                </th>

                <th className="p-3 text-left">
                  Category
                </th>

                <th className="p-3 text-center">
                  Quantity
                </th>

                <th className="p-3 text-center">
                  Price
                </th>

                <th className="p-3 text-center">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>
                              {inventory.products.map((product) => (

                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {product.productName}
                  </td>

                  <td className="p-3">
                    {product.sku}
                  </td>

                  <td className="p-3">
                    {product.category}
                  </td>

                  <td className="p-3 text-center">
                    {product.quantity}
                  </td>

                  <td className="p-3 text-center">
                    ₹ {product.price}
                  </td>

                  <td className="p-3 text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        product.status === "Available"
                          ? "bg-green-500"
                          : product.status === "Low Stock"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {product.status}
                    </span>

                  </td>

                </tr>

              ))}

              {inventory.products.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500"
                  >
                    No Products Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>



      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Sales Summary
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <div>

            <p className="text-gray-500">
              Completed Orders
            </p>

            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {sales.totalOrders}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Revenue Generated
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
              ₹ {sales.totalRevenue.toLocaleString()}
            </h3>

          </div>

        </div>

      </div>



      <div className="bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-5">
          Stock Movement History
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">
                  Product
                </th>

                <th className="p-3 text-left">
                  Type
                </th>

                <th className="p-3 text-center">
                  Quantity
                </th>

                <th className="p-3 text-left">
                  Warehouse
                </th>

                <th className="p-3 text-left">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>
                              {transactions.map((transaction) => (

                <tr
                  key={transaction._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {transaction.product?.productName || "-"}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        transaction.transactionType === "Stock In"
                          ? "bg-green-500"
                          : transaction.transactionType === "Stock Out"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {transaction.transactionType}
                    </span>

                  </td>

                  <td className="p-3 text-center">
                    {transaction.quantity}
                  </td>

                  <td className="p-3">
                    {transaction.warehouse?.warehouseName || "-"}
                  </td>

                  <td className="p-3">
                    {new Date(
                      transaction.createdAt
                    ).toLocaleDateString()}
                  </td>

                </tr>

              ))}

              {transactions.length === 0 && (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-500"
                  >
                    No Stock Transactions Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default Reports;