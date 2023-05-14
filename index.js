const express = require("express");
const { engine } = require("express-handlebars");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
require("./db")()
require("./passport")(passport);
const methodOverride = require("method-override");
const url = require("url");
require("dotenv").config();
const { reservationStatusHelper, formatDateHelper, formatTimeHelper, isCurrentUserReservedHelper, listofReserversHelper, formatToListHelper } = require("./templateHelper");

// Models
const User = require("./models/User");
const Event = require("./models/Event");
const Article = require("./models/Article");

const app = express();

// Set static folder
app.use(express.static("public"));
app.use("/images", express.static("public"));
app.use("/articles", express.static("public"));
app.use("/articles/edit", express.static("public"));
app.use("/faqs/:id", express.static("public"));
app.use("/event", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("json spaces", 2);

// Express handlebars setup
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs")
app.set("views", "./views");

// Flash Messaging Setup
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
        uri: "mongodb://127.0.0.1:27017/ccs" || process.env.MONGO_URI,
        collection: "sessions"
    })
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));

// Custom Middleware
const checkAuthenticated = require("./middleware.js");  

// Routers
app.use("/articles", require("./routes/articles"));
app.use("/event", require("./routes/event"));

// API
app.use("/api/event", require("./api/event"));
app.use("/api/users", require("./api/user"));
app.use("/api/articles", require("./api/article"));

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next()
});

app.get("/", async (req, res, next) => {
    try {
        res.render("home", { user: req.user ? req.user: false, script: './home.js' });
    } catch(err) { next(err) }
});

app.get("/users", async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).lean();
        const users = await User.find().lean();
        res.render("users", { users, user, script: "./admin/users.js" })
    } catch(err) { next(err) }
})

// /register - POST - User registration
app.post("/register", async (req, res, next) => {
    try {
        const { email, firstname, lastname, idNumber, username, password } = req.body;
        const isEmailTaken = await User.findOne({ email: email });
        const isUsernameTaken = await User.findOne({ username: username });
        const user = await User.findOne({ firstname: firstname, lastname: lastname });

        if (isEmailTaken) { 
            return res.json({ success: false, message: 'Email is already taken', errorIn: 'email' })
        }

        if (isUsernameTaken) { 
            return res.json({ success: false, message: 'Username is already taken', errorIn: 'username' })
        }
        
        await User.create(req.body);
        res.json({ success: true, message: 'Successfully registered!' });
        // if (user) { 
        //     return res.json({ success: false, message: 'You already have an account', errorIn: 'username' }) 
        // }
    } catch(err) { next(err) }
});

app.post("/login", (req, res, next) => {
    // passport.authenticate("local", {
    //     successRedirect: "/dashboard",
    //     failureRedirect: "/",
    //     failureFlash: true
    // })(req, res, next);

    passport.authenticate('local', function(err, user, info) {
        // console.log('info', info)
        if (err) { next(err) }
        // if (!user) { return res.status(401).json({ message: 'Authentication failed' }) }
        if (!user) { return res.status(401).json({ message: info.message }) }
        // console.log('passport.authenticate', user);
        // res.json({ redirectUrl: '/dashboard' });
        req.login(user, (err) => {
            if (err) { return next(err) }
            req.flash('success_msg', info.message);
            return res.json({ redirectUrl: '/dashboard' });
        });
    })(req, res, next);
});

app.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err) }
        res.redirect("/");
    });
});

app.route('/profile')
    .get(checkAuthenticated, async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id).lean();
            res.render("profile", { user });
        } catch(err) { next(err) }
    })
    .put(checkAuthenticated, async (req, res, next) => {
        try {
            const updUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
            req.flash("success_msg", "Profile has been updated");
            res.redirect("/profile");
        } catch(err) { next(err) }
    })

app.get("/dashboard", checkAuthenticated, async (req, res, next) => {
// app.get("/dashboard", async (req, res, next) => {
    try {
        // console.log('req.isAuthenticated', req.isAuthenticated())
        // console.log('dashboard', req.user)
        if (req.user.role === "student") {
            // const events = await Event.find({ date: { $gte: new Date() } }).populate("reservers").lean();
            const events = await Event.find().populate("reservers").lean();
            events.forEach(event => event.userID = req.user._id);
            // const articles = await Article.find({ author: req.user._id }).populate("author").lean();
            res.render("student/dashboard", {
                user: req.user,
                events,
                // articles,
                script: "./student/dashboard.js",
                helpers: {
                    reservationStatus(reservers) {
                        return reservationStatusHelper(reservers)
                    },
                    formatDate(date) {
                        return formatDateHelper(date)
                    },
                    formatTime(time) {
                        return formatTimeHelper(time)
                    },
                    isCurrentUserReserved(reservers, currentUserID, eventID) {
                        return isCurrentUserReservedHelper(reservers, currentUserID, eventID)
                    },
                    listofReservers(reservers, currentUserID, eventID) {
                        return listofReserversHelper({ reservers, currentUserID, eventID })
                    },
                    formatToList(paragraph) {
                        return formatToListHelper(paragraph)
                    },
                    approvedRejected(isApproved, isRejected) {
                        // if (!isApproved) { return `<span class="badge bg-secondary">Waiting for Approval</span>` }
                        if (isRejected) {
                            return `<span class="badge bg-danger">Rejected</span>`
                        } else if (isApproved) {
                            return `<span class="badge bg-success">Published</span>` 
                        } else {
                            return `<span class="badge bg-secondary">Waiting for Approval</span>`
                        }
                    }
                }
            });
        } else {
            const events = await Event.find().sort({ date: -1 }).lean();
            const user = await User.findById(req.user._id);
            const articles = await Article.find({ isApproved: false }).populate("author").lean();
            res.render("admin/dashboard", { user, admin: true, events, articles, script: "./admin/dashboard.js" });
        }
    } catch(err) { next(err) }

});

app.get("/ces", (req, res) => {
    res.render("ces");
});

app.get('/pagenotfound', (req, res) => {
    res.render('pagenotfound');
});

// Handles non-existing route
app.use((req, res, next) => {
    res.status(404).redirect('/pagenotfound');
    next();
});
  
// Error handler middleware
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).render('error', { err })
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));