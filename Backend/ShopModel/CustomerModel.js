const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            // required: true,
            trim: true,
        },

        phone_number: {
            type: String,
            // required: true,
            unique: true, // 👈 duplicate avoid
            minlength: 10,
            maxlength: 10,
        },

        address: {
            type: String,
            default: "",
        },

        totalSpent: {
            type: Number,
            default: 0,
        },

        visitCount: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Customer", CustomerSchema);