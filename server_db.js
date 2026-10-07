const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'server_data.json');

const defaultDb = {
    orders: {},
    payment_settings: {
        razorpay: { is_enabled: false, key_id: '', secret_key: '', mode: 'test' },
        cashfree: { is_enabled: false, key_id: '', secret_key: '', mode: 'test' },
        cod: { is_enabled: true, charge: 0, max_amount: 500000 }
    },
    payments: {},
    order_items_extra: {}
};

function getDb() {
    if (fs.existsSync(DB_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        } catch (e) {
            return defaultDb;
        }
    }
    saveDb(defaultDb);
    return defaultDb;
}

function saveDb(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function updateOrderExtra(orderId, data) {
    const db = getDb();
    if (!db.orders[orderId]) db.orders[orderId] = {};
    db.orders[orderId] = { ...db.orders[orderId], ...data };
    saveDb(db);
}

function getOrderExtra(orderId) {
    const db = getDb();
    return db.orders[orderId] || {};
}

function saveOrderItemsExtra(orderId, items) {
    const db = getDb();
    db.order_items_extra[orderId] = items;
    saveDb(db);
}

function getPaymentSettings() {
    return getDb().payment_settings;
}

function updatePaymentSettings(gateway, data) {
    const db = getDb();
    db.payment_settings[gateway] = { ...db.payment_settings[gateway], ...data };
    saveDb(db);
}

function savePayment(paymentId, data) {
    const db = getDb();
    db.payments[paymentId] = data;
    saveDb(db);
}

module.exports = {
    getDb,
    saveDb,
    updateOrderExtra,
    getOrderExtra,
    saveOrderItemsExtra,
    getPaymentSettings,
    updatePaymentSettings,
    savePayment
};
