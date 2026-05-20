"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://backend.dentaliumshells.com/wp-json/custom/v1/orders",
      );

      const data = await response.json();

      setOrders(data);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `https://backend.dentaliumshells.com/wp-json/custom/v1/orders/${id}`,

        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            payment_status: status,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === id
              ? {
                  ...order,
                  payment_status: status,
                }
              : order,
          ),
        );
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#f8f5f0]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-[#0b2c4d]">Orders</h1>

        <button
          onClick={() => window.history.back()}
          className="bg-[#0b2c4d] text-white px-5 py-2 rounded"
        >
          Back
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">No orders found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0b2c4d] text-white">
                <th className="p-3 text-left">ID</th>

                <th className="p-3 text-left">Customer</th>

                <th className="p-3 text-left">Email</th>

                <th className="p-3 text-left">Address</th>

                <th className="p-3 text-left">Products</th>

                <th className="p-3 text-left">Subtotal</th>

                <th className="p-3 text-left">Shipping</th>

                <th className="p-3 text-left">Total</th>

                <th className="p-3 text-left">Status</th>

                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                let items = [];

                try {
                  items = JSON.parse(order.items);
                } catch (e) {}

                return (
                  <tr
                    key={order.id}
                    className="border-b align-top hover:bg-gray-50"
                  >
                    <td className="p-3">{order.id}</td>

                    <td className="p-3 font-medium">{order.full_name}</td>

                    <td className="p-3">{order.email}</td>

                    <td className="p-3 text-sm">
                      <div>{order.address}</div>

                      <div>
                        {order.city}, {order.zip}
                      </div>

                      <div>{order.country}</div>
                    </td>

                    <td className="p-3">
                      <div className="space-y-3">
                        {items.map((item, index) => (
                          <div key={index} className="flex gap-3">
                            <img
                              src={item.image}
                              alt=""
                              className="w-14 h-14 object-cover rounded"
                            />

                            <div>
                              <div className="font-medium">{item.name}</div>

                              <div className="text-sm text-gray-500">
                                Qty: {item.qty}
                              </div>

                              <div className="text-sm text-gray-500">
                                ${item.price}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-3">${order.subtotal}</td>

                    <td className="p-3">${order.shipping}</td>

                    <td className="p-3 font-bold text-[#0b2c4d]">
                      ${order.total}
                    </td>

                    <td className="p-3">
                      <select
                        value={order.payment_status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border px-3 py-2 rounded bg-white"
                      >
                        <option value="pending">Pending</option>

                        <option value="paid">Paid</option>

                        <option value="shipped">Shipped</option>

                        <option value="delivered">Delivered</option>

                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-3 text-sm">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
