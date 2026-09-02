// =====================================================================
//  REPLACE:  app/admin/orders/page.js
// =====================================================================

"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { adminFetch } from "@/lib/adminAuth";

const STATUSES = ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"];

const TONES = {
  Pending: "text-[#8a6d1f] bg-[#b88e4b]/15",
  Paid: "text-[#1f5d43] bg-[#1f5d43]/10",
  Shipped: "text-[#0b2f49] bg-[#0b2f49]/10",
  Delivered: "text-[#1f5d43] bg-[#1f5d43]/10",
  Cancelled: "text-[#b4432f] bg-[#b4432f]/10",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminFetch("/wp-json/custom/v1/orders");
      const data = await response.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await adminFetch(`/wp-json/custom/v1/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ payment_status: status }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, payment_status: status } : o)),
        );
      } else {
        alert(data.error || "Couldn't update that order. Try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const money = (n) =>
    "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

  const parseItems = (raw) => {
    try {
      const items = JSON.parse(raw);
      return Array.isArray(items) ? items : [];
    } catch (e) {
      return [];
    }
  };

  const visible =
    filter === "All"
      ? orders
      : orders.filter((o) => (o.payment_status || "Pending") === filter);

  return (
    <AdminShell
      title="Orders"
      subtitle="Every purchase, newest first. Change the status as each one moves along."
    >
      {/* ---------------- FILTER ---------------- */}

      <div className="flex flex-wrap gap-6 mb-8">
        {["All", ...STATUSES].map((s) => {
          const count =
            s === "All"
              ? orders.length
              : orders.filter((o) => (o.payment_status || "Pending") === s)
                  .length;

          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`relative pb-2 text-[15px] transition-colors ${
                filter === s
                  ? "text-[#0b2f49]"
                  : "text-[#0b2f49]/45 hover:text-[#0b2f49]/75"
              }`}
            >
              {s}
              <span className="ml-1.5 text-[13px] text-[#0b2f49]/35">
                {count}
              </span>

              {filter === s && (
                <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#b88e4b]" />
              )}
            </button>
          );
        })}
      </div>

      {/* ---------------- LIST ---------------- */}

      {loading ? (
        <div className="space-y-px">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[92px] bg-white/70 animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-[#ebdec8] px-8 py-20 text-center">
          <p className="font-serif text-[22px] text-[#0b2f49]/40">
            {orders.length === 0 ? "No orders yet" : `Nothing marked ${filter}`}
          </p>

          <p className="mt-2 text-[14px] text-[#0b2f49]/40">
            {orders.length === 0
              ? "Orders will show up here the moment someone checks out."
              : "Try another status above."}
          </p>
        </div>
      ) : (
        <div className="border border-[#ebdec8] bg-white">
          {visible.map((order, index) => {
            const items = parseItems(order.items);
            const expanded = open === order.id;

            return (
              <div
                key={order.id}
                className={index > 0 ? "border-t border-[#ebdec8]" : ""}
              >
                {/* summary row */}
                <div className="flex flex-wrap items-center gap-5 px-6 lg:px-7 py-5">
                  <button
                    onClick={() => setOpen(expanded ? null : order.id)}
                    className="flex-1 min-w-[190px] text-left"
                  >
                    <p className="text-[15px] font-medium text-[#0b2f49]">
                      {order.full_name}
                    </p>

                    <p className="text-[13px] text-[#0b2f49]/45">
                      #{order.id} · {items.length}{" "}
                      {items.length === 1 ? "item" : "items"} ·{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </button>

                  <span
                    className={`px-3 py-1 text-[12px] ${
                      TONES[order.payment_status] || "text-[#0b2f49]/60 bg-[#0b2f49]/[0.06]"
                    }`}
                  >
                    {order.payment_status || "Pending"}
                  </span>

                  <p className="font-serif text-[20px] text-[#0b2f49] w-28 text-right">
                    {money(order.total)}
                  </p>

                  <select
                    value={order.payment_status || "Pending"}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border border-[#ebdec8] bg-[#FBF7F1] text-[14px] text-[#0b2f49] px-3 py-2 outline-none focus:border-[#b88e4b] transition-colors"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* detail */}
                {expanded && (
                  <div className="bg-[#FBF7F1] border-t border-[#ebdec8] px-6 lg:px-7 py-7 grid md:grid-cols-[1fr_1.4fr] gap-10">
                    <div>
                      <h3 className="text-[13px] font-medium text-[#0b2f49]/70 mb-3">
                        Ship to
                      </h3>

                      <p className="text-[15px] text-[#0b2f49] leading-relaxed">
                        {order.full_name}
                        <br />
                        {order.address}
                        <br />
                        {order.city} {order.zip}
                        <br />
                        {order.country}
                      </p>

                      <a
                        href={`mailto:${order.email}`}
                        className="inline-block mt-3 text-[14px] text-[#b88e4b] hover:underline"
                      >
                        {order.email}
                      </a>

                      {order.transaction_id && (
                        <p className="mt-4 text-[13px] text-[#0b2f49]/45 break-all">
                          Payment reference {order.transaction_id}
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[13px] font-medium text-[#0b2f49]/70 mb-3">
                        Items
                      </h3>

                      <div className="space-y-4">
                        {items.map((item, i) => (
                          <div key={i} className="flex gap-4">
                            <img
                              src={item.image}
                              alt=""
                              className="w-14 h-14 object-cover shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] text-[#0b2f49] truncate">
                                {item.name}
                              </p>

                              <p className="text-[13px] text-[#0b2f49]/45">
                                {item.qty} × {money(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-5 border-t border-[#ebdec8] space-y-2 text-[14px]">
                        <div className="flex justify-between text-[#0b2f49]/60">
                          <span>Subtotal</span>
                          <span>{money(order.subtotal)}</span>
                        </div>

                        <div className="flex justify-between text-[#0b2f49]/60">
                          <span>Shipping</span>
                          <span>
                            {Number(order.shipping) === 0
                              ? "Free"
                              : money(order.shipping)}
                          </span>
                        </div>

                        <div className="flex justify-between pt-2 text-[#0b2f49] font-medium">
                          <span>Total</span>
                          <span>{money(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
