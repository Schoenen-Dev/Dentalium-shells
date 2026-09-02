// =====================================================================
//  REPLACE:  app/admin/add-product/page.js
// =====================================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { adminFetch } from "@/lib/adminAuth";

const COLLECTIONS = ["Dentalium Shells", "Seashell Jewelry", "Coastal Decor"];

export default function AddProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [collection, setCollection] = useState(COLLECTIONS[0]);
  const [actualPrice, setActualPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const pickImage = (file) => {
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const discount =
    Number(actualPrice) > 0 && Number(actualPrice) > Number(sellingPrice)
      ? Math.round(
          ((Number(actualPrice) - Number(sellingPrice)) / Number(actualPrice)) *
            100,
        )
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    if (!image) {
      setIsError(true);
      setMessage("Choose a photo before saving.");
      return;
    }

    setBusy(true);

    try {
      const formData = new FormData();

      formData.append("category", name);
      formData.append("collection", collection);
      formData.append("actual_price", actualPrice);
      formData.append("selling_price", sellingPrice);
      formData.append("image", image);

      const response = await adminFetch("/wp-json/custom/v1/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`"${name}" is now live in the shop.`);

        setName("");
        setCollection(COLLECTIONS[0]);
        setActualPrice("");
        setSellingPrice("");
        setImage(null);
        setPreview("");
      } else {
        setIsError(true);
        setMessage(data.error || "Couldn't save that product.");
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
      setMessage("Can't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full bg-transparent border-b border-[#0b2f49]/20 pb-2.5 text-[16px] text-[#0b2f49] outline-none transition-colors focus:border-[#b88e4b]";

  const label = "block text-[13px] font-medium text-[#0b2f49]/70 mb-2";

  return (
    <AdminShell
      title="Add a product"
      subtitle="It appears in the shop as soon as you save."
      actions={
        <button
          onClick={() => router.push("/admin/products")}
          className="border border-[#0b2f49]/20 text-[14px] text-[#0b2f49] px-6 py-3 hover:border-[#b88e4b] transition-colors"
        >
          View all products
        </button>
      }
    >
      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-[1fr_minmax(0,380px)] gap-px bg-[#ebdec8] border border-[#ebdec8]"
      >
        {/* ---------------- DETAILS ---------------- */}

        <div className="bg-white p-8 lg:p-10 space-y-8">
          <div>
            <label htmlFor="name" className={label}>
              Product name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dentalium Shells 1.25 – 1.50 inches"
              required
              className={field}
            />
          </div>

          <div>
            <label htmlFor="collection" className={label}>
              Collection
            </label>

            <select
              id="collection"
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className={`${field} cursor-pointer`}
            >
              {COLLECTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <p className="mt-2 text-[13px] text-[#0b2f49]/40">
              Decides which shop page it shows on.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <label htmlFor="actual" className={label}>
                Full price
              </label>

              <input
                id="actual"
                type="number"
                step="0.01"
                min="0"
                value={actualPrice}
                onChange={(e) => setActualPrice(e.target.value)}
                placeholder="0.00"
                required
                className={field}
              />
            </div>

            <div>
              <label htmlFor="selling" className={label}>
                Price customers pay
              </label>

              <input
                id="selling"
                type="number"
                step="0.01"
                min="0"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="0.00"
                required
                className={field}
              />
            </div>
          </div>

          {discount > 0 && (
            <p className="text-[14px] text-[#0b2f49]/55">
              Shoppers will see a {discount}% saving on this piece.
            </p>
          )}

          {message && (
            <div
              className={`border-l-2 px-4 py-3 ${
                isError
                  ? "border-[#b4432f] bg-[#b4432f]/[0.06]"
                  : "border-[#1f5d43] bg-[#1f5d43]/[0.06]"
              }`}
            >
              <p
                className={`text-[14px] ${
                  isError ? "text-[#b4432f]" : "text-[#1f5d43]"
                }`}
              >
                {message}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="bg-[#0b2f49] text-white text-[15px] px-10 py-4 hover:bg-[#b88e4b] transition-colors disabled:opacity-50 disabled:hover:bg-[#0b2f49]"
          >
            {busy ? "Saving…" : "Save product"}
          </button>
        </div>

        {/* ---------------- PHOTO ---------------- */}

        <div className="bg-white p-8 lg:p-10">
          <p className={label}>Photo</p>

          <label
            htmlFor="image"
            className="group block aspect-square border border-dashed border-[#0b2f49]/25 cursor-pointer overflow-hidden hover:border-[#b88e4b] transition-colors"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="h-full flex flex-col items-center justify-center gap-3 text-[#0b2f49]/35 group-hover:text-[#b88e4b] transition-colors">
                <ImagePlus className="w-7 h-7" strokeWidth={1.5} />
                <span className="text-[14px]">Choose a photo</span>
              </span>
            )}
          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => pickImage(e.target.files[0])}
            className="sr-only"
          />

          {preview && (
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview("");
              }}
              className="mt-4 text-[14px] text-[#0b2f49]/50 hover:text-[#b4432f] transition-colors"
            >
              Remove photo
            </button>
          )}

          <p className="mt-5 text-[13px] leading-relaxed text-[#0b2f49]/40">
            Square photos look best. JPG, PNG or WebP, up to 5 MB.
          </p>
        </div>
      </form>
    </AdminShell>
  );
}
