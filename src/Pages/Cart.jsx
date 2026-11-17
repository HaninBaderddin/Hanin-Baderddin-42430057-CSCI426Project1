
import { useNavigate } from "react-router-dom";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";

export const Cart = () => {
    const {
        cartItems,
        itemCount,
        total,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart(); //we call all that from cart context

    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] bg-[#fffdf8] px-3 py-10 sm:px-6">
            <div className="mx-auto max-w-[850px]">

                <div className="mb-9 text-center">
                    <h1 className="text-3xl font-bold text-[#074d86]">
                        Your Cart
                    </h1>

                    <p className="mt-2 text-sm text-[#4780a0]">
                        {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                {/* if the length of my cart is 0 it means the cart is empty we display it , else we display the items*/}
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-16 text-center">

                        <ShoppingBag
                            size={45}
                            className="text-[#4780a0]"
                        />

                        <h2 className="text-xl font-bold text-[#074d86]">
                            Your Cart Is Empty
                        </h2>

                        <p className="text-sm text-[#4780a0]">
                            Add some delicious items from our menu.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="rounded-xl border border-[#073f7020] bg-[#f8f6ef] px-5 py-2.5 text-sm font-semibold text-[#30678d] transition hover:bg-[#eee9dc]"
                            >
                                Continue Shopping
                            </button>
                        </div>

                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex justify-end">
                            <button
                                type="button"
                                onClick={clearCart}
                                className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-700"
                            >
                                <Trash2 size={15} />
                                Clear Cart
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl border border-[#073f7020] bg-[#fffdf8] shadow-[0_8px_20px_rgb(7_63_112_/_8%)]"
                                >
                                    <div className="flex items-center gap-4 p-3 sm:gap-5 sm:p-4">

                                        <div className="h-[95px] w-[95px] shrink-0 overflow-hidden rounded-xl sm:h-[115px] sm:w-[115px]">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1 text-left">
                                            <h3 className="text-base font-bold leading-snug text-[#074d86] sm:text-xl">
                                                {item.name}
                                            </h3>

                                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#4780a0] sm:text-sm">
                                                {item.description}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label={`Remove ${item.name}`}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8eeee] text-red-500 transition hover:bg-[#f3dede]"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                    </div>

                                    <div className="flex items-center justify-between border-t border-[#073f7015] bg-[#f8f6ef]/60 px-4 py-3 sm:px-5">

                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-semibold text-[#4780a0]">
                                                Quantity
                                            </span>

                                            <div className="flex items-center gap-2 rounded-lg border border-[#073f7020] bg-[#fffdf8] px-2 py-1">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={item.quantity <= 1}
                                                    aria-label={`Decrease ${item.name} quantity`}
                                                    className="flex h-7 w-7 items-center justify-center rounded-md text-[#073f70] transition hover:bg-[#e7e0d2] disabled:cursor-not-allowed disabled:opacity-30"
                                                >
                                                    <Minus size={14} />
                                                </button>

                                                <span className="min-w-[18px] text-center text-sm font-bold text-[#073f70]">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    aria-label={`Increase ${item.name} quantity`}
                                                    className="flex h-7 w-7 items-center justify-center rounded-md text-[#073f70] transition hover:bg-[#e7e0d2]"
                                                >
                                                    <Plus size={14} />
                                                </button>

                                            </div>
                                        </div>

                                        <p className="text-sm font-bold text-[#074d86]">
                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                        </p>

                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-2xl border border-[#073f7020] bg-[#fffdf8] p-4 shadow-[0_8px_20px_rgb(7_63_112_/_8%)] sm:flex sm:items-center sm:justify-between sm:p-5">

                            <div>
                                <p className="text-xs font-medium text-[#4780a0] sm:text-sm">
                                    Total Price
                                </p>

                                <p className="mt-1 text-xl font-bold text-[#074d86] sm:text-2xl">
                                    ${total.toFixed(2)}
                                </p>
                            </div>

                            <div className="mt-4 flex w-full flex-col gap-3 sm:mt-0 sm:w-auto sm:flex-row">

                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="w-full rounded-xl border border-[#073f7020] bg-[#f8f6ef] px-6 py-3 text-sm font-semibold text-[#30678d] transition hover:bg-[#eee9dc] sm:w-auto"
                                >
                                    Continue Shopping
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/checkout")}
                                    className="w-full rounded-xl bg-[#073f70] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a568f] active:scale-[0.98] sm:w-auto"
                                >
                                    Checkout
                                </button>

                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};
