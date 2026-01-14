const express = require('express');
const router = express.Router()
const gymController = require('../Controller/gym-controller');
const shopController = require('../Controller/shop-controllers')
const AuthMiddleWare = require('../auth-middleware');







router.route('/create-invoice').post(AuthMiddleWare, shopController.createInvoice)









module.exports = router;