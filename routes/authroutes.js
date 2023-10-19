const express = require('express');
const router = express.Router();
const controller = require('../controller/authcontroller.js');
const session = require('express-session');
const auth = require('../middleware/auth');

router.get('/', auth.requireLogin,controller.getindex);
router.get('/signup', controller.getsignup);
router.post('/adduser', controller.postsignup);
router.get('/login', controller.getlogin);
router.post('/login', controller.postlogin);
router.get('/addproduct',auth.requireLogin, controller.getaddproduct);
router.post('/addproduct', controller.postaddproduct);
router.get('/editproduct/:id', controller.geteditproduct);
router.post('/editproduct/:id', controller.posteditproduct);
router.post('/deleteproduct/:id', controller.postdeleteproduct);
router.post('/logout', controller.postlogout);


module.exports = router;