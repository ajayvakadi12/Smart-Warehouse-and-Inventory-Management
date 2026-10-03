import { useEffect, useState } from "react";
import api from "../../services/api";

function OrderForm({
  onClose,
  refreshOrders,
}) {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    product: "",
    quantity: 1,
  });

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "product") {
      const product = products.find(
        (p) => p._id === value
      );

      setSelectedProduct(product);
    }
  }
    async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedProduct) {
      alert("Please select a product");
      return;
    }

    try {
      await api.post("/orders", {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,

        products: [
          {
            product: selectedProduct._id,
            quantity: Number(formData.quantity),
            price: selectedProduct.price,
          },
        ],

        totalAmount:
          selectedProduct.price *
          Number(formData.quantity),
      });

      alert("Order Created Successfully");

      refreshOrders();
      onClose();

    } catch (error) {
  console.log("FULL ERROR:", error);
  console.log("RESPONSE:", error.response);
  console.log("DATA:", error.response?.data);

  alert(
    JSON.stringify(error.response?.data, null, 2)
  );
}
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-5">
          Create Order
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >
                      <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="email"
            name="customerEmail"
            placeholder="Customer Email"
            value={formData.customerEmail}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="text"
            name="customerPhone"
            placeholder="Customer Phone"
            value={formData.customerPhone}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <textarea
            name="shippingAddress"
            placeholder="Shipping Address"
            value={formData.shippingAddress}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            rows="3"
            required
          />

          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">
              Select Product
            </option>

            {products.map((product) => (
              <option
                key={product._id}
                value={product._id}
              >
                {product.productName} (₹{product.price})
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          {selectedProduct && (
            <div className="bg-gray-100 rounded-lg p-3">
              <p>
                <strong>Price:</strong> ₹
                {selectedProduct.price}
              </p>

              <p>
                <strong>Total:</strong> ₹
                {selectedProduct.price *
                  Number(formData.quantity)}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            >
              Create Order
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default OrderForm;
    