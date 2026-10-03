import { useEffect, useState } from "react";
import api from "../services/api";
import ProductForm from "../components/forms/ProductForm";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/products/${id}`);

    alert("Product deleted successfully");

    fetchProducts();
  } catch (error) {
    console.log(error);

    alert("Failed to delete product");
  }
}

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => {
  setSelectedProduct(null);
  setShowModal(true);
}}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Warehouse</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">{product.productName}</td>
                <td className="p-4">{product.sku}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">₹ {product.price}</td>
                <td className="p-4">{product.quantity}</td>
                <td className="p-4">
                  {product.warehouse?.warehouseName}
                </td>

                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {product.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
  onClick={() => {
    setSelectedProduct(product);
    setShowModal(true);
  }}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
>
  Edit
</button>

                    <button
  onClick={() => handleDelete(product._id)}
  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
>
  Delete
</button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ProductForm
  product={selectedProduct}
  onClose={() => setShowModal(false)}
  refreshProducts={fetchProducts}
/>
      )}
    </div>
  );
}

export default Products;