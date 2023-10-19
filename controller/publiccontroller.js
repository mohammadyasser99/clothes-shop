const express = require('express');


const Product = require('../models/product');
const Cart = require('../models/cart');
const session = require('express-session');
const { json } = require('body-parser');
const Checkout = require('../models/checkout');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohamedy1999.my7753@gmail.com',
        pass: 'wosp ediq eptp yxhc'
    }
});

const options = {
    from: 'mohamedy1999.my7753@gmail.com',
    to: 'mohamedmona014@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};





exports.getindex = (req, res) => {
    Product.find().then(function (products) {
        
        res.render('index', {products: products,isloggedin:req.session.user, title: 'Home'});
        });
}

exports.getsingleproduct = (req, res) => {
    Product.findById(req.params.id).then(function (product) {
        // res.render('single-product', {product: product, title: product.title});
        return Product.find().then(function (products) {
            res.render('single-product', {product: product, title: product.title,products:products,isloggedin:req.session.user});
            }
            );
        });
}

exports.getabout = (req, res) => {
    res.render('about', {title: 'About Us',isloggedin:req.session.user});

}

exports.getcontact = (req, res) => {
    res.render('contact', {title: 'Contact Us',isloggedin:req.session.user});

}

exports.getproducts = (req, res) => {
    Product.find().then(function (products) {
        res.render('products', {products: products, title: 'Products',isloggedin:req.session.user});
        });
   
}

exports.addtocart = (req, res,next) => {
    
    if(!req.session.user){
        return  res.redirect('/admin/login')
       }
          // console.log(req.session.user._id);
           const userid = req.session.user._id;
           const productid = req.body.productid;
           const quantity = req.body.quantity;
           const price = req.body.price;
           const name = req.body.name;
           const image = req.body.image;
           
           
    Cart.findOne({userid:userid}).then(function (cart) {
       //  console.log(cart);
       
   
       if(cart){
   
     Cart.findOne({userid:userid, "products.productid":productid}).then(function (product) {
   
   
   if(product){
   Cart.findOneAndUpdate({userid:userid, "products.productid":productid},{$set:{"products.$.quantity":quantity}}).then(function (cart) {
       
     
       
      // console.log(cart);
       console.log('1');
   
      
       // cart.totalprice = Number( cart.totalprice + (quantity * product.price));
       // cart.save();
       req.session.cart = cart;
       next();
      // res.redirect('/yourcart');
   })
   }else{
   Cart.findOneAndUpdate({userid:userid},{$push:{products:{productid:productid,quantity:quantity,price:price,name:name,image:image}}}).then(function (cart) {
      // console.log(cart);
       console.log('2');
   
      
       // cart.totalprice = cart.totalprice + (quantity * product.price);
       // cart.save();
       req.session.cart = cart;
       next();
      // res.redirect('/yourcart');
   });
   
   }
   
   
   
   });
       }else{
           const cart = new Cart({
               userid: userid,
               products: [{productid:productid,quantity:quantity,price:price ,name:name,image:image}],
               totalprice : price * quantity,
              
               
           });
           cart.save().then(function (cart) {
             //  console.log(cart);
               console.log('3');
               req.session.cart = cart;
               next();
              // res.redirect('/yourcart');
           });
       }
   });
   
   
   
   }   


   exports.addtocart2 = (req, res) => {
    let totalprice = 0;
    Cart.find({userid:req.session.user._id}).then(function (cart,i) {
      //console.log(cart);
      // console.log(cart[0].products);
  
  cart[0].products.forEach(async function (product) {
    
  
  totalprice = totalprice + (product.quantity * product.price);
  
  
    })
  
  cart[0].totalprice = totalprice;
  cart[0].save();
  
  })
    res.redirect('/yourcart');
    }

    exports.getyourcart = (req, res) => {
        
let cartitems = []; 
let totalprice = 0;
req.session.products = [];
let products = [];

 //console.log(cart);

 Cart.find({userid:req.session.user._id}).then(  function (cart,i) {
  //de 3ayzenha
  // console.log(cart[0].products);
  
 

cart[0].products.forEach(async function (product) {
Product.findById(product.productid).then(function (product) {
 // console.log(product);
  products.push(product);
  req.session.products.push(product);
}
  )
});
//console.log(req.session.cart);

res.render('yourcart', {cart: cart[0].products,totalprice:cart[0].totalprice,products:products, title: 'Your Cart',isloggedin:req.session.user});
 });
 
    }

    exports.getcheckout = (req, res) => {
        Checkout.findOne({userid:req.session.user._id}).then(function (checkout) {
            console.log('checkout');
            console.log(checkout);
            res.render('checkout', {checkout: checkout.cart, title: 'Checkout',isloggedin:req.session.user});
        }
        )

        
    }
    exports.postcheckout = (req, res) => {
         console.log(req.body.cart);
// console.log(req.body.totalprice);


Checkout.findOne({userid:req.session.user._id}).then(function (checkout) {
    if(checkout){ console.log(req.body.totalprice);
      console.log('11');
        Checkout.findOneAndUpdate({userid:req.session.user._id},{$push:{cart:req.body.cart}}).then(function (checkout) {
            res.redirect('/checkout');
        })
    }else{
        console.log('22');
    console.log(req.body.totalprice);
        const checkout = new Checkout({
            userid:req.session.user._id,
            cart:[req.body.cart],
            totalprice:req.body.cart.totalprice
        });
        checkout.save().then(function (checkout) {
            res.redirect('/checkout');
        })
    }
})
    }

    exports.postsubscribe = (req, res) => {
        transporter.sendMail(options, function (err, info) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Sent: ' + info.response);
        }
        
        );
      
    }




