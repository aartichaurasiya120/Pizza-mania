const mongoose = require('mongoose');

// Define Pizza Schema
const pizzaSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    calories: {
        type: String,
        required: true
    },
    menu:{
        type:String
    },
    prices: {
        type: Map,
        of: Number,
        required: true,
    },
    costPrice: {
        type: Number,
        default: 0
    }
});

// Create Model
module.exports = mongoose.model('Pizza', pizzaSchema);


