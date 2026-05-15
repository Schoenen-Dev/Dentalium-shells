"use client";

import { useEffect, useState } from "react";

export default function UserDetails() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch(
        "http://dentalium.local/wp-json/custom/v1/contacts",
      );

      const data = await res.json();

      setContacts(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-10">
      <h1 className="text-4xl font-serif text-[#0B2C4D] mb-10">User Details</h1>

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
            {contacts.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-4">{item.id}</td>
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.email}</td>
                <td className="p-4">{item.subject}</td>
                <td className="p-4">{item.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
