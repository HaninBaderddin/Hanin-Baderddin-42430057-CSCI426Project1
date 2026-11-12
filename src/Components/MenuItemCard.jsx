import { useState } from "react";
import { ChevronDown, ShoppingCart, Minus, Plus } from "lucide-react";

export const MenuItemCard = ({ menuItem, onAddToCart }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const ingredients = Array.isArray(menuItem.ingredients)
        ? menuItem.ingredients
        : (menuItem.ingredients || "").split(",").map(item => item.trim()).filter(Boolean);

    const tags = Array.isArray(menuItem.tags)
        ? menuItem.tags
        : (menuItem.tags || "").split(",").map(tag => tag.trim()).filter(Boolean);

    const totalPrice = Number(menuItem.price) * quantity;

    const handleToggle = () => {
        if (isExpanded) {
            setQuantity(1);
            setIsExpanded(false);
        } else {
            setIsExpanded(true);
        }
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();

        if (onAddToCart) {
            onAddToCart(menuItem, quantity);
        }

        setQuantity(1);
    };

    return (
        <div
            onClick={handleToggle}
            className="mx-3 w-auto cursor-pointer overflow-hidden rounded-2xl border border-[#073f7020] bg-[#fffdf8] shadow-[0_8px_20px_rgb(7_63_112_/_8%)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgb(7_63_112_/_12%)] sm:mx-auto sm:w-full sm:max-w-[850px]"
        >
            <div className="flex min-h-[120px] items-center gap-4 p-3 sm:min-h-[145px] sm:gap-5 sm:p-4">

                {!isExpanded && (
                    <div className="h-[100px] w-[100px] shrink-0 overflow-hidden rounded-xl sm:h-[120px] sm:w-[120px]">
                        <img
                            src={menuItem.image}
                            alt={menuItem.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                <div className="min-w-0 flex-1 text-left">
                    <h3 className="m-0 text-base font-bold text-[#074d86] sm:text-xl">
                        {menuItem.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#4780a0] sm:text-sm">
                        {ingredients.join(", ")}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <p className="m-0 text-sm font-bold text-[#074d86] sm:text-base">
                        ${(isExpanded ? totalPrice : Number(menuItem.price)).toFixed(2)}
                    </p>

                    <ChevronDown
                        size={20}
                        className={`text-[#4780a0] transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                        }`}
                    />
                </div>
            </div>

            <div
                className={`grid transition-all duration-300 ease-out ${
                    isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-[#073f7015] px-4 pb-5 pt-4 text-left sm:px-5">

                        <div className="mb-4 h-[220px] w-full overflow-hidden rounded-xl sm:h-[300px]">
                            <img
                                src={menuItem.image}
                                alt={menuItem.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <p className="m-0 text-sm leading-relaxed text-[#30678d] sm:text-base">
                            {menuItem.description}
                        </p>

                        {tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <span
                                        key={`${tag}-${index}`}
                                        className="rounded-full bg-[#e7f0ee] px-3 py-1 text-[.65rem] font-bold uppercase tracking-[.08em] text-[#30678d]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div
                            className="mt-6 flex items-center justify-between"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-sm font-semibold text-[#074d86]">
                                Quantity
                            </span>

                            <div className="flex items-center gap-4 rounded-xl border border-[#073f7020] bg-[#f8f6ef] px-3 py-2">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[#073f70] transition hover:bg-[#e7e0d2] disabled:cursor-not-allowed disabled:opacity-30"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={16} />
                                </button>

                                <span className="min-w-[20px] text-center text-sm font-bold text-[#073f70]">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[#073f70] transition hover:bg-[#e7e0d2]"
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#073f70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0a568f] active:scale-[0.98]"
                        >
                            <ShoppingCart size={18} />
                            Add to Cart
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};
