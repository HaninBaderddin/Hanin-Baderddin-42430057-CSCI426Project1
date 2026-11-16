
import {
    Banknote,
    ShoppingBag,
    Truck,
    Utensils,
    Heart,
    Fish
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fffdf8] px-4 py-10 sm:px-8">

            <div className="mx-auto max-w-6xl">

                {/* Back Button */}
                

                {/* Welcome */}
                <div className="mb-16 rounded-3xl bg-[#e7f0ee] px-6 py-14 text-center sm:px-12">


                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#4780a0]">
                        Welcome to SALT
                    </p>

                    <h1 className="text-4xl font-bold text-[#074d86] sm:text-5xl">
                        A Taste of the Sea
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#30678d] sm:text-base">
                        At SALT, we bring together our love for seafood,
                        delicious flavors, and memorable dining experiences.
                        Discover our menu and enjoy every bite.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="mt-8 rounded-full bg-[#073f70] px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#074d86] active:scale-95"
                    >
                        Explore Our Menu
                    </button>

                </div>

                {/* Our Story */}
                <div className="mb-16 grid items-center gap-10 md:grid-cols-2">

                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#4780a0]">
                            Get to Know Us
                        </p>

                        <h2 className="text-3xl font-bold text-[#074d86]">
                            Our Story
                        </h2>

                        <p className="mt-5 text-sm leading-8 text-[#30678d]">
                            SALT was created around one simple idea:
                            good food brings people together. Inspired by
                            the flavors of the sea, our restaurant offers
                            a selection of seafood dishes designed to make
                            every meal enjoyable.
                        </p>

                        <p className="mt-4 text-sm leading-8 text-[#30678d]">
                            Whether you are ordering at home, picking up
                            your meal, or dining in, we want your experience
                            with SALT to be easy, welcoming, and delicious.
                        </p>
                    </div>

                    <div className="flex min-h-64 items-center justify-center rounded-3xl bg-[#f8f6ef] p-10">

                        <div className="text-center">
                            <Fish
                                size={85}
                                strokeWidth={1.1}
                                className="mx-auto text-[#073f70]"
                            />

                            <p className="mt-5 text-xl font-bold tracking-widest text-[#074d86]">
                                FRESH. SIMPLE. DELICIOUS.
                            </p>
                        </div>

                    </div>

                </div>

                {/* What Makes SALT Special */}
                <div className="mb-16">

                    <div className="mb-9 text-center">
                        <h2 className="text-3xl font-bold text-[#074d86]">
                            What Makes SALT Special?
                        </h2>

                        <p className="mt-3 text-sm text-[#4780a0]">
                            The values behind every experience.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">

                        <div className="rounded-2xl border border-[#073f7015] bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f0ee] text-[#073f70]">
                                <Fish size={25} strokeWidth={1.7} />
                            </div>

                            <h3 className="text-lg font-bold text-[#074d86]">
                                Fresh Seafood
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-[#4780a0]">
                                We celebrate the taste of the sea with a
                                selection of delicious seafood dishes.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#073f7015] bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f0ee] text-[#073f70]">
                                <Utensils size={25} strokeWidth={1.7} />
                            </div>

                            <h3 className="text-lg font-bold text-[#074d86]">
                                Made with Care
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-[#4780a0]">
                                Every dish is prepared with attention to
                                detail and a passion for good food.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#073f7015] bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f0ee] text-[#073f70]">
                                <Heart size={25} strokeWidth={1.7} />
                            </div>

                            <h3 className="text-lg font-bold text-[#074d86]">
                                Made for You
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-[#4780a0]">
                                We aim to make every dining experience
                                simple, enjoyable, and memorable.
                            </p>
                        </div>

                    </div>

                </div>

                {/* Ordering Options */}
                <div className="mb-16 rounded-3xl bg-[#f8f6ef] px-6 py-12 sm:px-10">

                    <div className="mb-9 text-center">
                        <h2 className="text-3xl font-bold text-[#074d86]">
                            Enjoy SALT Your Way
                        </h2>

                        <p className="mt-3 text-sm text-[#4780a0]">
                            Choose the ordering option that works best for you.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">

                        <div className="rounded-2xl bg-white p-6 text-center">
                            <Truck
                                size={30}
                                className="mx-auto text-[#073f70]"
                                strokeWidth={1.7}
                            />

                            <h3 className="mt-4 font-bold text-[#074d86]">
                                Delivery
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#4780a0]">
                                Enjoy your favorite dishes from the comfort
                                of your home.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-6 text-center">
                            <ShoppingBag
                                size={30}
                                className="mx-auto text-[#073f70]"
                                strokeWidth={1.7}
                            />

                            <h3 className="mt-4 font-bold text-[#074d86]">
                                Pickup
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#4780a0]">
                                Place your order online and collect it
                                when it is ready.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-6 text-center">
                            <Utensils
                                size={30}
                                className="mx-auto text-[#073f70]"
                                strokeWidth={1.7}
                            />

                            <h3 className="mt-4 font-bold text-[#074d86]">
                                Dine In
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#4780a0]">
                                Visit us and enjoy your meal at the restaurant.
                            </p>
                        </div>

                    </div>

                </div>

                {/* Payment */}
                <div className="mb-10 text-center">

                    <div className="mb-4 flex justify-center">
                        <Banknote
                            size={34}
                            className="text-[#073f70]"
                            strokeWidth={1.6}
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-[#074d86]">
                        Simple and Easy Payments
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#4780a0]">
                        For your convenience, all orders are paid in cash.
                        Enjoy a simple ordering experience from start to finish.
                    </p>

                </div>

                {/* Final Message */}
                <div className="rounded-3xl bg-[#073f70] px-6 py-12 text-center">

                    <h2 className="text-3xl font-bold text-white">
                        Ready to Explore Our Menu?
                    </h2>

                    <p className="mt-3 text-sm text-white/75">
                        Discover your next favorite dish at SALT.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="mt-7 rounded-full bg-[#fffdf8] px-8 py-3 text-sm font-semibold text-[#073f70] transition hover:bg-[#e7f0ee] active:scale-95"
                    >
                        View Our Menu
                    </button>

                </div>

            </div>

        </div>
    );
};
