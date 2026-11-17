
import { useEffect, useState } from "react";
import { Heart, PackageCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { MenuItemCard } from "../Components/MenuItemCard";
import MenuItems from "../Data/MenuItems";
import { useCart } from "../context/CartContext";
import { getLatestOrder } from "../Data/orderStorage";

export const Home = () => {
    const navigate = useNavigate();
    //to add to cart 
    const { addToCart } = useCart();

    //those are my menu items
    const [menuItems, setMenuItems] = useState([]);

    //initially my data is loading
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    //for the filter
    const [activeCategory, setActiveCategory] = useState("All");

    //we get last order to display the status 
    const [latestOrder, setLatestOrder] = useState(null);

    const categories = ["All", "Main Dishes", "Appetizers", "Dessert", "Drinks"];

    const visibleItems = activeCategory === "All"
        ? menuItems
        : menuItems.filter(
            (item) => item.category === activeCategory
        );

    //we try to fetch the menu items from menuItems and store them in use state 
    // if if fails we add the error to the error state 
    //in both cases we must set loading to false because we are done loading    
    useEffect(() => {
        try {
            setMenuItems(MenuItems);
        } catch (error) {
            console.error("Error loading menu items:", error);
            setError("Unable to load menu items.");
        } finally {
            setLoading(false);
        }
    }, []);

    /* 
    This useEffect is responsible for tracking the latest customer order on the Home Page. 
    When the component first loads, we retrieve the latest order from localStorage and update the state. 
    We also add an event listener that listens for an event called ordersUpdated, which is triggered when an order is modified. 
    Additionally, we use setInterval to check for updates every 1.5 seconds. 
    Finally, the cleanup function removes the event listener and clears the interval when the component unmounts
    */
    useEffect(() => {

        //we created a function loadLatesOrder that etrieves the latest order from browser storage and updates the React state with the retrieved order
        //and we call it --> This ensures that if an order already exists, its information is loaded as soon as the customer opens the Home Page
        const loadLatestOrder = () => {
            setLatestOrder(getLatestOrder());
        };
        loadLatestOrder();

        window.addEventListener(
            "ordersUpdated",
            loadLatestOrder
        );

        const interval = setInterval(
            loadLatestOrder,
            1500
        );

        return () => {
            window.removeEventListener(
                "ordersUpdated",
                loadLatestOrder
            );

            clearInterval(interval);
        };
    }, []);

    //the status and messages that should be displayed in the home , each status have atitle and a description
    const trackingMessages = {
        Accepted: {
            title: "Your order has been accepted!",
            description:
                "Our team has received your order and will start preparing it soon."
        },
        Preparing: {
            title: "Your order is being prepared!",
            description:
                "Our kitchen is preparing your meal. It will be ready soon."
        },
        Ready: {
            title: "Your order is ready!",
            description:
                "Your order is ready. Enjoy your SALT experience!"
        }
    };

    /* 
    This uses the ternary operator, which is a shorter way of writing an if/else statement.
    It checks whether latestOrder exists:
    - If latestOrder exists, it accesses the corresponding message using latestOrder.status.
    - If there is no latest order, it assigns null.
    */
    const trackingInfo = latestOrder
        ? trackingMessages[latestOrder.status]
        : null;

    return (
        <div className="min-h-screen bg-[#fffdf8]">

            {/* Order Tracking Banner */}
            {/*when trackingInfo is not null it means that we have one of the status active and we will show the banner */}
            {trackingInfo && (
                <div className="px-4 pt-5 sm:px-8">
                    <div className="mx-auto flex max-w-7xl items-center gap-4 rounded-2xl border border-[#073f7020] bg-[#e7f0ee] p-5">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#073f70]">
                            <PackageCheck size={25} />
                        </div>

                        <div className="min-w-0 flex-1">

                            <h2 className="font-bold text-[#074d86]">
                                {trackingInfo.title}
                            </h2>

                            <p className="mt-1 text-sm text-[#4780a0]">
                                {trackingInfo.description}
                            </p>

                            <p className="mt-2 text-xs font-semibold text-[#30678d]">
                                Order #{latestOrder.id.slice(0, 8)}
                            </p>

                        </div>

                    </div>
                </div>
            )}

            <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10">

                <div className="relative mb-9 text-center">

                    <button
                        type="button"
                        onClick={() => navigate("/feedback")}
                        aria-label="Leave feedback"
                        className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-[#073f7020] bg-[#f8f6ef] text-[#073f70] transition hover:bg-[#e7f0ee] active:scale-95"
                    >
                        <Heart size={19} strokeWidth={1.8} />
                    </button>

                    <h2 className="text-3xl font-bold text-[#074d86]">
                        Our Menu
                    </h2>

                    <p className="mt-2 text-sm text-[#4780a0]">
                        Explore our selection of dishes.
                    </p>

                </div>

                {/* navigation bar that maps through the categories and the css is diferent for the chosen category */}
                <nav
                    aria-label="Menu categories"
                    className="mb-8 flex flex-wrap justify-center gap-2"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setActiveCategory(category)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === category
                                ? "bg-[#073f70] text-white shadow-sm"
                                : "border border-[#073f7020] bg-white text-[#30678d] hover:border-[#073f70] hover:bg-[#e7f0ee]"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </nav>

                {/* loading / error / empty /menu items */}
                {loading ? (
                    <p className="text-center text-[#073f70]/60">
                        Loading menu...
                    </p>
                ) : error ? (
                    <p className="text-center text-red-600">
                        {error}
                    </p>
                ) : visibleItems.length === 0 ? (
                    <p className="text-center text-[#073f70]/60">
                        No {activeCategory.toLowerCase()} are available right now.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {visibleItems.map((item) => (
                            <MenuItemCard
                                key={item.name}
                                menuItem={item}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                )}

                {/* About Us Button navigates to about us page */}
                <div className="mt-10 flex justify-center">
                    <button
                        type="button"
                        onClick={() => navigate("/About")}
                        className="rounded-full border-2 border-[#073f70] bg-[#073f70] px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-[#074d86] hover:bg-[#074d86] active:scale-95"
                    >
                        Discover Our Story
                    </button>
                </div>

            </section>

        </div>
    );
};
