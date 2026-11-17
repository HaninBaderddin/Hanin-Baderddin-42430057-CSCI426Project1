import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null); //the context we will use to share cart information across components.
const CART_STORAGE_KEY = "salt-cart-items"; //This constant defines the key used to store cart items in localStorage.


//This function is responsible for retrieving the previously saved cart items from localStorage.
const readStoredCart = () => {
    try {//Try to retrieve the saved cart
        const storedCart = localStorage.getItem(CART_STORAGE_KEY); //localStorage.getItem() retrieves data using the specified key. it looks for the data stored under "salt-cart-items".
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        return Array.isArray(parsedCart) ? parsedCart : []; //Convert the saved data into a JavaScript array
    } catch {
        return []; //empty array Because when a customer visits the website for the first time, their cart should start empty.
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(readStoredCart);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]); //responsible for automatically saving the cart items in localStorage whenever the cart changes.


    //This function is responsible for adding items to the customer's cart.
    //  It also checks whether the item already exists in the cart. If it does, it increases its quantity instead of adding a duplicate item.
    const addToCart = (menuItem, quantity = 1) => { //quantity = 1: The number of items to add. If no quantity is provided, the default is 1.
        const id = menuItem.id ?? menuItem.name; //If menuItem.id exists and is not null or undefined, it uses that ID. Otherwise, it uses menuItem.name as the ID.
        const amount = Math.max(1, Number(quantity) || 1); //This line ensures that the quantity is a valid number of at least 1.

        setCartItems((items) => {
            const existingItem = items.find((item) => item.id === id); //Check whether the item already exists

            if (existingItem) {
                return items.map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + amount }
                        : item
                );//If the item already exists, we don't add it again. Instead, we use map() to create a new array and increase its quantity.
            }

            return [...items, { ...menuItem, id, quantity: amount }];
        });
        setNotification({ id: Date.now(), message: `${menuItem.name} added to your cart.`, type: "success" });
    };

    const updateQuantity = (id, quantity) => {
        const amount = Number(quantity) || 0; //Convert the quantity into a number
        setCartItems((items) =>
            amount <= 0
                ? items.filter((item) => item.id !== id)
                : items.map((item) =>
                    item.id === id ? { ...item, quantity: amount } : item
                )
        );
        /* it checks whether the quantity is zero or negative. 
        If it is, we use the filter method to remove the item from the cart.
        Otherwise, we use the map method to find the matching item and update its quantity while keeping the other items unchanged."*/
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


    //This function is responsible for displaying notifications to the customer or administrator.
    //  It allows us to show a success message, an error message, or clear an existing notification.
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
