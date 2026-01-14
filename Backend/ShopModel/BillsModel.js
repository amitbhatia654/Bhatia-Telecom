const mongoose = require("mongoose")

const InvoiceSchema = new mongoose.Schema(
    {
        // ---------- Customer Details ----------
        cr_name: {
            type: String,
            required: true,
            trim: true,
        },

        cr_phone_number: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 10,
        },

        cr_address: {
            type: String,
            trim: true,
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
            unique: true,
        },

        // ---------- Products (Embedded) ----------
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
                    type: Number, // months
                    default: 0,
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
)


const Invoice = new mongoose.model("Invoice", InvoiceSchema)
module.exports = Invoice