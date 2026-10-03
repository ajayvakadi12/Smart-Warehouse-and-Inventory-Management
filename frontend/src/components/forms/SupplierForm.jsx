import { useEffect, useState } from "react";
import api from "../../services/api";

function SupplierForm({
  supplier,
  onClose,
  refreshSuppliers,
}) {
  const [formData, setFormData] = useState({
    supplierName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplierName: supplier.supplierName || "",
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        status: supplier.status || "Active",
      });
    }
  }, [supplier]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (supplier) {
        await api.put(`/suppliers/${supplier._id}`, formData);
        alert("Supplier Updated Successfully");
      } else {
        await api.post("/suppliers", formData);
        alert("Supplier Added Successfully");
      }

      refreshSuppliers();
      onClose();
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Operation Failed");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4">

      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">

        <div className="p-6">

          <h2 className="text-2xl font-bold mb-5">
            {supplier ? "Edit Supplier" : "Add Supplier"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-3"
          >

            <input
              name="supplierName"
              placeholder="Supplier Name"
              value={formData.supplierName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <input
              name="contactPerson"
              placeholder="Contact Person"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <textarea
              rows="3"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

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
                {supplier ? "Update" : "Save"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default SupplierForm;