import { useEffect, useState } from "react";
import api from "../../services/api";

function ProductList() {

  const [products, setProducts] = useState([]);


  useEffect(() => {
    fetchProducts();
  }, []);


  async function fetchProducts() {

    try {

      const response = await api.get("/products");

      setProducts(response.data.data);

    } catch (error) {

      console.log("Error fetching products:", error);

    }

  }


  return (
    <div className="mt-8">

      <h2 className="text-2xl font-bold mb-5">
        Product Inventory
      </h2>


      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

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

              <th className="p-3 text-left">
                Price
              </th>

              <th className="p-3 text-left">
                Quantity
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {
              products.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-5"
                  >
                    No Products Found
                  </td>
                </tr>

              ) : (

                products.map((product)=>(

                  <tr key={product._id}
                      className="border-t">

                    <td className="p-3">
                      {product.productName}
                    </td>


                    <td className="p-3">
                      {product.sku}
                    </td>


                    <td className="p-3">
                      {product.category}
                    </td>


                    <td className="p-3">
                      ₹{product.price}
                    </td>


                    <td className="p-3">
                      {product.quantity}
                    </td>


                    <td className="p-3">
                      {product.status}
                    </td>


                  </tr>

                ))

              )
            }


          </tbody>

        </table>


      </div>


    </div>
  );
}


export default ProductList;