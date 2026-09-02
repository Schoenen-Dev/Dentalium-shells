// =====================================================================
//  REPLACE:  app/admin/page.js
// =====================================================================

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { adminFetch, BACKEND } from "@/lib/adminAuth";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productRes, orderRes, contactRes] = await Promise.all([
        fetch(`${BACKEND}/wp-json/custom/v1/products`, { cache: "no-store" }),
        adminFetch("/wp-json/custom/v1/orders"),
        adminFetch("/wp-json/custom/v1/contacts"),
      ]);

      const products = await productRes.json();
      const orders = await orderRes.json();
      const contacts = await contactRes.json();

      const orderList = Array.isArray(orders) ? orders : [];

      const revenue = orderList
        .filter((o) => o.payment_status !== "Cancelled")
        .reduce((sum, o) => sum + Number(o.total || 0), 0);

      setStats({
        products: Array.isArray(products) ? products.length : 0,
        orders: orderList.length,
        pending: orderList.filter((o) => o.payment_status === "Pending").length,
        messages: Array.isArray(contacts) ? contacts.length : 0,
        revenue,
      });

      setRecent(orderList.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  };

  const money = (n) =>
    "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

  const CARDS = [
    { label: "Products listed", value: stats?.products, href: "/admin/products" },
    { label: "Orders received", value: stats?.orders, href: "/admin/orders" },
    { label: "Awaiting payment", value: stats?.pending, href: "/admin/orders" },
    { label: "Messages", value: stats?.messages, href: "/admin/users" },
  ];

  return (
    <AdminShell
      title="Overview"
      subtitle="Where the shop stands today."
      actions={
        <Link
          href="/admin/add-product"
          className="bg-[#0b2f49] text-white text-[14px] px-6 py-3 hover:bg-[#b88e4b] transition-colors"
        >
          Add a product
        </Link>
      }
    >
      {/* ---------------- REVENUE ---------------- */}

      <div className="bg-[#0b2f49] px-8 py-10 lg:px-12 lg:py-12">
        <p className="text-[13px] text-white/45">Total from all orders</p>

        <p className="mt-3 font-serif text-[46px] lg:text-[58px] leading-none text-white">
          {stats ? money(stats.revenue) : "—"}
        </p>

        <div className="mt-6 w-10 h-[2px] bg-[#b88e4b]" />
      </div>

      {/* ---------------- COUNTS ---------------- */}

      <div className="mt-px grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#ebdec8]">
        {CARDS.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group bg-white px-7 py-8 hover:bg-[#FBF7F1] transition-colors"
          >
            <div className="flex items-start justify-between">
              <p className="font-serif text-[38px] leading-none text-[#0b2f49]">
                {c.value ?? "—"}
              </p>

              <ArrowUpRight
                className="w-4 h-4 text-[#0b2f49]/20 group-hover:text-[#b88e4b] transition-colors"
                strokeWidth={2}
              />
            </div>

            <p className="mt-4 text-[14px] text-[#0b2f49]/55">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* ---------------- RECENT ORDERS ---------------- */}

      <div className="mt-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-serif text-[24px] text-[#0b2f49]">
            Latest orders
          </h2>

          <Link
            href="/admin/orders"
            className="text-[14px] text-[#0b2f49]/55 hover:text-[#b88e4b] transition-colors"
          >
            See all
          </Link>
        </div>

        <div className="bg-white border border-[#ebdec8]">
          {recent.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <p className="font-serif text-[20px] text-[#0b2f49]/40">
                No orders yet
              </p>

              <p className="mt-2 text-[14px] text-[#0b2f49]/40">
                They'll appear here as soon as someone checks out.
              </p>
            </div>
          ) : (
            recent.map((o, i) => (
              <div
                key={o.id}
                className={`flex flex-wrap items-center gap-4 justify-between px-7 py-5 ${
                  i > 0 ? "border-t border-[#ebdec8]" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-[15px] text-[#0b2f49] font-medium truncate">
                    {o.full_name}
                  </p>

                  <p className="text-[13px] text-[#0b2f49]/45 truncate">
                    {o.email}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <StatusPill status={o.payment_status} />

                  <p className="font-serif text-[18px] text-[#0b2f49] w-24 text-right">
                    {money(o.total)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export function StatusPill({ status }) {
  const tones = {
    Pending: "text-[#8a6d1f] bg-[#b88e4b]/15",
    Paid: "text-[#1f5d43] bg-[#1f5d43]/10",
    Shipped: "text-[#0b2f49] bg-[#0b2f49]/10",
    Delivered: "text-[#1f5d43] bg-[#1f5d43]/10",
    Cancelled: "text-[#b4432f] bg-[#b4432f]/10",
  };

  return (
    <span
      className={`px-3 py-1 text-[12px] tracking-wide ${
        tones[status] || "text-[#0b2f49]/60 bg-[#0b2f49]/[0.06]"
      }`}
    >
      {status || "Pending"}
    </span>
  );
}
