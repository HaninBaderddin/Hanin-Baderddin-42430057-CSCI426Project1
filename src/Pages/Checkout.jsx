
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Banknote,
    CheckCircle2,
    ShoppingBag,
    Truck,
    Utensils
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { saveOrderLocally } from "../Data/orderStorage";

const DELIVERY_FEE = 4;

export default function Checkout() {
    const navigate = useNavigate();

    const {
        cartItems,
        total,
        itemCount,
        clearCart,
        showNotification
    } = useCart();

    const [orderType, setOrderType] = useState("Dine-in");

    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        tableNumber: "",
        deliveryLocation: "",
        details: "",
        additionalDetails: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [placedOrder, setPlacedOrder] = useState(null);

    const deliveryFee =
        orderType === "Delivery" ? DELIVERY_FEE : 0;

    const finalTotal = total + deliveryFee;

    const updateField = (event) => {
        setFormData((previous) => ({
            ...previous,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");

        if (!cartItems.length) {
            return setError("Your cart is empty.");
        }

        if (
            !formData.customerName.trim() ||
            !formData.phone.trim()
        ) {
            return setError(
                "Please enter your name and phone number."
            );
        }

        if (
            orderType === "Dine-in" &&
            !formData.tableNumber.trim()
        ) {
            return setError("Please enter your table number.");
        }

        if (
            orderType === "Delivery" &&
            !formData.deliveryLocation.trim()
        ) {
            return setError(
                "Please enter your delivery location."
            );
        }

        const details = [
            orderType === "Dine-in"
                ? `Table: ${formData.tableNumber.trim()}`
                : "",
            formData.details.trim()
        ]
            .filter(Boolean)
            .join(" • ");

        const orderData = {
            customerName: formData.customerName.trim(),
            phone: formData.phone.trim(),
            orderType,
            deliveryLocation:
                orderType === "Delivery"
                    ? formData.deliveryLocation.trim()
                    : "",
            details,
            additionalDetails:
                formData.additionalDetails.trim(),
            items: cartItems.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: finalTotal,
            status: "Pending"
        };

        try {
            setSubmitting(true);

            const savedOrder = saveOrderLocally(orderData);

            setPlacedOrder(savedOrder);
            clearCart();

            showNotification(
                "Your order was submitted successfully."
            );
        } catch (error) {
            console.error("Error saving order:", error);

            setError(
                "Unable to save your order. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Order Confirmation
    if (placedOrder) {
        return (
            <div className="min-h-[70vh] bg-[#fffdf8] px-5 py-16">
                <div className="mx-auto max-w-md rounded-2xl border border-[#073f7020] bg-[#fffdf8] p-8 text-center shadow-[0_8px_20px_rgb(7_63_112_/_8%)]">

                    <CheckCircle2
                        size={54}
                        className="mx-auto text-emerald-600"
                    />

                    <h1 className="mt-5 text-2xl font-bold text-[#074d86]">
                        Order Placed!
                    </h1>

                    <p className="mt-3 text-sm text-[#4780a0]">
                        Thank you for choosing SALT.
                        Your order has been saved.
                    </p>

                    <p className="mt-3 text-sm font-semibold text-[#073f70]">
                        Order #{placedOrder.id.slice(0, 8)}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="mt-6 w-full rounded-xl bg-[#073f70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0a568f]"
                    >
                        Back to Home
                    </button>

                </div>
            </div>
        );
    }

    // Empty Cart
    if (!cartItems.length) {
        return (
            <div className="min-h-[70vh] bg-[#fffdf8] px-5 py-16 text-center">

                <ShoppingBag
                    size={46}
                    className="mx-auto text-[#4780a0]"
                />

                <h1 className="mt-4 text-2xl font-bold text-[#074d86]">
                    Your Cart Is Empty
                </h1>

                <p className="mt-2 text-sm text-[#4780a0]">
                    Add dishes before you begin checkout.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-6 rounded-xl bg-[#073f70] px-6 py-3 text-sm font-semibold text-white"
                >
                    Explore Our Menu
                </button>

            </div>
        );
    }

    // Checkout Page
    return (
        <div className="min-h-[70vh] bg-[#fffdf8] px-4 py-10 sm:px-8">

            <div className="mx-auto mb-10 max-w-6xl">

                <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="inline-flex items-center gap-2 rounded-full border border-[#073f7020] bg-[#fffdf8] px-5 py-2.5 text-sm font-medium text-[#073f70] transition hover:bg-[#f0ede4]"
                >
                    <ArrowLeft size={17} />
                    Back to cart
                </button>

                <div className="mt-3 text-center">
                    <h1 className="text-3xl font-bold text-[#074d86] sm:text-4xl">
                        Checkout
                    </h1>

                    <p className="mt-2 text-sm text-[#4780a0]">
                        Complete your order and enjoy your SALT experience.
                    </p>
                </div>

            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3"
            >

                {/* Left Section */}
                <div className="space-y-7 lg:col-span-2">

                    {/* Order Type */}
                    <section className="rounded-2xl border border-[#073f7020] bg-[#fffdf8] p-6 shadow-[0_8px_20px_rgb(7_63_112_/_8%)] sm:p-8">

                        <h2 className="text-xl font-bold text-[#074d86]">
                            How would you like your order?
                        </h2>

                        <p className="mt-2 text-sm text-[#4780a0]">
                            Choose your preferred order type.
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">

                            {[
                                {
                                    type: "Dine-in",
                                    icon: Utensils,
                                    text: "Enjoy your meal at SALT"
                                },
                                {
                                    type: "Pickup",
                                    icon: ShoppingBag,
                                    text: "Collect your order"
                                },
                                {
                                    type: "Delivery",
                                    icon: Truck,
                                    text: "Delivered to your door"
                                }
                            ].map(({ type, icon: Icon, text }) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setOrderType(type)}
                                    className={`flex flex-col items-center gap-3 rounded-xl border p-5 transition ${
                                        orderType === type
                                            ? "border-[#073f70] bg-[#073f70] text-white"
                                            : "border-[#073f7020] text-[#073f70] hover:bg-[#f8f6ef]"
                                    }`}
                                >
                                    <Icon size={25} />

                                    <span className="font-semibold">
                                        {type}
                                    </span>

                                    <span
                                        className={`text-xs ${
                                            orderType === type
                                                ? "text-white/80"
                                                : "text-[#4780a0]"
                                        }`}
                                    >
                                        {text}
                                    </span>
                                </button>
                            ))}

                        </div>
                    </section>

                    {/* Customer Information */}
                    <section className="rounded-2xl border border-[#073f7020] bg-[#fffdf8] p-6 shadow-[0_8px_20px_rgb(7_63_112_/_8%)] sm:p-8">

                        <h2 className="text-xl font-bold text-[#074d86]">
                            Customer Information
                        </h2>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            <label className="text-sm font-semibold text-[#30678d]">
                                Full Name

                                <input
                                    required
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={updateField}
                                    placeholder="Your full name"
                                    className="mt-2 w-full rounded-lg border border-[#073f7020] bg-[#fffdf8] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10"
                                />
                            </label>

                            <label className="text-sm font-semibold text-[#30678d]">
                                Phone Number

                                <input
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={updateField}
                                    placeholder="Your phone number"
                                    className="mt-2 w-full rounded-lg border border-[#073f7020] bg-[#fffdf8] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10"
                                />
                            </label>

                            {orderType === "Dine-in" && (
                                <label className="text-sm font-semibold text-[#30678d] sm:col-span-2">
                                    Table Number

                                    <input
                                        required
                                        name="tableNumber"
                                        value={formData.tableNumber}
                                        onChange={updateField}
                                        placeholder="Your table number"
                                        className="mt-2 w-full rounded-lg border border-[#073f7020] bg-[#fffdf8] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10"
                                    />
                                </label>
                            )}

                            {orderType === "Delivery" && (
                                <label className="text-sm font-semibold text-[#30678d] sm:col-span-2">
                                    Delivery Location

                                    <input
                                        required
                                        name="deliveryLocation"
                                        value={formData.deliveryLocation}
                                        onChange={updateField}
                                        placeholder="Street, building, and area"
                                        className="mt-2 w-full rounded-lg border border-[#073f7020] bg-[#fffdf8] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10"
                                    />
                                </label>
                            )}

                            <label className="text-sm font-semibold text-[#30678d] sm:col-span-2">
                                Order Details

                                <input
                                    name="details"
                                    value={formData.details}
                                    onChange={updateField}
                                    placeholder="Preferred pickup time or delivery instructions"
                                    className="mt-2 w-full rounded-lg border border-[#073f7020] bg-[#fffdf8] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10"
                                />
                            </label>

                            <label className="text-sm font-semibold text-[#30678d] sm:col-span-2">
                                Additional Details

                                <textarea
                                    name="additionalDetails"
                                    value={formData.additionalDetails}
                                    onChange={updateField}
                                    rows="4"
                                    placeholder="Allergies, special requests, or anything else"
                                    className="mt-2 w-full resize-y rounded-lg border border-[#073f7020] bg-[#fffdf8] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10"
                                />
                            </label>

                        </div>
                    </section>

                </div>

                {/* Right Section - Order Summary */}
                <aside className="h-fit rounded-2xl border border-[#073f7020] bg-[#fffdf8] p-6 shadow-[0_8px_20px_rgb(7_63_112_/_8%)] lg:sticky lg:top-28">

                    <div className="flex items-center gap-2">

                        <Banknote
                            size={20}
                            className="text-[#074d86]"
                        />

                        <h2 className="text-xl font-bold text-[#074d86]">
                            Order Summary
                        </h2>

                    </div>

                    <p className="mt-2 text-sm text-[#4780a0]">
                        {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                    </p>

                    {/* Cart Items */}
                    <div className="mt-5 max-h-72 space-y-4 overflow-y-auto">

                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3"
                            >
                                <img
                                    src={item.image}
                                    alt=""
                                    className="h-14 w-14 rounded-lg object-cover"
                                />

                                <div className="min-w-0 flex-1">

                                    <p className="truncate text-sm font-semibold text-[#074d86]">
                                        {item.name}
                                    </p>

                                    <p className="text-xs text-[#4780a0]">
                                        Quantity: {item.quantity}
                                    </p>

                                </div>

                                <p className="text-sm font-semibold text-[#074d86]">
                                    ${(Number(item.price) * item.quantity).toFixed(2)}
                                </p>

                            </div>
                        ))}

                    </div>

                    {/* Price Summary */}
                    <div className="mt-6 space-y-3 border-t border-[#073f7015] pt-5 text-sm text-[#4780a0]">

                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Delivery Fee</span>

                            <span>
                                {deliveryFee
                                    ? `$${deliveryFee.toFixed(2)}`
                                    : "Free"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#073f7015] pt-4 text-lg font-bold text-[#074d86]">
                            <span>Total</span>
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>

                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-6 w-full rounded-xl bg-[#073f70] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0a568f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting
                            ? "Placing Order..."
                            : "Place Order"}
                    </button>

                </aside>

            </form>
        </div>
    );
}
