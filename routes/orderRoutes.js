const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');

// Route for getting all orders and creating a new order
router.route('/')
    .get(getOrders)
    .post(createOrder);

// Route for getting, updating, and deleting a single order by ID
router.route('/:id')
    .get(getOrderById)
    .put(updateOrder)
    .delete(deleteOrder);

module.exports = router;
