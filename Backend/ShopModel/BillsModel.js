const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
    {
        // ---------- Customer Details ----------
        cr_name: {
            type: String,
            // required: true,
            trim: true,
        },

        cr_phone_number: {
            type: String,
            // required: true,
            minlength: 10,
            maxlength: 10,
        },

        cr_address: {
            type: String,
            trim: true,
        },

        // 🟢 NEW: Customer Reference
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true, // 👈 important (har invoice kisi customer se linked hoga)
        },

        // ---------- Invoice Info ----------
        paymentMode: {
            type: String,
            enum: ["cash", "online"],
            default: "cash",
        },

        bill_date: {
            type: Date,
            default: Date.now,
        },

        invoiceNumber: {
            type: String,
            unique: true, // 👈 better (duplicate avoid)
        },

        // ---------- Products ----------
        items: [
            {
                pd_name: {
                    type: String,
                    required: true,
                    trim: true,
                },

                pd_code: {
                    type: String,
                    trim: true,
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },

                warranty: {
                    type: String,
                    default: "0",
                },

                warranty_expiry: {
                    type: Date,
                },
            },
        ],

        // ---------- Calculations ----------
        totalAmount: {
            type: Number,
            default: 0,
        },

        // ---------- Meta ----------
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);