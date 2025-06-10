const Expense = require('../models/expenseModel');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.getAll();
        res.json(expenses);
    } catch (error) {
        console.error('ERROR FETCHING EXPENSES:', error); // Added for detailed debugging
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
// @access  Public
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (expense) {
            res.json(expense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Public
exports.createExpense = async (req, res) => {
    try {
        const {
            description,
            amount,
            category,
            expense_date,
            is_recurring,
            recurring_frequency,
            recurring_end_date
        } = req.body;

        const newExpenseData = {
            description,
            amount,
            category,
            expense_date,
            is_recurring: !!is_recurring, // Ensure it's a boolean
            recurring_frequency: is_recurring ? recurring_frequency : null,
            recurring_end_date: is_recurring ? recurring_end_date : null,
        };

        const newExpense = await Expense.create(newExpenseData);
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Error creating expense:', error); // Log the full error
        res.status(500).json({ error: 'Failed to create expense. ' + error.message });
    }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Public
exports.updateExpense = async (req, res) => {
    try {
        const affectedRows = await Expense.update(req.params.id, req.body);
        if (affectedRows > 0) {
            res.json({ message: 'Expense updated successfully' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Public
exports.deleteExpense = async (req, res) => {
    try {
        const affectedRows = await Expense.delete(req.params.id);
        if (affectedRows > 0) {
            res.json({ message: 'Expense deleted successfully' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
