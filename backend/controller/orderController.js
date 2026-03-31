const Order = require('../models/orderModel');
const User = require('../models/userModel');

exports.createOrder = async (req, res) => {
    try {
        const { items, totalSellingPrice, paymentMethod, customerName, customerPhone, deliveryAddress } = req.body;
        const userId = req.body.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Calculate total cost and profit
        let totalCostPrice = 0;
        const orderItems = items.map(item => {
            const itemCost = item.costPrice || (item.sellingPrice * 0.4);
            totalCostPrice += itemCost * item.quantity;
            return {
                name: item.name,
                img: item.img,
                quantity: item.quantity,
                sellingPrice: item.sellingPrice,
                costPrice: itemCost
            };
        });

        const netProfit = totalSellingPrice - totalCostPrice;

        const newOrder = new Order({
            userId,
            items: orderItems,
            totalSellingPrice,
            totalCostPrice,
            netProfit,
            paymentMethod,
            customerName: customerName || user.userName,
            customerEmail: user.email,
            customerPhone: customerPhone || user.phone,
            deliveryAddress: deliveryAddress || user.address,
            status: 'Pending'
        });

        await newOrder.save();

        res.status(201).send({
            success: true,
            message: "Order Submitted Successfully",
            order: newOrder
        });
    } catch (error) {
        res.status(500).send({ success: false, message: "Server error", error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.body.id;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        res.status(200).send({ orders });
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
};
