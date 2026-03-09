// const Payment = require("../Models/PaymentsModel");

const Invoice = require('../ShopModel/BillsModel')


// import Invoice from "../models/Invoice.js";

// helper – invoice number generator
const generateInvoiceNumber = async () => {
    const count = await Invoice.countDocuments();
    return `INV-${new Date().getFullYear()}-${count + 1}`;
};

const createInvoice = async (req, res) => {
    try {
        const {
            cr_name,
            cr_phone_number,
            cr_address,
            paymentMode,
            bill_date,
            items,
        } = req.body;

        // 🔴 basic validation
        // if (!cr_name || !cr_phone_number || !items || items.length === 0) {
        //     return res.status(400).json({
        //         message: "Customer details & at least 1 item required",
        //     });
        // }

        // 🧮 total amount + warranty expiry
        let totalAmount = 0;

        const updatedItems = items.map((item) => {
            totalAmount += Number(item.price || 0);

            let warranty_expiry = null;
            if (item.warranty) {
                warranty_expiry = new Date(bill_date || Date.now());
                warranty_expiry.setMonth(
                    warranty_expiry.getMonth() + Number(item.warranty)
                );
            }

            return {
                ...item,
                warranty_expiry,
            };
        });

        // 🔢 invoice number
        const invoiceNumber = await generateInvoiceNumber();

        // 💾 create invoice
        const invoice = await Invoice.create({
            cr_name,
            cr_phone_number,
            cr_address,
            paymentMode,
            bill_date: bill_date || new Date(),
            invoiceNumber,
            items: updatedItems,
            totalAmount,
            createdBy: req.user?._id || null,
        });

        return res.status(201).json({
            message: "Invoice created successfully",
            invoiceDetails: invoice,
        });
    } catch (error) {
        console.error("Create Invoice Error:", error);

        return res.status(500).json({
            message: "Failed to create invoice",
            error: error.message,
        });
    }
};

const updateInvoice = async (req, res) => {
    try {
        const invoiceId = req.body._id;
        const {
            cr_name,
            cr_phone_number,
            cr_address,
            paymentMode,
            bill_date,
            items,
        } = req.body;

        // 🔍 find invoice
        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found",
            });
        }

        // 🧮 recalculate total amount + warranty expiry
        let totalAmount = 0;

        const updatedItems = items.map((item) => {
            totalAmount += Number(item.price || 0);

            let warranty_expiry = null;

            if (item.warranty) {
                warranty_expiry = new Date(bill_date || invoice.bill_date);
                warranty_expiry.setMonth(
                    warranty_expiry.getMonth() + Number(item.warranty)
                );
            }

            return {
                ...item,
                warranty_expiry,
            };
        });

        // ✏️ update fields
        invoice.cr_name = cr_name;
        invoice.cr_phone_number = cr_phone_number;
        invoice.cr_address = cr_address;
        invoice.paymentMode = paymentMode;
        invoice.bill_date = bill_date || invoice.bill_date;
        invoice.items = updatedItems;
        invoice.totalAmount = totalAmount;

        await invoice.save();

        return res.status(200).json({
            message: "Invoice updated successfully",
            invoiceDetails: invoice,
        });

    } catch (error) {
        console.error("Update Invoice Error:", error);

        return res.status(500).json({
            message: "Failed to update invoice",
            error: error.message,
        });
    }
};





const getInvoices = async (req, res) => {
    try {

        const response = await Invoice.find()
        console.log(response, ' the response is ')

        res.status(200).json({ response });
    } catch (error) {
        console.error("Error fetching Invoices:", error); // Log the error for debugging
        res.status(500).send("Invoice not found");
    }
};

const createRepair = async (req, res) => {
    try {
        console.log(req.body, 'body is')
        res.status(200).json({ response });

    } catch (error) {
        console.error('error in repair entry')
    }
}




module.exports = { createInvoice, getInvoices, createRepair, updateInvoice }