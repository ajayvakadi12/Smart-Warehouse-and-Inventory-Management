import { useEffect, useState } from "react";
import api from "../../services/api";

function ShipmentForm({ onClose, refreshShipments }) {
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    supplier: "",
    warehouse: "",
    product: "",
    quantity: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const supplierRes = await api.get("/suppliers");
      const warehouseRes = await api.get("/warehouses");
      const productRes = await api.get("/products");

      setSuppliers(supplierRes.data.data || []);
      setWarehouses(warehouseRes.data.data || []);
      setProducts(productRes.data.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/shipments", {
        supplier: formData.supplier,
        warehouse: formData.warehouse,
        products: [
          {
            product: formData.product,
            quantity: Number(formData.quantity),
          },
        ],
      });

      alert("Shipment Created Successfully");

      refreshShipments();
      onClose();
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Failed to Create Shipment");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        <div className="p-6">

          <h2 className="text-2xl font-bold mb-5">
            Create Shipment
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Supplier</option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier._id}
                  value={supplier._id}
                >
                  {supplier.supplierName}
                </option>
              ))}
            </select>

            <select
              name="warehouse"
              value={formData.warehouse}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Warehouse</option>

              {warehouses.map((warehouse) => (
                <option
                  key={warehouse._id}
                  value={warehouse._id}
                >
                  {warehouse.warehouseName}
                </option>
              ))}
            </select>

            <select
              name="product"
              value={formData.product}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                >
                  {product.productName}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <div className="flex justify-end gap-3 pt-3">

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default ShipmentForm;