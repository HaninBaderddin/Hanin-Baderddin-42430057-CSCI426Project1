export const ORDER_STORAGE_KEY = "salt-orders";

export const getStoredOrders = () => {
    try {
        const savedOrders = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || "[]");
        return Array.isArray(savedOrders) ? savedOrders : [];
    } catch {
        return [];
    }
};

export const saveOrderLocally = (order) => {
    const updatedOrders = [order, ...getStoredOrders()];
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updatedOrders));
    return order;
};

export const removeStoredOrder = (id) => {
    const updatedOrders = getStoredOrders().filter((order) => order.id !== id);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updatedOrders));
};

export const updateStoredOrder = (id, changes) => {
    const updatedOrders = getStoredOrders().map((order) => (
        order.id === id ? { ...order, ...changes } : order
    ));
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updatedOrders));
};
