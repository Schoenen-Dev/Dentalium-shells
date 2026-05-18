"use client";

import { useState } from "react";

export default function AddProduct() {
  const [category, setCategory] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("category", category);
      formData.append("actual_price", actualPrice);
      formData.append("selling_price", sellingPrice);
      formData.append("image", image);

      const response = await fetch("/api/upload-product", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert("Product added successfully");

        setName("");
        setActualPrice("");
        setSellingPrice("");
        setImage(null);
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-10">
      <h1 className="text-4xl font-serif text-[#0B2C4D] mb-10">Add Product</h1>

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
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-[#0B2C4D] text-white px-6 py-3 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
