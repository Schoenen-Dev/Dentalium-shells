"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");

    if (!isLoggedIn) {
      router.push("/admin-login");
    }
  }, []);

  const handleChangePassword = (e) => {
    e.preventDefault();

    const savedPassword = localStorage.getItem("adminPassword") || "123456";

    if (currentPassword !== savedPassword) {
      alert("Current password is incorrect");

      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");

      return;
    }

    localStorage.setItem("adminPassword", newPassword);

    alert("Password changed successfully");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-10">
      <h1 className="text-4xl font-serif text-[#0B2C4D] mb-10">Settings</h1>

      <form
        onSubmit={handleChangePassword}
        className="bg-white max-w-xl p-10 rounded shadow space-y-5"
      >
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-[#0B2C4D] text-white px-6 py-3 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
