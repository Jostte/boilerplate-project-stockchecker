const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    stock: {
        type: String,
        required: true,
    },
    ips: {
        type: [String],
        default: [],
    }

}, { timestamps: true });

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;