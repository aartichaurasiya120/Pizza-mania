const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        name: String,
        img: String,
        quantity: Number,
        sellingPrice: Number,
        costPrice: { type: Number, default: 0 }
    }],
    totalSellingPrice: {
        type: Number,
        required: true
    },
    totalCostPrice: {
        type: Number,
        default: 0
    },
    netProfit: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'UPI', 'GPay'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Delivered'],
        default: 'Pending'
    },
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    deliveryAddress: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
