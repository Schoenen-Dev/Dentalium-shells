"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");

    if (!isLoggedIn) {
      router.push("/admin-login");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* TOP BAR */}
      <div className="bg-[#0B2C4D] text-white px-10 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-serif">Admin Dashboard</h1>

        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 p-10">
        {/* ADD PRODUCT */}
        <div
          onClick={() => (window.location.href = "/admin/add-product")}
          className="bg-white p-8 rounded shadow hover:shadow-xl transition cursor-pointer"
        >
          <h2 className="text-2xl font-semibold text-[#0B2C4D] mb-2">
            Add Product
          </h2>

          <p className="text-gray-600">Add and manage products.</p>
        </div>

        {/* PRODUCT DETAILS */}
        <div
          onClick={() => (window.location.href = "/admin/products")}
          className="bg-white p-8 rounded shadow hover:shadow-xl transition cursor-pointer"
        >
          <h2 className="text-2xl font-semibold text-[#0B2C4D] mb-2">
            Product Details
          </h2>

          <p className="text-gray-600">View all added products.</p>
        </div>


        {/* Orders Details */}
        <Link href="/admin/orders">
          <div className="bg-white shadow-md rounded-lg p-10 hover:shadow-xl transition cursor-pointer">
            <h2 className="text-2xl font-bold text-[#0b2c4d] mb-4">Orders</h2>

            <p className="text-gray-600">View customer orders.</p>
          </div>
        </Link>

        {/* USER DETAILS */}
        <div
          onClick={() => (window.location.href = "/admin/users")}
          className="bg-white p-8 rounded shadow hover:shadow-xl transition cursor-pointer"
        >
          <h2 className="text-2xl font-semibold text-[#0B2C4D] mb-2">
            User Details
          </h2>

          <p className="text-gray-600">View contact form submissions.</p>
        </div>

        {/* PAYMENT DETAILS */}
        <div className="bg-white p-8 rounded shadow hover:shadow-xl transition cursor-pointer">
          <h2 className="text-2xl font-semibold text-[#0B2C4D] mb-2">
            Payment Details
          </h2>

          <p className="text-gray-600">View payment history.</p>
        </div>

        {/* SETTINGS */}
        <div
          onClick={() => (window.location.href = "/admin/settings")}
          className="bg-white p-8 rounded shadow hover:shadow-xl transition cursor-pointer"
        >
          <h2 className="text-2xl font-semibold text-[#0B2C4D] mb-2">
            Settings
          </h2>

          <p className="text-gray-600">Change admin password.</p>
        </div>
      </div>
    </div>
  );
}
