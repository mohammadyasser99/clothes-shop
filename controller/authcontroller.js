const User = require('../models/user');
const jwt = require('jsonwebtoken')
const session = require('express-session');
const Product = require('../models/product');
const csrf = require('csurf');
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    
    auth: {
        user: 'mohamedy1999.my7753@gmail.com',
        pass: 'wosp ediq eptp yxhc'
    }
});


exports.getindex = (req, res) => {

    

    // if (!req.session.isLoggedIn) {
    //     return res.redirect('/admin/login');
    // }
    // console.log(req.session.user._id);


    console.log(req.session.user.role);
    if(req.session.user.role == 'admin'){

    Product.find({userId:req.session.user._id}).then(products => {
        res.render('auth/authindex', {
            products: products,
            title: 'Admin Index',
            isAuthenticated: req.session.isLoggedIn,
            csrfToken: req.csrfToken()
        });
    })

    }else{
        res.redirect('/admin/login');
    }
    


   
}

exports.getsignup = (req, res) => {
    res.render('auth/signup',{title: 'Sign Up'});

}

exports.postsignup = async(req, res) => {
    const options = {
        from: 'mohamedy1999.my7753@gmail.com',
        to: req.body.email,
        subject: 'Sending Email using Node.js',
        text: `welcome ${req.body.username}`,
        html: '<h1>Welcome</h1><p>Mohamed yasser grates you</p>'
        
    
    };
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;
    const phone = req.body.phone;
    const country = req.body.country;
    const role = req.body.role;

      const salt = await bcrypt.genSalt(10);
 const hashedpassword = await bcrypt.hash(password,salt)

    const user = new User({
        username: username,
        email: email,
        password: hashedpassword,
        address: address,
        phone: phone,
        country: country,
        role: role
    });
    user.save()
        .then(result => {
            console.log('User Created');

            transporter.sendMail(options, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.redirect('/admin');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getlogin = (req, res) => {
    res.render('auth/login',{title: 'Login'});
}

exports.postlogin = (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('Invalid Email');
                return res.redirect('/admin/login');
            }
const isMatch = bcrypt.compare(password,user.password);

            if (isMatch) {

                return req.session.save(err => {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    //console.log(err);
                    console.log('Logged In');
                    const token = jwt.sign({email,password } , 'jwtsecret', { expiresIn: '1h' })
                    req.session.token = token;
                    if(user.role == 'admin'){
                        return res.redirect('/admin');
                    }
                    else if(user.role == 'user'){
                        return res.redirect('/');
                    }
                    
                });
            }
        
            res.redirect('/admin/login');
        })
        .catch(err => {
            console.log(err);
        });

}

exports.postlogout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/admin/login');
    });
}


exports.getaddproduct = (req, res) => {
    res.render('auth/addproduct',{title: 'Add Product'});
}

exports.postaddproduct = (req, res) => {

    const name = req.body.name;
    const price = req.body.price;
    const image = req.file;
    console.log(image);
    const imageUrl = image.filename;

    const description = req.body.description;
    const category = req.body.category;
    const size = req.body.size;
    const color = req.body.color;
    const stoke = req.body.stock;
    const userId = req.session.user._id;
    const product = new Product({
        name: name,
        price: price,
        image: imageUrl,
        description: description,
        category: category,
        size: size,
        color: color,
        stoke: stoke,
         userId: userId
    });
    product.save()
        .then(result => {
            console.log('Product Created');
            res.redirect('/admin');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.geteditproduct = (req, res) => {
    const prodId = req.params.id;


    // console.log(prodId);

   
    Product.findById(prodId)
        .then(product => {
            res.render('auth/editproduct', {
                product: product,
                title: 'Edit Product'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.posteditproduct = (req, res) => {

    const name = req.body.name;
    const price = req.body.price;
    const image = req.file;
    const imageUrl = image.filename;
    // console.log(req.body.image);

    const prodId = req.body.id;
Product.findByIdAndUpdate(prodId, { name: name, price: price, image: imageUrl})
        .then(result => {
            console.log('Product Updated');
            res.redirect('/admin');
        }
        )
        .catch(err => {
            console.log(err);
        }
        );
}

exports.postdeleteproduct = (req, res) => {

    Product.findByIdAndRemove(req.params.id)
        .then(() => {
            console.log('Product Deleted');
            res.redirect('/admin');
        }
        )
        .catch(err => {
            console.log(err);
        }
        );
}


