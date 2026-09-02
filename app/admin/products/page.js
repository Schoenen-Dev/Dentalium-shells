// =====================================================================
//  REPLACE:  app/admin/products/page.js
// =====================================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { adminFetch, BACKEND } from "@/lib/adminAuth";

const COLLECTIONS = ["Dentalium Shells", "Seashell Jewelry", "Coastal Decor"];

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    category: "",
    collection: COLLECTIONS[0],
    actual_price: "",
    selling_price: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND}/wp-json/custom/v1/products`, {
        cache: "no-store",
      });

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const money = (n) =>
    "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

  const term = search.trim().toLowerCase();

  const visible = products.filter((p) => {
    const matchesSearch = !term || (p.category || "").toLowerCase().includes(term);
    const matchesFilter = filter === "All" || p.collection === filter;

    return matchesSearch && matchesFilter;
  });

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      category: item.category || "",
      collection: item.collection || COLLECTIONS[0],
      actual_price: item.actual_price || "",
      selling_price: item.selling_price || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await adminFetch(
        `/wp-json/custom/v1/products/${editing.id}`,
        { method: "PUT", body: JSON.stringify({ id: editing.id, ...form }) },
      );

      const data = await res.json();

      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...form } : p)),
        );
        setEditing(null);
      } else {
        alert(data.error || "Couldn't save those changes.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Remove "${item.category}" from the shop?`)) return;

    try {
      const res = await adminFetch(`/wp-json/custom/v1/products/${item.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== item.id));
      } else {
        alert(data.error || "Couldn't remove that product.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const field =
    "w-full bg-transparent border-b border-[#0b2f49]/20 pb-2.5 text-[16px] text-[#0b2f49] outline-none transition-colors focus:border-[#b88e4b]";

  const label = "block text-[13px] font-medium text-[#0b2f49]/70 mb-2";

  return (
    <AdminShell
      title="Products"
      subtitle="Everything currently listed in the shop."
      actions={
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="w-full sm:w-56 bg-white border border-[#ebdec8] px-4 py-2.5 text-[14px] text-[#0b2f49] outline-none focus:border-[#b88e4b] transition-colors"
          />

          <button
            onClick={() => router.push("/admin/add-product")}
            className="bg-[#0b2f49] text-white text-[14px] px-6 py-2.5 hover:bg-[#b88e4b] transition-colors"
          >
            Add a product
          </button>
        </div>
      }
    >
      {/* ---------------- COLLECTION FILTER ---------------- */}

      <div className="flex flex-wrap gap-6 mb-8">
        {["All", ...COLLECTIONS].map((c) => {
          const count =
            c === "All"
              ? products.length
              : products.filter((p) => p.collection === c).length;

          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`relative pb-2 text-[15px] transition-colors ${
                filter === c
                  ? "text-[#0b2f49]"
                  : "text-[#0b2f49]/45 hover:text-[#0b2f49]/75"
              }`}
            >
              {c}
              <span className="ml-1.5 text-[13px] text-[#0b2f49]/35">
                {count}
              </span>

              {filter === c && (
                <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#b88e4b]" />
              )}
            </button>
          );
        })}
      </div>

      {/* ---------------- GRID ---------------- */}

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[#ebdec8] border border-[#ebdec8]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white h-[132px] animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-[#ebdec8] px-8 py-20 text-center">
          <p className="font-serif text-[22px] text-[#0b2f49]/40">
            {products.length === 0 ? "Nothing listed yet" : "No matches"}
          </p>

          <p className="mt-2 mb-7 text-[14px] text-[#0b2f49]/40">
            {products.length === 0
              ? "Add your first piece and it goes straight into the shop."
              : "Try another name or collection."}
          </p>

          {products.length === 0 && (
            <button
              onClick={() => router.push("/admin/add-product")}
              className="bg-[#0b2f49] text-white text-[14px] px-7 py-3 hover:bg-[#b88e4b] transition-colors"
            >
              Add a product
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[#ebdec8] border border-[#ebdec8]">
          {visible.map((item) => {
            const full = Number(item.actual_price);
            const now = Number(item.selling_price);
            const off = full > now ? Math.round(((full - now) / full) * 100) : 0;

            return (
              <article key={item.id} className="group bg-white p-5 flex gap-5">
                <img
                  src={item.image}
                  alt={item.category}
                  className="w-[92px] h-[92px] object-cover shrink-0"
                />

                <div className="min-w-0 flex-1 flex flex-col">
                  <p className="text-[15px] text-[#0b2f49] leading-snug">
                    {item.category}
                  </p>

                  <p className="mt-1 text-[13px] text-[#0b2f49]/45">
                    {item.collection}
                  </p>

                  <div className="mt-auto pt-3 flex items-baseline gap-2">
                    <span className="font-serif text-[19px] text-[#0b2f49]">
                      {money(now)}
                    </span>

                    {off > 0 && (
                      <>
                        <span className="text-[13px] text-[#0b2f49]/35 line-through">
                          {money(full)}
                        </span>
                        <span className="text-[12px] text-[#b88e4b]">
                          {off}% off
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(item)}
                    aria-label={`Edit ${item.category}`}
                    className="p-2 text-[#0b2f49]/45 hover:text-[#0b2f49] transition-colors"
                  >
                    <Pencil className="w-4 h-4" strokeWidth={1.75} />
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    aria-label={`Remove ${item.category}`}
                    className="p-2 text-[#0b2f49]/45 hover:text-[#b4432f] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ---------------- EDIT PANEL ---------------- */}

      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[#0b2f49]/40"
            onClick={() => setEditing(null)}
          />

          <form
            onSubmit={handleUpdate}
            className="relative w-full max-w-[420px] bg-[#FBF7F1] h-full overflow-y-auto p-8 lg:p-10"
          >
            <div className="flex items-start justify-between mb-8">
              <h2 className="font-serif text-[26px] text-[#0b2f49]">
                Edit product
              </h2>

              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close"
                className="p-2 -mr-2 text-[#0b2f49]/45 hover:text-[#0b2f49] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={editing.image}
              alt={editing.category}
              className="w-full aspect-square object-cover mb-8"
            />

            <div className="space-y-7">
              <div>
                <label htmlFor="e-name" className={label}>
                  Product name
                </label>

                <input
                  id="e-name"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="e-collection" className={label}>
                  Collection
                </label>

                <select
                  id="e-collection"
                  value={form.collection}
                  onChange={(e) =>
                    setForm({ ...form, collection: e.target.value })
                  }
                  className={`${field} cursor-pointer`}
                >
                  {COLLECTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="e-full" className={label}>
                    Full price
                  </label>

                  <input
                    id="e-full"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.actual_price}
                    onChange={(e) =>
                      setForm({ ...form, actual_price: e.target.value })
                    }
                    required
                    className={field}
                  />
                </div>

                <div>
                  <label htmlFor="e-now" className={label}>
                    Price paid
                  </label>

                  <input
                    id="e-now"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.selling_price}
                    onChange={(e) =>
                      setForm({ ...form, selling_price: e.target.value })
                    }
                    required
                    className={field}
                  />
                </div>
              </div>

              <p className="text-[13px] text-[#0b2f49]/40">
                To change the photo, remove this product and add it again.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#0b2f49] text-white text-[15px] py-4 hover:bg-[#b88e4b] transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-7 border border-[#0b2f49]/20 text-[15px] text-[#0b2f49] hover:border-[#b88e4b] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
