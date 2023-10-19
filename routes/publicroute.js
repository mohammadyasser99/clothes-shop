const express = require('express');
const router = express.Router();
const controller = require('../controller/publiccontroller');


router.get('/',controller.getindex);

router.get('/single-product/:id',controller.getsingleproduct);

router.get('/about',controller.getabout);

router.get('/contact-us',controller.getcontact);

router.get('/products',controller.getproducts);

router.post('/addtocart', controller.addtocart,controller.addtocart2);

router.get('/yourcart',  controller.getyourcart);

router.get('/checkout',controller.getcheckout);

router.post('/checkout',controller.postcheckout);

router.post('/subscribe',controller.postsubscribe);


    

module.exports = router