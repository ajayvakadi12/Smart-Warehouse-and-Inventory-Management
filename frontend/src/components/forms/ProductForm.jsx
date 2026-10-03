import { useEffect, useState } from "react";
import api from "../../services/api";

function ProductForm({
  product,
  onClose,
  refreshProducts,
}) {
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
    warehouse: "",
    status: "Available",
  });

  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
  fetchWarehouses();
}, []);

useEffect(() => {
  if (product) {
    setFormData({
      productName: product.productName || "",
      sku: product.sku || "",
      category: product.category || "",
      description: product.description || "",
      price: product.price || "",
      quantity: product.quantity || "",
      warehouse: product.warehouse?._id || "",
      status: product.status || "Available",
    });
  }
}, [product]);

  async function fetchWarehouses() {
    try {
      const response = await api.get("/warehouses");
      setWarehouses(response.data.data || []);
    } catch (error) {
      console.log("Warehouse fetch error:", error);
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
      let response;

if (product) {
  response = await api.put(
    `/products/${product._id}`,
    {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    }
  );
} else {
  response = await api.post(
    "/products",
    {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    }
  );
}
      console.log("Product Created:", response.data);

      alert(
  product
    ? "Product Updated Successfully"
    : "Product Added Successfully"
);
      if (refreshProducts) {
        refreshProducts();
      }

      onClose();
    } catch (error) {
      console.log(
        "Product creation error:",
        error.response?.data || error.message
      );

      alert("Failed to add product");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-5">
  {product ? "Edit Product" : "Add Product"}
</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="productName"
              placeholder="Product Name"
              value={formData.productName}
              className="w-full border rounded-lg px-3 py-2"
              onChange={handleChange}
              required
            />

            <input
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              className="w-full border rounded-lg px-3 py-2"
              onChange={handleChange}
              required
            />

            <input
              name="category"
              placeholder="Category"
              value={formData.category}
              className="w-full border rounded-lg px-3 py-2"
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              rows="3"
              value={formData.description}
              className="w-full border rounded-lg px-3 py-2"
              onChange={handleChange}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              className="w-full border rounded-lg px-3 py-2"
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              className="w-full border rounded-lg px-3 py-2"
              onChange={handleChange}
              required
            />

            <select
              name="warehouse"
              value={formData.warehouse}
              className="w-full border rounded-lg px-3 py-2"
              onChange={handleChange}
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
              name="status"
              value={formData.status}
              className="w-full border rounded-lg px-3 py-2"
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <div className="sticky bottom-0 bg-white pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
               {product ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;