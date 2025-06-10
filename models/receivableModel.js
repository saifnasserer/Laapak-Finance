const db = require('../config/db');

const Receivable = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM receivables ORDER BY due_date ASC');
        return rows;
    },

    create: async (receivable) => {
        const { client_name, project_name, amount, due_date, status } = receivable;
        const [result] = await db.query(
            'INSERT INTO receivables (client_name, project_name, amount, due_date, status) VALUES (?, ?, ?, ?, ?)',
            [client_name, project_name, amount, due_date, status || 'Due']
        );
        return { id: result.insertId, ...receivable };
    },

    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM receivables WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, receivable) => {
        const { client_name, project_name, amount, due_date, status } = receivable;
        const [result] = await db.query(
            'UPDATE receivables SET client_name = ?, project_name = ?, amount = ?, due_date = ?, status = ? WHERE id = ?',
            [client_name, project_name, amount, due_date, status, id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM receivables WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Receivable;
