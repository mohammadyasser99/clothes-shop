const express = require('express');
const app = express();
const port = 3000;
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const authroutes = require('./routes/authroutes.js');
const auth = require('./middleware/auth.js');
const csrf = require('csurf');
 const passport = require('passport');
require('dotenv').config()
require('./passport-setup.js');


const filefilter = (req,file,cb)=>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jfif'){
    cb(null,true);
  }
  else{
    cb(null,false);
  }
}

const filestorage = multer.diskStorage({destination:(req,file,cb)=>{
  cb(null,'images'); },
  
  filename:(req,file,cb)=>{
    cb(null,file.fieldname + '-' + file.originalname);
  }

});
const publicroutes = require('./routes/publicroute.js');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');
app.use(bodyParser.urlencoded({ extended: true }));
const csrfProtection = csrf();

app.use(multer({storage:filestorage,fileFilter:filefilter}).single('image'));


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/images'));

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', 'views');



  


// const auth = require('./middleware/auth');
// const MONGODB_URI='mongodb://127.0.0.1:27017/clothesshop'
const MONGODB_URI = process.env.MONGO_URL ;

const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri:MONGODB_URI,
  collection:'sessions',

});

app.use(session({secret:'my secret',resave:false,saveUninitialized:false,store:store}))

app.use(csrfProtection);
app.use((req,res,next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.session = req.session.cart;
  res.locals.csrfToken = req.csrfToken();
  next();
})



app.use("/" ,publicroutes)
app.use("/admin",authroutes)

// app.use(passport.initialize());
// app.use(passport.session())

// app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     req.session.isLoggedIn = true;
//     req.session.user = req.user;
//     res.redirect('/');
//   });




mongoose
  .connect(
    MONGODB_URI
  )
  .then(result => {
  const server =  app.listen(3000);
    console.log('connected');

  })
  .catch(err => {
    console.log(err);
  });

