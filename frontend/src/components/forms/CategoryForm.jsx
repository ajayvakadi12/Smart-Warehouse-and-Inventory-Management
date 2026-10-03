import { useEffect, useState } from "react";
import api from "../../services/api";

function CategoryForm({
  category,
  onClose,
  refreshCategories,
}) {

  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    status: "Active"
  });


  useEffect(() => {

    if (category) {

      setFormData({
        categoryName: category.categoryName || "",
        description: category.description || "",
        status: category.status || "Active"
      });

    }

  }, [category]);


  function handleChange(e) {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  }


  async function handleSubmit(e) {

    e.preventDefault();

    try {

      if (category) {

        await api.put(
          `/categories/${category._id}`,
          formData
        );

        alert("Category Updated Successfully");

      } else {

        await api.post(
          "/categories",
          formData
        );

        alert("Category Added Successfully");

      }

      refreshCategories();

      onClose();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Operation Failed"
      );

    }

  }


  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold mb-5">

          {category
            ? "Edit Category"
            : "Add Category"}

        </h2>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="categoryName"
            placeholder="Category Name"
            value={formData.categoryName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />


          <textarea
            rows="4"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />


          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>


          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2 rounded-lg"
            >
              Cancel
            </button>


            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              {category ? "Update" : "Save"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default CategoryForm;    