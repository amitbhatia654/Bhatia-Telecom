const Payment = require("../Models/PaymentsModel");

const Invoice = require('../ShopModel/BillsModel')


const createInvoice = async (req, res) => {

    try {

        // return console.log(req.body, ' now the bdoy')

        const invoiceDetails = await Invoice.create(req.body)


        res.status(200).json({ message: "New Invoice Created", invoiceDetails })
    } catch (error) {
        res.status(400).send("Some Error Occured")
        console.log('New Member error', error)
    }
}


module.exports = { createInvoice }