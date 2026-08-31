// =====================================================================
//  REPLACE:  app/admin/page.js
// =====================================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { verifySession, logout } from "@/lib/adminAuth";

export default function AdminDashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // ask the SERVER whether we are logged in, not localStorage
    verifySession().then((ok) => {
      if (!ok) {
        router.replace("/admin-login");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/admin-login");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
        <p className="text-[#0B2C4D]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* TOP BAR */}
      <div className="bg-[#0B2C4D] text-white px-10 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-serif">Admin Dashboard</h1>

        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 p-10">
        {/* ADD PRODUCT */}
        <Link href="/admin/add-product">
          <div className="bg-white p-8 rounded shadow hover:shadow-xl transition cursor-pointer h-full">
            <h2 className="text-2xl font-semibold text-[#0B2C4D] mb-2">
              Add Product
            </h2>

            <p className="text-gray-600">Add and manage products.</p>
          </div>
        </Link>

        {/* PRODUCT DETAILS */}
        <Link href="/admin/products">
          <div className="bg-white p-8 rounded shadow hover:shadow-xl transition cursor-pointer h-full">
            <h2 className="text-2xl font-semibold text-[#0B2C4D] mb-2">
              Product Details
            </h2>

            <p className="text-gray-600">View all added products.</p>
          </div>
        </Link>

        {/* ORDERS */}
        <Link href="/admin/orders">
          <div className="bg-white p-8 rounded shadow hover:shadow-xl transition cursor-pointer h-full">
            <h2 className="text-2xl font-semibold text-[#0B2C4D] mb-2">
              Orders
            </h2>

            <p className="text-gray-600">View customer orders.</p>
          </div>
        </Link>

        {/* USER DETAILS */}
        <Link href="/admin/users">
          <div className="bg-white p-8 rounded shadow hover:shadow-xl transition cursor-pointer h-full">
            <h2 className="text-2xl font-semibold text-[#0B2C4D] mb-2">
              User Details
            </h2>

            <p className="text-gray-600">View contact form submissions.</p>
          </div>
        </Link>

        {/* SETTINGS */}
        <Link href="/admin/settings">
          <div className="bg-white p-8 rounded shadow hover:shadow-xl transition cursor-pointer h-full">
            <h2 className="text-2xl font-semibold text-[#0B2C4D] mb-2">
              Settings
            </h2>

            <p className="text-gray-600">Change admin password.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
