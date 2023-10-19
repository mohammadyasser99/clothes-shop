const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

 const User = require('./models/user');

passport.use(
    new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_iD ,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET ,
        callbackURL: process.env.GOOLE_CALLBACK_URL,
        passReqToCallback:true,

    },function(req,accessToken,refreshToken,profile,done){
        console.log(profile);
        return done(null,profile);
        // User.findOne({googleId:profile.id}).then(function(user){
        //     if(user){
        //         return done(null,user);
        //     }
        //     const user1 = new User({
        //         username:profile.displayName,
        //         email:profile.emails[0].value,
        //         googleId:profile.id,
        //         role:'user'
        //     });
        //     user1.save().then(function(result){
        //         return done(null,user1);
        //     })
        // })
    })
)

passport.serializeUser(function(user,done){
    done(null,user);
})

passport.deserializeUser(function(user,done){
    done(null,user);
})


   

