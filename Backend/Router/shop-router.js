const express = require('express');
const router = express.Router()
const gymController = require('../Controller/gym-controller');
const shopController = require('../Controller/shop-controllers')
const AuthMiddleWare = require('../auth-middleware');







router.route('/create-invoice').post(AuthMiddleWare, shopController.createInvoice)
router.route('/update-invoice').put(AuthMiddleWare, shopController.updateInvoice)

router.route('/get-invoices').get(AuthMiddleWare, shopController.getInvoices)
router.route('/create-repair').post(AuthMiddleWare, shopController.createRepair)

router.route('/search-cr').get(AuthMiddleWare, shopController.searchCustomers)













module.exports = router;