const db = require('../config/db');

const Expense = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM expenses ORDER BY expense_date DESC');
        return rows;
    },

    create: async (expense) => {
        const { description, amount, category, expense_date, is_recurring, recurring_frequency, recurring_end_date } = expense;
        const sql = `
            INSERT INTO expenses 
            (description, amount, category, expense_date, is_recurring, recurring_frequency, recurring_end_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            description,
            amount,
            category,
            expense_date || new Date(),
            is_recurring || false,
            // Use null for frequency and end_date if the expense is not recurring or if they are not provided
            is_recurring ? recurring_frequency : null,
            is_recurring ? recurring_end_date : null
        ];
        const [result] = await db.query(sql, params);
        return { id: result.insertId, ...expense };
    },

    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, expense) => {
        const { description, amount, category, expense_date } = expense;
        const [result] = await db.query(
            'UPDATE expenses SET description = ?, amount = ?, category = ?, expense_date = ? WHERE id = ?',
            [description, amount, category, expense_date, id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM expenses WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Expense;
