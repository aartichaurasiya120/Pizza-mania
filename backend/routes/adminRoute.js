const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuthMiddleware');
const {
    adminLogin,
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getAllMenuItems,
    addMenuItem,
    addNewItem,
    updateMenuItem,
    deleteMenuItem
} = require('../controller/adminController');

// Public routes
router.post('/login', adminLogin);
router.post('/add-item', addNewItem);          // POST /api/admin/add-item

// Protected routes
router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/orders', adminAuth, getAllOrders);
router.put('/orders/:orderId', adminAuth, updateOrderStatus);
router.get('/menu', adminAuth, getAllMenuItems);
router.post('/menu', adminAuth, addMenuItem);
router.put('/menu/:itemId', adminAuth, updateMenuItem);
router.delete('/menu/:itemId', adminAuth, deleteMenuItem);

module.exports = router;
