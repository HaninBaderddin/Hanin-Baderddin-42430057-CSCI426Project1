//Its purpose is to manage customer orders using localStorage.
//It contains functions for retrieving orders, saving new orders, updating order information, deleting orders, and retrieving the latest order.

//These are constants that identify where order information is stored in localStorage.
const ORDERS_STORAGE_KEY = "salt_orders"; //Stores all customer orders.
const LATEST_ORDER_KEY = "salt_latest_order"; //Stores the ID of the most recently placed order.

//This function retrieves all previously saved orders from localStorage.
export const getStoredOrders = () => {
    try {
        const orders = localStorage.getItem(ORDERS_STORAGE_KEY); //retrieves the saved orders using ORDERS_STORAGE_KEY.
        return orders ? JSON.parse(orders) : []; //converts the JSON string into a JavaScript array. if order exists
    } catch {
        return [];
    }
};

//This function saves an updated orders array in localStorage.
const saveOrders = (orders) => { //This function saves an updated orders array in localStorage.  
    localStorage.setItem( //saves that string under the orders storage key.
        ORDERS_STORAGE_KEY,
        JSON.stringify(orders) //converts the JavaScript array into a JSON string.
    );
};

//This function is responsible for saving a new customer order.
export const saveOrderLocally = (order) => {
    const newOrder = {
        ...order, //Copies all existing properties from the original order object.
        id: order.id || `${Date.now()}-${Math.random() //Checks whether the order already has an ID. if yes we keep it otherwise we generate it
            .toString(36).slice(2, 8)}`,
        status: order.status || "Pending", //Checks whether the order already has a status. If it doesn't, we assign "Pending" as the default status.
        createdAt: order.createdAt || new Date().toISOString()
    }; //Create the new order object using the existing order information and add some additional properties

    const orders = getStoredOrders(); //Calls the getStoredOrders() function to retrieve all previously saved orders.

    orders.unshift(newOrder); //unshift() adds the new order to the beginning of the array. We use it so that the newest order appears first.
    saveOrders(orders); //Calls our previously created saveOrders() function to save the updated array in localStorage.

    localStorage.setItem(
        LATEST_ORDER_KEY,
        newOrder.id //This saves the ID of the latest order separately. Because the Home page uses this ID to identify and display the customer's most recent order and its status.
    );

    return newOrder; //Returns the newly created order object.
};

//This function updates an existing order. changes: An object containing the properties we want to modify.
export const updateStoredOrder = (id, changes) => {
    const orders = getStoredOrders(); //Gets the current orders from localStorage.

    const updatedOrders = orders.map((order) => //Find and update the order . We use map() to go through all orders.
        order.id === id //checks whether the current order matches the ID we want.
            ? { ...order, ...changes } //If it matches, { ...order, ...changes } creates a copy of the order and applies the new changes.
            : order //Otherwise, the order remains unchanged.
    );

    saveOrders(updatedOrders); //Saves the updated array in localStorage.
};

//This function deletes an order using its ID.
export const removeStoredOrder = (id) => {
    const orders = getStoredOrders(); //Gets all saved orders.
    const updatedOrders = orders.filter( //We use filter() to create a new array containing all orders except the one whose ID matches the given ID.
        (order) => order.id !== id
    );

    saveOrders(updatedOrders); //Saves the array without the deleted order.

    if (localStorage.getItem(LATEST_ORDER_KEY) === id) { //This checks whether the deleted order was also saved as the latest order.
        localStorage.removeItem(LATEST_ORDER_KEY); //If the IDs match, removeItem() removes the latest order ID from localStorage. Otherwise, nothing happens.
    }
};

//This function retrieves the most recently placed order.
export const getLatestOrder = () => {
    const latestId = localStorage.getItem(LATEST_ORDER_KEY); //Gets the ID that was saved when the latest order was placed.

    if (!latestId) return null; //If no latest order ID exists, the function returns null.

    return getStoredOrders().find( //retrieves all saved orders. find() searches for the order whose ID matches latestId.
        (order) => order.id === latestId //If it finds the order, it returns that order.
    ) || null; //If no matching order exists, || null returns null.
};
