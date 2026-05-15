"use client";

import { useState } from "react";

export default function AddProduct() {

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://dentalium.local/wp-json/custom/v1/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            category,
            price,
            image,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Product added successfully");
        setName("");
        setCategory("");
        setPrice("");
        setImage("");
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-10">

      <h1 className="text-4xl font-serif text-[#0B2C4D] mb-10">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded shadow max-w-2xl space-y-5"
      >

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
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