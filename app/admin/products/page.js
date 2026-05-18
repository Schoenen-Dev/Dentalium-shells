"use client";

import { useEffect, useState } from "react";

export default function ProductDetails() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "http://dentalium.local/wp-json/custom/v1/products",
      );

      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-10">
      <h1 className="text-4xl font-serif text-[#0B2C4D] mb-10">
        Product Details
      </h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-[#0B2C4D] text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) &&
              products.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4">{item.id}</td>

                  <td className="p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>

                  <td className="p-4">{item.name}</td>

                  <td className="p-4">${item.actual_price}</td>

                  <td className="p-4">${item.selling_price}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
