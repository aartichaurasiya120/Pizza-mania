const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder, getUserOrders } = require('../controller/orderController');

router.post('/create', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getUserOrders);

module.exports = router;
