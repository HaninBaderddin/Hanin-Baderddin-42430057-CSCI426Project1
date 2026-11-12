const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5002;
const ordersDirectory = path.join(__dirname, "admin");
const ordersFile = path.join(ordersDirectory, "orders.json");

class Order {
    constructor(data) {
        this.id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        this.customerName = data.customerName;
        this.phone = data.phone;
        this.orderType = data.orderType;
        this.deliveryLocation = data.deliveryLocation || "";
        this.details = data.details || "";
        this.additionalDetails = data.additionalDetails || "";
        this.items = data.items;
        this.total = data.total;
        this.status = "Pending";
        this.createdAt = new Date().toISOString();
    }
}

const ensureOrdersFile = () => {
    fs.mkdirSync(ordersDirectory, { recursive: true });
    if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, "[]");
};

const readOrders = () => {
    ensureOrdersFile();
    try {
        const orders = JSON.parse(fs.readFileSync(ordersFile, "utf8"));
        return Array.isArray(orders) ? orders : [];
    } catch {
        return [];
    }
};

const writeOrders = (orders) => {
    ensureOrdersFile();
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
};

const sendJson = (response, statusCode, data) => {
    response.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end(JSON.stringify(data));
};

const server = http.createServer((request, response) => {
    if (request.method === "OPTIONS") return sendJson(response, 204, {});

    if (request.method === "GET" && request.url === "/orders") {
        return sendJson(response, 200, readOrders());
    }

    if (request.method === "GET" && request.url.startsWith("/orders/")) {
        const id = decodeURIComponent(request.url.slice("/orders/".length));
        const order = readOrders().find((item) => item.id === id);
        return order
            ? sendJson(response, 200, order)
            : sendJson(response, 404, { message: "Order not found." });
    }

    if (request.method === "POST" && request.url === "/orders") {
        let body = "";
        request.on("data", (chunk) => { body += chunk; });
        request.on("end", () => {
            try {
                const data = JSON.parse(body);
                if (!data.customerName || !data.phone || !data.orderType || !Array.isArray(data.items) || !data.items.length) {
                    return sendJson(response, 400, { message: "Please provide the customer information and ordered items." });
                }

                const orders = readOrders();
                const order = new Order(data);
                orders.unshift(order);
                writeOrders(orders);
                return sendJson(response, 201, order);
            } catch {
                return sendJson(response, 400, { message: "The order could not be saved." });
            }
        });
        return;
    }

    if (request.method === "DELETE" && request.url.startsWith("/orders/")) {
        const id = decodeURIComponent(request.url.slice("/orders/".length));
        const orders = readOrders();
        const updatedOrders = orders.filter((order) => order.id !== id);
        if (updatedOrders.length === orders.length) return sendJson(response, 404, { message: "Order not found." });
        writeOrders(updatedOrders);
        return sendJson(response, 200, { message: "Order deleted." });
    }

    if (request.method === "PATCH" && request.url.startsWith("/orders/")) {
        const id = decodeURIComponent(request.url.slice("/orders/".length));
        let body = "";

        request.on("data", (chunk) => { body += chunk; });
        request.on("end", () => {
            try {
                const { status } = JSON.parse(body);
                const allowedStatuses = ["Pending", "Accepted", "Preparing", "Ready", "Completed"];

                if (!allowedStatuses.includes(status)) {
                    return sendJson(response, 400, { message: "Invalid order status." });
                }

                const orders = readOrders();
                const order = orders.find((item) => item.id === id);
                if (!order) return sendJson(response, 404, { message: "Order not found." });

                order.status = status;
                writeOrders(orders);
                return sendJson(response, 200, order);
            } catch {
                return sendJson(response, 400, { message: "The order status could not be updated." });
            }
        });
        return;
    }

    return sendJson(response, 404, { message: "Route not found." });
});

server.listen(PORT, () => console.log(`Order server running at http://localhost:${PORT}`));
