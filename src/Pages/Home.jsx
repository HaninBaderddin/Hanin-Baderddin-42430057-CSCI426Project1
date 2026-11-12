import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MenuItemCard } from "../Components/MenuItemCard";
import MenuItems from "../Data/MenuItems";
import { useCart } from "../context/CartContext";

export const Home = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Main Dishes", "Appetizers", "Desserts", "Drinks"];
    const visibleItems = activeCategory === "All"
        ? menuItems
        : menuItems.filter((item) => item.category === activeCategory);

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

    return (
        <div className="min-h-screen bg-[#fffdf8]">

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

                <nav aria-label="Menu categories" className="mb-8 flex flex-wrap justify-center gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setActiveCategory(category)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                activeCategory === category
                                    ? "bg-[#073f70] text-white shadow-sm"
                                    : "border border-[#073f7020] bg-white text-[#30678d] hover:border-[#073f70] hover:bg-[#e7f0ee]"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </nav>

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

            </section>

        </div>
    );
};
