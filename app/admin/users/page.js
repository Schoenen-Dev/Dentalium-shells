// =====================================================================
//  REPLACE:  app/admin/users/page.js
//  Changes: session guard + adminFetch (contacts are now private)
// =====================================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifySession, adminFetch } from "@/lib/adminAuth";

export default function UserDetails() {
  const router = useRouter();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    verifySession().then((ok) => {
      if (!ok) {
        router.replace("/admin-login");
      } else {
        setChecking(false);
        fetchContacts();
      }
    });
  }, [router]);

  const fetchContacts = async () => {
    try {
      const response = await adminFetch("/wp-json/custom/v1/contacts");
      const data = await response.json();

      setContacts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-serif text-[#0B2C4D]">User Details</h1>

        <button
          onClick={() => router.push("/admin")}
          className="bg-[#0B2C4D] text-white px-5 py-2 rounded"
        >
          Back
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-[#0B2C4D] text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Subject</th>
              <th className="p-4 text-left">Message</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-10 text-center">
                  Loading...
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-10 text-center">
                  No contact submissions found
                </td>
              </tr>
            ) : (
              contacts.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{item.id}</td>

                  <td className="p-4 font-medium">{item.name}</td>

                  <td className="p-4">{item.email}</td>

                  <td className="p-4">{item.subject}</td>

                  <td className="p-4 max-w-md break-words">{item.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
