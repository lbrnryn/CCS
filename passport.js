const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local");
const User = require("./models/User");

module.exports = function (passport) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({username: username});
            // console.log('passport', user)
            if (!user) { return done(null, false, { message: "No User Found" }) }
            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isMatch) { return done(null, false, { message: 'Incorrect password' }) }
            return done(null, user, { message: `Welcome ${user.username}` });
        } catch(err) { return done(err) }
    }));
    
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user)
        } catch (err) { done(err) }
    });
}