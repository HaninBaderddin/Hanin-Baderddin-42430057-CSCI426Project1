import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { FEEDBACK_STORAGE_KEY, getFeedback } from "./Feedback";
import { getStoredOrders, removeStoredOrder, updateStoredOrder } from "../Data/orderStorage";

const API_URL = "http://localhost:5002";
const ORDER_STATUSES = ["Pending", "Accepted", "Preparing", "Ready", "Completed"];

const DeleteButton = ({ label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8eeee] text-red-500 transition hover:bg-[#f3dede]"
    >
        <Trash2 size={16} />
    </button>
);

export const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [error, setError] = useState("");

    const loadOrders = async () => {
        const localOrders = getStoredOrders();

        try {
            const response = await fetch(`${API_URL}/orders`);

            if (!response.ok) {
                throw new Error("Unable to load orders.");
            }

            const serverOrders = await response.json();
            const allOrders = [...serverOrders, ...localOrders.filter((localOrder) => !serverOrders.some((order) => order.id === localOrder.id))];
            setOrders(allOrders);
        } catch {
            setOrders(localOrders);
        }
    };

    useEffect(() => {
        loadOrders();
        setFeedback(getFeedback());
    }, []);

    const deleteOrder = async (id) => {
        removeStoredOrder(id);
        setOrders((currentOrders) => currentOrders.filter((order) => order.id !== id));

        try {
            const response = await fetch(`${API_URL}/orders/${encodeURIComponent(id)}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("Unable to delete order.");
            }

        } catch {}
    };

    const deleteFeedback = (id) => {
        const updatedFeedback = feedback.filter((item) => item.id !== id);
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
        setFeedback(updatedFeedback);
    };

    const updateOrderStatus = async (id, status) => {
        updateStoredOrder(id, { status });
        setOrders((currentOrders) => currentOrders.map((order) => (
            order.id === id ? { ...order, status } : order
        )));

        try {
            await fetch(`${API_URL}/orders/${encodeURIComponent(id)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
        } catch {}
    };

    return (
        <div className="min-h-screen bg-[#fffdf8] px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#074d86]">Admin Dashboard</h1>
                    <p className="mt-2 text-sm text-[#4780a0]">Manage saved orders and customer feedback.</p>
                </div>

                {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">{error}</p>}

                <section>
                    <h2 className="text-xl font-bold text-[#074d86]">Orders</h2>
                    <p className="mt-1 text-sm text-[#4780a0]">Saved orders from your local order file.</p>

                    {orders.length === 0 ? (
                        <p className="mt-4 rounded-2xl border border-[#073f7020] p-10 text-center text-sm text-[#4780a0]">No orders have been placed yet.</p>
                    ) : (
                        <div className="mt-4 overflow-x-auto rounded-2xl border border-[#073f7020] bg-white shadow-[0_8px_20px_rgb(7_63_112_/_8%)]">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-[#f8f6ef] text-[#074d86]">
                                    <tr>
                                        <th className="px-4 py-4 font-bold">Customer</th>
                                        <th className="px-4 py-4 font-bold">Order</th>
                                        <th className="px-4 py-4 font-bold">Type & Location</th>
                                        <th className="px-4 py-4 font-bold">Status</th>
                                        <th className="px-4 py-4 font-bold">Details</th>
                                        <th className="px-4 py-4 font-bold">Total</th>
                                        <th className="px-4 py-4"><span className="sr-only">Delete</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-t border-[#073f7015] align-top text-[#30678d]">
                                            <td className="px-4 py-4"><p className="font-semibold text-[#074d86]">{order.customerName}</p><p className="mt-1 text-xs">{order.phone}</p></td>
                                            <td className="max-w-xs px-4 py-4 text-xs leading-relaxed">{order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}</td>
                                            <td className="px-4 py-4"><p className="font-semibold">{order.orderType}</p>{order.deliveryLocation && <p className="mt-1 text-xs">{order.deliveryLocation}</p>}</td>
                                            <td className="px-4 py-4"><select value={order.status || "Pending"} onChange={(event) => updateOrderStatus(order.id, event.target.value)} aria-label={`Update status for ${order.customerName}`} className="rounded-lg border border-[#073f7020] bg-white px-3 py-2 text-sm font-semibold text-[#074d86] outline-none focus:border-[#073f70]">{ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                                            <td className="max-w-xs px-4 py-4 text-xs leading-relaxed">{[order.details, order.additionalDetails].filter(Boolean).join(" — ") || "—"}</td>
                                            <td className="px-4 py-4 font-semibold text-[#074d86]">${Number(order.total).toFixed(2)}</td>
                                            <td className="px-4 py-4"><DeleteButton label={`Delete order from ${order.customerName}`} onClick={() => deleteOrder(order.id)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="mt-12">
                    <h2 className="text-xl font-bold text-[#074d86]">Customer Feedback</h2>
                    <p className="mt-1 text-sm text-[#4780a0]">Feedback submitted through this browser.</p>

                    {feedback.length === 0 ? (
                        <p className="mt-4 rounded-2xl border border-[#073f7020] p-10 text-center text-sm text-[#4780a0]">No customer feedback has been submitted yet.</p>
                    ) : (
                        <div className="mt-4 overflow-x-auto rounded-2xl border border-[#073f7020] bg-white shadow-[0_8px_20px_rgb(7_63_112_/_8%)]">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-[#f8f6ef] text-[#074d86]">
                                    <tr><th className="px-4 py-4 font-bold">Name</th><th className="px-4 py-4 font-bold">Comment</th><th className="px-4 py-4 font-bold">Submitted</th><th className="px-4 py-4"><span className="sr-only">Delete</span></th></tr>
                                </thead>
                                <tbody>
                                    {feedback.map((item) => (
                                        <tr key={item.id} className="border-t border-[#073f7015] align-top text-[#30678d]">
                                            <td className="px-4 py-4 font-semibold text-[#074d86]">{item.name}</td>
                                            <td className="max-w-xl whitespace-pre-wrap px-4 py-4 leading-relaxed">{item.comment}</td>
                                            <td className="whitespace-nowrap px-4 py-4 text-xs">{new Date(item.submittedAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-4"><DeleteButton label={`Delete feedback from ${item.name}`} onClick={() => deleteFeedback(item.id)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};
