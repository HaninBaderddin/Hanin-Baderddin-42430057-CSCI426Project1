import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "salt-cart-items";

const readStoredCart = () => {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(readStoredCart);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (menuItem, quantity = 1) => {
        const id = menuItem.id ?? menuItem.name;
        const amount = Math.max(1, Number(quantity) || 1);

        setCartItems((items) => {
            const existingItem = items.find((item) => item.id === id);

            if (existingItem) {
                return items.map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + amount }
                        : item
                );
            }

            return [...items, { ...menuItem, id, quantity: amount }];
        });
        setNotification({ id: Date.now(), message: `${menuItem.name} added to your cart.`, type: "success" });
    };

    const updateQuantity = (id, quantity) => {
        const amount = Number(quantity) || 0;
        setCartItems((items) =>
            amount <= 0
                ? items.filter((item) => item.id !== id)
                : items.map((item) =>
                    item.id === id ? { ...item, quantity: amount } : item
                )
        );
    };

    const removeFromCart = (id) => {
        setCartItems((items) => {
            const removedItem = items.find((item) => item.id === id);
            if (removedItem) {
                setNotification({ id: Date.now(), message: `${removedItem.name} removed from your cart.`, type: "info" });
            }
            return items.filter((item) => item.id !== id);
        });
    };

    const clearCart = () => setCartItems([]);

    const showNotification = (message, type = "success") => {
        setNotification(message ? { id: Date.now(), message, type } : null);
    };

    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const total = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    const value = {
        cartItems,
        itemCount,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        notification,
        showNotification,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside CartProvider.");
    }

    return context;
};
