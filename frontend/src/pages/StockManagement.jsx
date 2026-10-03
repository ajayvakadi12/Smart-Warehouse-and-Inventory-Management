import { useEffect, useState } from "react";
import api from "../services/api";

function StockManagement() {

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [formData, setFormData] = useState({
    product: "",
    warehouse: "",
    transactionType: "Stock In",
    quantity: "",
    remarks: ""
  });

  useEffect(() => {

    fetchProducts();
    fetchWarehouses();
    fetchTransactions();

  }, []);

  async function fetchProducts() {

    try {

      const res = await api.get("/products?limit=100");

      setProducts(res.data.data);

    } catch (error) {

      console.log(error);

    }

  }

  async function fetchWarehouses() {

    try {

      const res = await api.get("/warehouses");

      setWarehouses(res.data.data);

    } catch (error) {

      console.log(error);

    }

  }

  async function fetchTransactions() {

    try {

      const res = await api.get("/stocks");

      setTransactions(res.data.data);

    } catch (error) {

      console.log(error);

    }

  }

  function handleChange(e) {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      await api.post("/stocks", {

        ...formData,

        quantity: Number(formData.quantity)

      });

      alert("Stock Transaction Successful");

      setFormData({

        product: "",

        warehouse: "",

        transactionType: "Stock In",

        quantity: "",

        remarks: ""

      });

      fetchProducts();
      fetchTransactions();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Transaction Failed"
      );

    }

  }

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Stock Management
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="text-xl font-bold mb-5">

          New Stock Transaction

        </h2>

        <form

          onSubmit={handleSubmit}

          className="grid grid-cols-1 md:grid-cols-2 gap-4"

        >

          <select

            name="product"

            value={formData.product}

            onChange={handleChange}

            className="border rounded-lg p-3"

            required

          >

            <option value="">
              Select Product
            </option>

            {

              products.map(product => (

                <option

                  key={product._id}

                  value={product._id}

                >

                  {product.productName}

                </option>

              ))

            }

          </select>

          <select

            name="warehouse"

            value={formData.warehouse}

            onChange={handleChange}

            className="border rounded-lg p-3"

            required

          >

            <option value="">
              Select Warehouse
            </option>

            {

              warehouses.map(warehouse => (

                <option

                  key={warehouse._id}

                  value={warehouse._id}

                >

                  {warehouse.warehouseName}

                </option>

              ))

            }

          </select>          <select
            name="transactionType"
            value={formData.transactionType}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="Stock In">
              Stock In
            </option>

            <option value="Stock Out">
              Stock Out
            </option>

          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <textarea
            rows="3"
            name="remarks"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="border rounded-lg p-3 md:col-span-2"
          />

          <button
            className="bg-blue-600 text-white rounded-lg py-3 md:col-span-2 hover:bg-blue-700"
          >
            Save Transaction
          </button>

        </form>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-5 border-b">

          <h2 className="text-xl font-bold">

            Stock Transaction History

          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Warehouse
              </th>

              <th className="p-4 text-center">
                Type
              </th>

              <th className="p-4 text-center">
                Quantity
              </th>

              <th className="p-4 text-left">
                Remarks
              </th>

              <th className="p-4 text-center">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {

              transactions.map(transaction => (

                <tr
                  key={transaction._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    {transaction.product?.productName}
                  </td>

                  <td className="p-4">
                    {transaction.warehouse?.warehouseName}
                  </td>

                  <td className="p-4 text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        transaction.transactionType === "Stock In"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {transaction.transactionType}
                    </span>

                  </td>

                  <td className="p-4 text-center font-semibold">
                    {transaction.quantity}
                  </td>

                  <td className="p-4">
                    {transaction.remarks || "-"}
                  </td>

                  <td className="p-4 text-center">
                    {new Date(
                      transaction.createdAt
                    ).toLocaleDateString()}
                  </td>

                </tr>

              ))

            }            {

              transactions.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500"
                  >

                    No Transactions Found

                  </td>

                </tr>

              )

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default StockManagement;