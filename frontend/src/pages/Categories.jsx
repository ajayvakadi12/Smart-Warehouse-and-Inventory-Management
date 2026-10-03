import { useEffect, useState } from "react";
import api from "../services/api";
import CategoryForm from "../components/forms/CategoryForm";

function Categories() {

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {

    try {

      const res = await api.get("/categories");

      setCategories(res.data.data);

    } catch (error) {

      console.log(error);

    }

  }

  async function handleDelete(id) {

    const confirmDelete = window.confirm(
      "Delete this category?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/categories/${id}`);

      alert("Category Deleted Successfully");

      fetchCategories();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Delete Failed"
      );

    }

  }

  const filteredCategories = categories.filter(

    (category) =>

      category.categoryName
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      category.description
        .toLowerCase()
        .includes(search.toLowerCase())

  );

  return (

    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">

          Categories

        </h1>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search Category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-lg px-4 py-2"
          />

          <button
            onClick={() => {
              setSelectedCategory(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + Add Category
          </button>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Description
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {

              filteredCategories.map((category) => (

                <tr
                  key={category._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    {category.categoryName}
                  </td>

                  <td className="p-4">
                    {category.description}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        category.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {category.status}
                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowModal(true);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(category._id)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            }

            {

              filteredCategories.length === 0 && (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500"
                  >
                    No Categories Found.
                  </td>

                </tr>

              )

            }

          </tbody>

        </table>

      </div>

      {

        showModal && (

          <CategoryForm
            category={selectedCategory}
            refreshCategories={fetchCategories}
            onClose={() =>
              setShowModal(false)
            }
          />

        )

      }

    </div>

  );

}

export default Categories;                      