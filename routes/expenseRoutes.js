const express = require('express');
const router = express.Router();
const {
    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

// Route for getting all expenses and creating a new expense
router.route('/')
    .get(getExpenses)
    .post(createExpense);

// Route for getting, updating, and deleting a single expense by ID
router.route('/:id')
    .get(getExpenseById)
    .put(updateExpense)
    .delete(deleteExpense);

module.exports = router;
