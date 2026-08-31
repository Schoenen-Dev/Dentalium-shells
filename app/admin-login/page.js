// =====================================================================
//  REPLACE:  app/admin-login/page.js
// =====================================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/adminAuth";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      const data = await login(username, password);

      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] px-4">
      <div className="bg-white w-full max-w-md p-10 shadow-lg rounded-lg">
        <h1 className="text-4xl font-serif text-center mb-8 text-[#0B2C4D]">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-3 rounded"
            autoComplete="username"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded"
            autoComplete="current-password"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#0B2C4D] text-white py-3 rounded hover:bg-[#c9a15d] transition disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
