// =====================================================================
//  REPLACE:  app/admin/products/page.js
//  Changes: session guard + adminFetch on edit/delete
// =====================================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifySession, adminFetch, BACKEND } from "@/lib/adminAuth";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const [editData, setEditData] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editActualPrice, setEditActualPrice] = useState("");
  const [editSellingPrice, setEditSellingPrice] = useState("");

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    verifySession().then((ok) => {
      if (!ok) {
        router.replace("/admin-login");
      } else {
        setChecking(false);
        fetchProducts();
      }
    });
  }, [router]);

  // FETCH PRODUCTS (public endpoint, no token needed)
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND}/wp-json/custom/v1/products`);
      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  // FILTER PRODUCTS
  const filteredProducts = products.filter((item) => {
    const matchesSearch = (item.category || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || item.category === categoryFilter;

    const matchesPrice =
      priceFilter === "" || Number(item.selling_price) <= Number(priceFilter);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await adminFetch(`/wp-json/custom/v1/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setProducts(products.filter((item) => item.id !== id));
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // OPEN EDIT MODAL
  const handleEdit = (item) => {
    setEditData(item);
    setEditCategory(item.category);
    setEditActualPrice(item.actual_price);
    setEditSellingPrice(item.selling_price);
  };

  // UPDATE PRODUCT
  const handleUpdate = async () => {
    try {
      const res = await adminFetch(
        `/wp-json/custom/v1/products/${editData.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            id: editData.id,
            category: editCategory,
            actual_price: editActualPrice,
            selling_price: editSellingPrice,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        alert("Product updated successfully");
        fetchProducts();
        setEditData(null);
      } else {
        alert(data.error || "Update failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
        <p className="text-[#0B2C4D]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-6">
      {/* TOP SECTION */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif text-[#0B2C4D]">Product Details</h1>

        <button
          onClick={() => router.push("/admin")}
          className="bg-[#0B2C4D] text-white px-5 py-2 rounded hover:bg-[#c9a15d] transition"
        >
          Back
        </button>
      </div>

      {/* FILTERS */}

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>

          {[...new Set(products.map((p) => p.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Max Price"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* TABLE */}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#0B2C4D] text-white">
            <tr>
              <th className="p-3 text-sm font-medium">ID</th>
              <th className="p-3 text-sm font-medium">Image</th>
              <th className="p-3 text-sm font-medium">Category</th>
              <th className="p-3 text-sm font-medium">Actual Price</th>
              <th className="p-3 text-sm font-medium">Selling Price</th>
              <th className="p-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm">{item.id}</td>

                <td className="p-3">
                  <img
                    src={item.image}
                    alt={item.category}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>

                <td className="p-3 text-sm">{item.category}</td>

                <td className="p-3 text-sm">${item.actual_price}</td>

                <td className="p-3 text-sm">${item.selling_price}</td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}

      {editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

            <div className="space-y-4">
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full border p-3 rounded"
                placeholder="Category"
              />

              <input
                type="number"
                value={editActualPrice}
                onChange={(e) => setEditActualPrice(e.target.value)}
                className="w-full border p-3 rounded"
                placeholder="Actual Price"
              />

              <input
                type="number"
                value={editSellingPrice}
                onChange={(e) => setEditSellingPrice(e.target.value)}
                className="w-full border p-3 rounded"
                placeholder="Selling Price"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-5 py-2 rounded"
                >
                  Update
                </button>

                <button
                  onClick={() => setEditData(null)}
                  className="bg-gray-400 text-white px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
