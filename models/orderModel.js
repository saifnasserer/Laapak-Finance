const db = require('../config/db');

const Order = {
    getAll: async () => {
        const [rows] = await db.query('SELECT *, (selling_price - (base_cost + extra_cost)) as net_profit FROM orders ORDER BY created_at DESC');
        return rows;
    },

    create: async (order) => {
        const { order_number, base_cost, selling_price, extra_cost, notes } = order;
        const [result] = await db.query(
            'INSERT INTO orders (order_number, base_cost, selling_price, extra_cost, notes) VALUES (?, ?, ?, ?, ?)',
            [order_number, base_cost, selling_price, extra_cost, notes]
        );
        return { id: result.insertId, ...order };
    },

    findById: async (id) => {
        const [rows] = await db.query('SELECT *, (selling_price - (base_cost + extra_cost)) as net_profit FROM orders WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, order) => {
        const { order_number, base_cost, selling_price, extra_cost, notes } = order;
        const [result] = await db.query(
            'UPDATE orders SET order_number = ?, base_cost = ?, selling_price = ?, extra_cost = ?, notes = ? WHERE id = ?',
            [order_number, base_cost, selling_price, extra_cost, notes, id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Order;
