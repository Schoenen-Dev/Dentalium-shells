// =====================================================================
//  REPLACE:  app/admin/users/page.js
// =====================================================================

"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { adminFetch } from "@/lib/adminAuth";

export default function MessagesPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await adminFetch("/wp-json/custom/v1/contacts");
      const data = await response.json();

      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const term = search.trim().toLowerCase();

  const visible = term
    ? contacts.filter((c) =>
        [c.name, c.email, c.subject, c.message]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
    : contacts;

  const initials = (name) =>
    (name || "?")
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  return (
    <AdminShell
      title="Messages"
      subtitle="Enquiries sent through the contact form."
      actions={
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages"
          className="w-full sm:w-64 bg-white border border-[#ebdec8] px-4 py-2.5 text-[14px] text-[#0b2f49] outline-none focus:border-[#b88e4b] transition-colors"
        />
      }
    >
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/70 animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-[#ebdec8] px-8 py-20 text-center">
          <p className="font-serif text-[22px] text-[#0b2f49]/40">
            {contacts.length === 0 ? "No messages yet" : "Nothing matches that"}
          </p>

          <p className="mt-2 text-[14px] text-[#0b2f49]/40">
            {contacts.length === 0
              ? "Anything sent through the contact form lands here."
              : "Try a different word."}
          </p>
        </div>
      ) : (
        <div className="grid gap-px bg-[#ebdec8] border border-[#ebdec8] md:grid-cols-2">
          {visible.map((c) => (
            <article key={c.id} className="bg-white p-7">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 bg-[#0b2f49] text-white flex items-center justify-center text-[13px]">
                  {initials(c.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-[#0b2f49]">
                    {c.name}
                  </p>

                  <a
                    href={`mailto:${c.email}`}
                    className="text-[13px] text-[#b88e4b] hover:underline break-all"
                  >
                    {c.email}
                  </a>
                </div>

                <time className="text-[12px] text-[#0b2f49]/35 shrink-0">
                  {new Date(c.created_at).toLocaleDateString()}
                </time>
              </div>

              {c.subject && (
                <p className="mt-5 font-serif text-[19px] text-[#0b2f49] leading-snug">
                  {c.subject}
                </p>
              )}

              <p className="mt-3 text-[15px] leading-relaxed text-[#0b2f49]/65 whitespace-pre-line">
                {c.message}
              </p>

              <a
                href={`mailto:${c.email}?subject=${encodeURIComponent(
                  "Re: " + (c.subject || "Your enquiry"),
                )}`}
                className="inline-block mt-6 border-b border-[#b88e4b] pb-0.5 text-[14px] text-[#0b2f49] hover:text-[#b88e4b] transition-colors"
              >
                Reply
              </a>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
