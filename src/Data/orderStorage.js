
const ORDERS_STORAGE_KEY = "salt_orders";
const LATEST_ORDER_KEY = "salt_latest_order";

export const getStoredOrders = () => {
    try {
        const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
        return orders ? JSON.parse(orders) : [];
    } catch {
        return [];
    }
};

const saveOrders = (orders) => {
    localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(orders)
    );
};

export const saveOrderLocally = (order) => {
    const newOrder = {
        ...order,
        id: order.id || `${Date.now()}-${Math.random()
            .toString(36).slice(2, 8)}`,
        status: order.status || "Pending",
        createdAt: order.createdAt || new Date().toISOString()
    };

    const orders = getStoredOrders();

    orders.unshift(newOrder);
    saveOrders(orders);

    localStorage.setItem(
        LATEST_ORDER_KEY,
        newOrder.id
    );

    return newOrder;
};

export const updateStoredOrder = (id, changes) => {
    const orders = getStoredOrders();

    const updatedOrders = orders.map((order) =>
        order.id === id
            ? { ...order, ...changes }
            : order
    );

    saveOrders(updatedOrders);
};

export const removeStoredOrder = (id) => {
    const orders = getStoredOrders();
    const updatedOrders = orders.filter(
        (order) => order.id !== id
    );

    saveOrders(updatedOrders);

    if (localStorage.getItem(LATEST_ORDER_KEY) === id) {
        localStorage.removeItem(LATEST_ORDER_KEY);
    }
};

export const getLatestOrder = () => {
    const latestId = localStorage.getItem(LATEST_ORDER_KEY);

    if (!latestId) return null;

    return getStoredOrders().find(
        (order) => order.id === latestId
    ) || null;
};
