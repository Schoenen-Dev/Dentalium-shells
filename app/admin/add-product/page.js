// =====================================================================
//  REPLACE:  app/admin/add-product/page.js
//  Changes: session guard, posts straight to the PHP backend with the
//  admin token, and fixes the setName() crash after a successful add.
// =====================================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifySession, adminFetch } from "@/lib/adminAuth";

const COLLECTIONS = ["Dentalium Shells", "Seashell Jewelry", "Coastal Decor"];

export default function AddProduct() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState(COLLECTIONS[0]);
  const [actualPrice, setActualPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [image, setImage] = useState(null);

  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    verifySession().then((ok) => {
      if (!ok) {
        router.replace("/admin-login");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setBusy(true);

    try {
      const formData = new FormData();

      formData.append("category", category);
      formData.append("collection", collection);
      formData.append("actual_price", actualPrice);
      formData.append("selling_price", sellingPrice);
      formData.append("image", image);

      // goes straight to the PHP backend, with the admin token attached
      const response = await adminFetch("/wp-json/custom/v1/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert("Product added successfully");

        setCategory("");
        setCollection(COLLECTIONS[0]);
        setActualPrice("");
        setSellingPrice("");
        setImage(null);

        e.target.reset();
      } else {
        alert(data.error || "Failed to add product");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setBusy(false);
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
    <div className="min-h-screen bg-[#f8f5f0] p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-serif text-[#0B2C4D]">Add Product</h1>

        <button
          onClick={() => router.push("/admin")}
          className="bg-[#0B2C4D] text-white px-5 py-2 rounded"
        >
          Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded shadow max-w-2xl space-y-5"
      >
        <input
          type="text"
          placeholder="Product Name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <select
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
          className="w-full border p-3 rounded bg-white"
          required
        >
          {COLLECTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Actual Price"
          value={actualPrice}
          onChange={(e) => setActualPrice(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          placeholder="Selling Price"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          disabled={busy}
          className="bg-[#0B2C4D] text-white px-6 py-3 rounded disabled:opacity-60"
        >
          {busy ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
