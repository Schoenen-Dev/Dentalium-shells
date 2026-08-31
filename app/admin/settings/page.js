// =====================================================================
//  REPLACE:  app/admin/settings/page.js
// =====================================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifySession, adminFetch } from "@/lib/adminAuth";

export default function SettingsPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    verifySession().then((ok) => {
      if (!ok) {
        router.replace("/admin-login");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    if (newPassword.length < 8) {
      setIsError(true);
      setMessage("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      return;
    }

    setBusy(true);

    try {
      const res = await adminFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Password changed. Other devices have been logged out.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setIsError(true);
        setMessage(data.error || "Could not change password");
      }
    } catch (err) {
      setIsError(true);
      setMessage("Something went wrong");
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
          autoComplete="current-password"
          required
        />

        <input
          type="password"
          placeholder="New Password (min 8 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-3 rounded"
          autoComplete="new-password"
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-3 rounded"
          autoComplete="new-password"
          required
        />

        {message && (
          <p
            className={
              isError ? "text-red-500 text-sm" : "text-green-600 text-sm"
            }
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="bg-[#0B2C4D] text-white px-6 py-3 rounded disabled:opacity-60"
        >
          {busy ? "Saving..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
