
const LocalStrategy = require('passport-local').Strategy;
const User = require('../db/userModel');


module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    })

    passport.deserializeUser((user, done) => {
        done(null, user);
    })

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (username, password, done) => {
        console.log('username ', username, 'password ', password);
        User.findOne({ email: username }, (err, user) => {
            if (err) { return done(err) }
            else {
                if (user) {
                    console.log(user.password);
                    const hasPerm = user.validatePassword(password, user.password);
                    if (!hasPerm) {
                        return done(null, false);
                    }
                } else {
                    console.log('You cannot log in');
                }
            }
            console.log('yes you passed every test');
            return done(null, user);
        })
    }))
}