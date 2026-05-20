"use client";

import { useEffect, useState } from "react";

export default function UserDetails() {
  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(
        "https://backend.dentaliumshells.com/wp-json/custom/v1/contacts",
      );

      const data = await response.json();

      console.log(data);

      setContacts(data);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-serif text-[#0B2C4D]">User Details</h1>

        <button
          onClick={() => window.history.back()}
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
