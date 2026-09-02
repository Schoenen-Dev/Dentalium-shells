// =====================================================================
//  REPLACE:  app/admin-login/page.js
// =====================================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
        setError(data.error || "That username and password don't match.");
      }
    } catch (err) {
      setError("Can't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[5fr_7fr] font-sans">
      {/* ---------------- LEFT: BRAND PANEL ---------------- */}

      <div className="relative hidden lg:flex flex-col justify-between bg-[#0b2f49] p-14 overflow-hidden">
        {/* faint shell arcs - the one decorative flourish */}
        <svg
          className="absolute -right-24 top-1/2 -translate-y-1/2 w-[440px] h-[440px] opacity-[0.07]"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          {[...Array(9)].map((_, i) => (
            <path
              key={i}
              d={`M ${20 + i * 9} 20 Q ${100 + i * 4} 100 ${20 + i * 9} 180`}
              stroke="#b88e4b"
              strokeWidth="1.5"
              fill="none"
            />
          ))}
        </svg>

        <Link
          href="/"
          className="relative font-serif text-2xl text-white tracking-wide"
        >
          Dentalium <span className="text-[#b88e4b] italic">Shells</span>
        </Link>

        <div className="relative max-w-sm">
          <div className="w-10 h-[2px] bg-[#b88e4b] mb-7" />

          <h2 className="font-serif text-[38px] leading-[1.15] text-white">
            Everything behind the shop, in one place.
          </h2>

          <p className="mt-5 text-[15px] leading-relaxed text-white/45">
            Add pieces to the collection, follow orders through to delivery,
            and read what customers have written in.
          </p>
        </div>

        <div className="relative text-[13px] text-white/30">
          Kanyakumari, India
        </div>
      </div>

      {/* ---------------- RIGHT: FORM ---------------- */}

      <div className="relative flex flex-col bg-[#FBF7F1] px-6 sm:px-10 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] text-[#0b2f49]/55 hover:text-[#0b2f49] transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          Back to the shop
        </Link>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[380px] py-12">
            {/* brand shows on mobile, where the left panel is hidden */}
            <div className="lg:hidden font-serif text-xl text-[#0b2f49] mb-10">
              Dentalium <span className="text-[#b88e4b] italic">Shells</span>
            </div>

            <h1 className="font-serif text-[34px] text-[#0b2f49] leading-tight">
              Sign in
            </h1>

            <p className="mt-2 text-[15px] text-[#0b2f49]/50">
              Store admin access only.
            </p>

            <form onSubmit={handleLogin} className="mt-10 space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-[13px] font-medium text-[#0b2f49]/70 mb-2"
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full bg-transparent border-b border-[#0b2f49]/20 pb-2.5 text-[16px] text-[#0b2f49] outline-none transition-colors focus:border-[#b88e4b]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[13px] font-medium text-[#0b2f49]/70 mb-2"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent border-b border-[#0b2f49]/20 pb-2.5 text-[16px] text-[#0b2f49] outline-none transition-colors focus:border-[#b88e4b]"
                />
              </div>

              {error && (
                <div className="border-l-2 border-[#b4432f] bg-[#b4432f]/[0.06] px-4 py-3">
                  <p className="text-[14px] text-[#b4432f]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[#0b2f49] text-white text-[15px] py-4 transition-colors hover:bg-[#b88e4b] disabled:opacity-50 disabled:hover:bg-[#0b2f49]"
              >
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-[13px] leading-relaxed text-[#0b2f49]/40">
              Forgot the password? It can only be reset from the server — there
              is no email recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
