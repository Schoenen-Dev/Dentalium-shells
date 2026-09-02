// =====================================================================
//  REPLACE:  app/admin/settings/page.js
// =====================================================================

"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import { adminFetch } from "@/lib/adminAuth";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    if (newPassword.length < 8) {
      setIsError(true);
      setMessage("Use at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("The two new passwords don't match.");
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
        setMessage("Password changed. Every other device has been signed out.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setIsError(true);
        setMessage(data.error || "Couldn't change the password.");
      }
    } catch (err) {
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
      title="Settings"
      subtitle="Your sign-in details."
    >
      <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-14">
        <form
          onSubmit={handleChangePassword}
          className="bg-white border border-[#ebdec8] p-8 lg:p-10"
        >
          <h2 className="font-serif text-[22px] text-[#0b2f49]">
            Change password
          </h2>

          <div className="mt-8 space-y-7">
            <div>
              <label htmlFor="current" className={label}>
                Current password
              </label>

              <input
                id="current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={field}
              />
            </div>

            <div>
              <label htmlFor="next" className={label}>
                New password
              </label>

              <input
                id="next"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                className={field}
              />

              <p className="mt-2 text-[13px] text-[#0b2f49]/40">
                At least 8 characters.
              </p>
            </div>

            <div>
              <label htmlFor="confirm" className={label}>
                Repeat new password
              </label>

              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className={field}
              />
            </div>

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
              className="w-full bg-[#0b2f49] text-white text-[15px] py-4 hover:bg-[#b88e4b] transition-colors disabled:opacity-50 disabled:hover:bg-[#0b2f49]"
            >
              {busy ? "Saving…" : "Change password"}
            </button>
          </div>
        </form>

        <div className="max-w-md">
          <h2 className="font-serif text-[22px] text-[#0b2f49]">
            How your account works
          </h2>

          <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-[#0b2f49]/60">
            <p>
              Signing in gives your browser a key that lasts 12 hours. After
              that you'll be asked for your password again.
            </p>

            <p>
              Changing your password signs out every other browser and phone
              straight away. Use this if you think someone else has your
              details.
            </p>

            <p>
              Ten wrong passwords in a row locks sign-in from that location for
              five minutes.
            </p>

            <p>
              There's no email recovery. If you lose the password it has to be
              reset from the server.
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
