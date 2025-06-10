const express = require('express');
const router = express.Router();
const {
    getReceivables,
    getReceivableById,
    createReceivable,
    updateReceivable,
    deleteReceivable
} = require('../controllers/receivableController');

// Route for getting all receivables and creating a new one
router.route('/')
    .get(getReceivables)
    .post(createReceivable);

// Route for getting, updating, and deleting a single receivable by ID
router.route('/:id')
    .get(getReceivableById)
    .put(updateReceivable)
    .delete(deleteReceivable);

module.exports = router;
