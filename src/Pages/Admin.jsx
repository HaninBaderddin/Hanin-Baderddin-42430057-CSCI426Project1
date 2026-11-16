
import { useEffect, useState } from "react";

import {
    Trash2,
    ChevronDown,
    ChevronUp,
    Pencil
} from "lucide-react";

import {
    FEEDBACK_STORAGE_KEY,
    getFeedback
} from "./Feedback";

import {
    getStoredOrders,
    removeStoredOrder,
    updateStoredOrder
} from "../Data/orderStorage";

import ADMIN_USERS from "../Data/adminAccess";

const ORDER_STATUSES = [
    "Pending",
    "Accepted",
    "Preparing",
    "Ready",
    "Completed"
];

const ADMIN_STORAGE_KEY = "salt_admin_users";

// Reusable delete button
const DeleteButton = ({ label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8eeee] text-red-500 hover:bg-[#f3dede]"
    >
        <Trash2 size={16} />
    </button>
);

export const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);

    // Load admin accounts
    const [adminUsers, setAdminUsers] = useState(() => {
        const savedUsers = localStorage.getItem(
            ADMIN_STORAGE_KEY
        );

        return savedUsers
            ? JSON.parse(savedUsers)
            : ADMIN_USERS;
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState("");
    const [editedPassword, setEditedPassword] = useState("");
    const [accountError, setAccountError] = useState("");

    const adminName = sessionStorage.getItem(
        "salt-admin-name"
    );

    const loggedInUsername = sessionStorage.getItem(
        "salt-admin-username"
    );

    // Find the currently logged-in admin
    const currentAdmin = adminUsers.find(
        (admin) =>
            admin.username === loggedInUsername ||
            admin.fullName === adminName
    );

    // Load orders and feedback
    useEffect(() => {
        const loadData = () => {
            setOrders(getStoredOrders());
            setFeedback(getFeedback());
        };

        loadData();

        window.addEventListener("ordersUpdated", loadData);
        window.addEventListener("storage", loadData);

        return () => {
            window.removeEventListener(
                "ordersUpdated",
                loadData
            );

            window.removeEventListener(
                "storage",
                loadData
            );
        };
    }, []);

    // Separate active and completed orders
    const activeOrders = orders.filter(
        (order) => order.status !== "Completed"
    );

    const completedOrders = orders.filter(
        (order) => order.status === "Completed"
    );

    // Start editing the admin account
    const editAccount = () => {
        setEditedUsername(currentAdmin.username);
        setEditedPassword(currentAdmin.password);
        setAccountError("");
        setIsEditing(true);
    };

    // Save the updated account
    const saveAccount = () => {
        if (
            !editedUsername.trim() ||
            !editedPassword.trim()
        ) {
            setAccountError(
                "Please fill in both fields."
            );
            return;
        }

        const usernameExists = adminUsers.some(
            (admin) =>
                admin.username === editedUsername.trim() &&
                admin.id !== currentAdmin.id
        );

        if (usernameExists) {
            setAccountError(
                "This username is already used."
            );
            return;
        }

        const updatedUsers = adminUsers.map((admin) => {
            if (admin.id === currentAdmin.id) {
                return {
                    ...admin,
                    username: editedUsername.trim(),
                    password: editedPassword.trim()
                };
            }

            return admin;
        });

        setAdminUsers(updatedUsers);

        localStorage.setItem(
            ADMIN_STORAGE_KEY,
            JSON.stringify(updatedUsers)
        );

        sessionStorage.setItem(
            "salt-admin-username",
            editedUsername.trim()
        );

        setIsEditing(false);
        setAccountError("");
    };

    // Delete an order
    const deleteOrder = (id) => {
        removeStoredOrder(id);

        setOrders(
            orders.filter((order) => order.id !== id)
        );
    };

    // Change an order's status
    const changeOrderStatus = (id, status) => {
        updateStoredOrder(id, { status });

        setOrders(
            orders.map((order) =>
                order.id === id
                    ? { ...order, status }
                    : order
            )
        );
    };

    // Delete customer feedback
    const deleteFeedback = (id) => {
        const updatedFeedback = feedback.filter(
            (item) => item.id !== id
        );

        localStorage.setItem(
            FEEDBACK_STORAGE_KEY,
            JSON.stringify(updatedFeedback)
        );

        setFeedback(updatedFeedback);
    };

    // Display orders in a table
    const renderOrdersTable = (orderList) => (
        <div className="w-full overflow-x-auto rounded-2xl border border-[#073f7020] bg-white shadow-[0_8px_20px_rgb(7_63_112_/_8%)]">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f8f6ef] text-[#074d86]">
                    <tr>
                        <th className="px-4 py-4">
                            Customer
                        </th>

                        <th className="px-4 py-4">
                            Order
                        </th>

                        <th className="px-4 py-4">
                            Type & Location
                        </th>

                        <th className="px-4 py-4">
                            Status
                        </th>

                        <th className="px-4 py-4">
                            Details
                        </th>

                        <th className="px-4 py-4">
                            Total
                        </th>

                        <th className="px-4 py-4"></th>
                    </tr>
                </thead>

                <tbody>
                    {orderList.map((order) => (
                        <tr
                            key={order.id}
                            className="border-t border-[#073f7015] align-top text-[#30678d]"
                        >
                            <td className="px-4 py-4">
                                <p className="font-semibold text-[#074d86]">
                                    {order.customerName}
                                </p>

                                <p className="mt-1 text-xs">
                                    {order.phone}
                                </p>
                            </td>

                            <td className="max-w-xs px-4 py-4 text-xs">
                                {(order.items || [])
                                    .map(
                                        (item) =>
                                            `${item.quantity}× ${item.name}`
                                    )
                                    .join(", ")}
                            </td>

                            <td className="px-4 py-4">
                                <p className="font-semibold">
                                    {order.orderType}
                                </p>

                                {order.deliveryLocation && (
                                    <p className="mt-1 text-xs">
                                        {order.deliveryLocation}
                                    </p>
                                )}
                            </td>

                            <td className="px-4 py-4">
                                <select
                                    value={order.status || "Pending"}
                                    onChange={(event) =>
                                        changeOrderStatus(
                                            order.id,
                                            event.target.value
                                        )
                                    }
                                    className="rounded-lg border border-[#073f7020] bg-white px-3 py-2 text-sm text-[#074d86]"
                                >
                                    {ORDER_STATUSES.map(
                                        (status) => (
                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </option>
                                        )
                                    )}
                                </select>
                            </td>

                            <td className="max-w-xs px-4 py-4 text-xs">
                                {[
                                    order.details,
                                    order.additionalDetails
                                ]
                                    .filter(Boolean)
                                    .join(" — ") || "—"}
                            </td>

                            <td className="px-4 py-4 font-semibold text-[#074d86]">
                                ${Number(order.total).toFixed(2)}
                            </td>

                            <td className="px-4 py-4">
                                <DeleteButton
                                    label="Delete order"
                                    onClick={() =>
                                        deleteOrder(order.id)
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fffdf8] px-4 py-10 sm:px-8">
            <div className="mx-auto w-full max-w-7xl">

                {/* Dashboard Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#074d86]">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-[#4780a0]">
                        Manage saved orders and customer feedback.
                    </p>
                </div>

                {/* Admin Information */}
                {currentAdmin && (
                    <section className="mb-12 w-full">
                        <h2 className="text-xl font-bold text-[#074d86]">
                            Admin Information
                        </h2>

                        <p className="mt-1 text-sm text-[#4780a0]">
                            View and manage your account details.
                        </p>

                        <div className="mt-4 w-full overflow-x-auto rounded-2xl border border-[#073f7020] bg-white shadow-[0_8px_20px_rgb(7_63_112_/_8%)]">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#f8f6ef] text-[#074d86]">
                                    <tr>
                                        <th className="px-4 py-4">
                                            Full Name
                                        </th>

                                        <th className="px-4 py-4">
                                            Username
                                        </th>

                                        <th className="px-4 py-4">
                                            Password
                                        </th>

                                        <th className="px-4 py-4">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className="border-t border-[#073f7015] text-[#30678d]">
                                        <td className="px-4 py-4 font-semibold text-[#074d86]">
                                            {currentAdmin.fullName}
                                        </td>

                                        <td className="px-4 py-4">
                                            {isEditing ? (
                                                <input
                                                    value={editedUsername}
                                                    onChange={(event) =>
                                                        setEditedUsername(
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full min-w-24 rounded-lg border border-[#073f7020] px-3 py-2 outline-none focus:border-[#073f70]"
                                                />
                                            ) : (
                                                currentAdmin.username
                                            )}
                                        </td>

                                        <td className="px-4 py-4">
                                            {isEditing ? (
                                                <input
                                                    value={editedPassword}
                                                    onChange={(event) =>
                                                        setEditedPassword(
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full min-w-24 rounded-lg border border-[#073f7020] px-3 py-2 outline-none focus:border-[#073f70]"
                                                />
                                            ) : (
                                                currentAdmin.password
                                            )}
                                        </td>

                                        <td className="px-4 py-4">
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={saveAccount}
                                                        className="rounded-lg bg-[#073f70] px-3 py-2 text-xs text-white hover:bg-[#074d86]"
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            setIsEditing(false)
                                                        }
                                                        className="rounded-lg bg-[#f8eeee] px-3 py-2 text-xs text-red-500 hover:bg-[#f3dede]"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={editAccount}
                                                    className="flex items-center gap-2 rounded-lg bg-[#f8f6ef] px-3 py-2 text-xs font-semibold text-[#074d86] hover:bg-[#e7f0ee]"
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {accountError && (
                            <p className="mt-2 text-sm text-red-500">
                                {accountError}
                            </p>
                        )}
                    </section>
                )}

                {/* Orders */}
                <section className="w-full">
                    <h2 className="text-xl font-bold text-[#074d86]">
                        Orders
                    </h2>

                    <p className="mt-1 text-sm text-[#4780a0]">
                        Manage and track customer orders.
                    </p>

                    {/* Active Orders */}
                    <div className="mt-6">
                        <h3 className="mb-3 text-lg font-semibold text-[#30678d]">
                            Active Orders ({activeOrders.length})
                        </h3>

                        {activeOrders.length === 0 ? (
                            <p className="w-full rounded-2xl border border-[#073f7020] p-8 text-center text-sm text-[#4780a0]">
                                No active orders.
                            </p>
                        ) : (
                            renderOrdersTable(activeOrders)
                        )}
                    </div>

                    {/* Completed Orders */}
                    <div className="mt-6 w-full">
                        <button
                            type="button"
                            onClick={() =>
                                setShowCompleted(!showCompleted)
                            }
                            className="flex w-full items-center justify-between rounded-xl border border-[#073f7020] bg-[#f8f6ef] px-5 py-4 text-left hover:bg-[#e7f0ee]"
                        >
                            <span className="font-semibold text-[#074d86]">
                                Completed Orders ({completedOrders.length})
                            </span>

                            {showCompleted ? (
                                <ChevronUp size={20} />
                            ) : (
                                <ChevronDown size={20} />
                            )}
                        </button>

                        {showCompleted && (
                            <div className="mt-4 w-full">
                                {completedOrders.length === 0 ? (
                                    <p className="rounded-2xl border border-[#073f7020] p-8 text-center text-sm text-[#4780a0]">
                                        No completed orders yet.
                                    </p>
                                ) : (
                                    renderOrdersTable(completedOrders)
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Customer Feedback */}
                <section className="mt-12 w-full">
                    <h2 className="text-xl font-bold text-[#074d86]">
                        Customer Feedback
                    </h2>

                    <p className="mt-1 text-sm text-[#4780a0]">
                        Feedback submitted through this browser.
                    </p>

                    {feedback.length === 0 ? (
                        <p className="mt-4 w-full rounded-2xl border border-[#073f7020] p-10 text-center text-sm text-[#4780a0]">
                            No customer feedback has been submitted yet.
                        </p>
                    ) : (
                        <div className="mt-4 w-full overflow-x-auto rounded-2xl border border-[#073f7020] bg-white shadow-[0_8px_20px_rgb(7_63_112_/_8%)]">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-[#f8f6ef] text-[#074d86]">
                                    <tr>
                                        <th className="px-4 py-4">
                                            Name
                                        </th>

                                        <th className="px-4 py-4">
                                            Comment
                                        </th>

                                        <th className="px-4 py-4">
                                            Submitted
                                        </th>

                                        <th className="px-4 py-4"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {feedback.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-t border-[#073f7015] align-top text-[#30678d]"
                                        >
                                            <td className="px-4 py-4 font-semibold text-[#074d86]">
                                                {item.name}
                                            </td>

                                            <td className="max-w-xl whitespace-pre-wrap px-4 py-4">
                                                {item.comment}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-xs">
                                                {new Date(
                                                    item.submittedAt
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="px-4 py-4">
                                                <DeleteButton
                                                    label="Delete feedback"
                                                    onClick={() =>
                                                        deleteFeedback(
                                                            item.id
                                                        )
                                                    }
                                                />
                                            </td>
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
