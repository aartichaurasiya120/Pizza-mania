const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const Order = require('../models/orderModel');
const Pizza = require('../models/pizzasModel');
const Drinks = require('../models/drinksModel');
const Melts = require('../models/meltsModel');
const Desserts = require('../models/dessertsModel');
const Pastas = require('../models/pastasModel');
const Sides = require('../models/sidesModel');

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const token = JWT.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).send({
            message: "Login successful",
            token,
            admin: { id: admin._id, email: admin.email }
        });
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};

// Dashboard Analytics with Real Database Data
exports.getDashboardStats = async (req, res) => {
    try {
        // Total Orders
        const totalOrders = await Order.countDocuments();

        // Pending Orders
        const totalPendingOrders = await Order.countDocuments({ status: 'Pending' });

        // Delivered Orders
        const totalDeliveredOrders = await Order.countDocuments({ status: 'Delivered' });

        // Total Revenue, Cost, and Profit using aggregation
        const financialStats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalSellingPrice" },
                    totalCost: { $sum: "$totalCostPrice" },
                    totalProfit: { $sum: "$netProfit" }
                }
            }
        ]);

        const { totalRevenue = 0, totalCost = 0, totalProfit = 0 } = financialStats[0] || {};

        // Recent 5 Orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'userName email');

        // Weekly Orders
        const weeklyOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalSellingPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Monthly Orders
        const monthlyOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalSellingPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).send({
            totalOrders,
            totalPendingOrders,
            totalDeliveredOrders,
            totalRevenue,
            totalCost,
            netProfit: totalProfit,
            recentOrders,
            weeklyOrders,
            monthlyOrders
        });
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};

// Get All Orders
exports.getAllOrders = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.find(filter)
            .populate('userId', 'userName email phone')
            .sort({ createdAt: -1 });

        res.status(200).send({ orders });
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Delivered'].includes(status)) {
            return res.status(400).send({ message: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        res.status(200).send({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};

// Menu Management - Get All Items
exports.getAllMenuItems = async (req, res) => {
    try {
        const { category } = req.query;
        let items = [];

        if (!category || category === 'pizzas') {
            const pizzas = await Pizza.find();
            items = [
                ...items,
                ...pizzas.map(p => {
                    const obj = p.toObject();
                    return {
                        ...obj,
                        category: 'pizzas',
                        prices: obj.prices instanceof Map
                            ? Object.fromEntries(obj.prices)
                            : obj.prices
                    };
                })
            ];
        }

        if (!category || category === 'drinks') {
            const drinks = await Drinks.find();
            items = [...items, ...drinks.map(d => ({ ...d.toObject(), category: 'drinks' }))];
        }

        if (!category || category === 'melts') {
            const melts = await Melts.find();
            items = [...items, ...melts.map(m => ({ ...m.toObject(), category: 'melts' }))];
        }

        if (!category || category === 'desserts') {
            const desserts = await Desserts.find();
            items = [...items, ...desserts.map(d => ({ ...d.toObject(), category: 'desserts' }))];
        }

        if (!category || category === 'pastas') {
            const pastas = await Pastas.find();
            items = [...items, ...pastas.map(p => ({ ...p.toObject(), category: 'pastas' }))];
        }

        if (!category || category === 'sides') {
            const sides = await Sides.find();
            items = [...items, ...sides.map(s => ({ ...s.toObject(), category: 'sides' }))];
        }

        res.status(200).send({ items });

    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};
// Add Menu Item (admin panel)
exports.addMenuItem = async (req, res) => {
    try {
        const { category, tittle, description, img, calories, menu, prices } = req.body;
        const models = { pizzas: Pizza, drinks: Drinks, melts: Melts, desserts: Desserts, pastas: Pastas, sides: Sides };

        const Model = models[category];
        if (!Model) return res.status(400).send({ message: "Invalid category" });

        // Pizza stores prices as a Map; every other category stores a single Number.
        // Coerce here so the value always matches the Mongoose schema regardless of
        // what shape the frontend sends.
        let priceValue;
        if (category === 'pizzas') {
            priceValue = prices; // Map<String, Number> — passed straight through
        } else {
            // Accept either a plain number/string OR an object like { regular: 150 }
            priceValue = typeof prices === 'object' && prices !== null
                ? Number(Object.values(prices)[0])
                : Number(prices);
        }

        const newItem = new Model({ tittle, description, img, calories, menu, prices: priceValue });
        await newItem.save();

        res.status(201).send({ message: "Item added", item: { ...newItem.toObject(), category } });
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};

// POST /api/add-item  — public-facing add item endpoint
exports.addNewItem = async (req, res) => {
    try {
        const { category, tittle, description, img, calories, menu, prices } = req.body;

        if (!category || !tittle || !img) {
            return res.status(400).send({ message: "category, tittle and img are required" });
        }

        const models = {
            pizzas: Pizza,
            drinks: Drinks,
            melts: Melts,
            desserts: Desserts,
            pastas: Pastas,
            sides: Sides,
        };

        const Model = models[category];
        if (!Model) return res.status(400).send({ message: "Invalid category" });

        // Pizzas store prices as a Map; everything else stores a single Number
        let priceData;
        if (category === 'pizzas') {
            if (!prices || typeof prices !== 'object') {
                return res.status(400).send({ message: "Pizza requires a prices object" });
            }
            priceData = prices; // Map<String, Number>
        } else {
            const flat = typeof prices === 'object' ? Object.values(prices)[0] : prices;
            priceData = Number(flat);
            if (isNaN(priceData)) return res.status(400).send({ message: "Invalid price" });
        }

        const newItem = await Model.create({
            tittle, description, img, calories, menu,
            prices: priceData,
        });

        res.status(201).send({
            message: "Item added successfully",
            item: { ...newItem.toObject(), category },
        });
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};

// Update Menu Item
exports.updateMenuItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { category, tittle, description, img, calories, menu, prices } = req.body;
        const models = { pizzas: Pizza, drinks: Drinks, melts: Melts, desserts: Desserts, pastas: Pastas, sides: Sides };

        const Model = models[category];
        if (!Model) return res.status(400).send({ message: "Invalid category" });

        const item = await Model.findByIdAndUpdate(
            itemId,
            { tittle, description, img, calories, menu, prices },
            { new: true }
        );

        if (!item) return res.status(404).send({ message: "Item not found" });

        res.status(200).send({ message: "Item updated", item });
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};

// Delete Menu Item
exports.deleteMenuItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { category } = req.query;
        const models = { pizzas: Pizza, drinks: Drinks, melts: Melts, desserts: Desserts, pastas: Pastas, sides: Sides };

        const Model = models[category];
        if (!Model) return res.status(400).send({ message: "Invalid category" });

        const item = await Model.findByIdAndDelete(itemId);
        if (!item) return res.status(404).send({ message: "Item not found" });

        res.status(200).send({ message: "Item deleted" });
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};
