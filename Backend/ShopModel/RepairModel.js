const mongoose = require("mongoose");

const RepairSchema = new mongoose.Schema(
    {
        // ---------- Basic Repair Info ----------
        repairId: {
            type: String,
            unique: true,
        },

        status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "delivered"],
            default: "pending",
        },

        repair_date: {
            type: Date,
            default: Date.now,
        },

        // ---------- Customer Details ----------
        customer_name: {
            type: String,
            required: true,
            trim: true,
        },

        customer_phone: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 10,
        },

        // ---------- Phone Details ----------
        phone_model: {
            type: String,
            required: true,
            trim: true,
        },

        brand: {
            type: String,
            enum: ["oppo", "vivo", "samsung", "xiaomi", "realme", "apple", "other"],
            required: true,
        },

        lock_code: {
            type: String,
            trim: true,
        },

        // ---------- Accessories Received ----------
        accessories: {
            sim: {
                type: Boolean,
                default: false,
            },
            memory: {
                type: Boolean,
                default: false,
            },
            back_cover: {
                type: Boolean,
                default: false,
            },
        },

        // ---------- Repair Info ----------
        problem: {
            type: String,
            required: true,
            trim: true,
        },

        estimated_price: {
            type: Number,
            default: 0,
            min: 0,
        },

        advance_money: {
            type: Number,
            default: 0,
            min: 0,
        },

        remaining_amount: {
            type: Number,
            default: 0,
            min: 0,
        },

        notes: {
            type: String,
            trim: true,
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


// 🔥 Auto Calculate Remaining Amount
RepairSchema.pre("save", function (next) {
    this.remaining_amount =
        (this.estimated_price || 0) - (this.advance_money || 0);
    next();
});


// 🔥 Optional: Auto Generate Repair ID (RPR-1001 type)
RepairSchema.pre("save", async function (next) {
    if (!this.repairId) {
        const count = await mongoose.model("Repair").countDocuments();
        this.repairId = `RPR-${1001 + count}`;
    }
    next();
});

const Repair = mongoose.model("Repair", RepairSchema);
module.exports = Repair;