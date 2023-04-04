const express = require("express");
const { engine } = require("express-handlebars");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
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
app.engine(".hbs", engine({
    extname: ".hbs",
    helpers: {
        isAdmin(user) {
            // console.log(user)
            // console.log(user.role)
            // console.log(user.role === "admin")
            // return user.role === "admin"
            if (user && user.role === "admin") {
                return `
                    <li class="nav-item">
                        <a href="/users" class="nav-link text-white">Manage Users</a>
                    </li>
                `
            }
        }
    }
}));
app.set("view engine", ".hbs")
app.set("views", "./views");

// Flash Messaging Setup
// app.use(cookieParser("secret"));
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    store: new MongoDBStore({
        uri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ccs",
        // uri: "mongodb://127.0.0.1:27017/ccs",
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
app.use("/faqs", require("./routes/faqs"));
app.use("/articles", require("./routes/articles"));
app.use("/event", require("./routes/event"));

// API
app.use("/api/event", require("./api/event"));
app.use("/api/users", require("./api/user"));

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next()
});

app.get("/", async (req, res, next) => {
    try {
        res.render("home", { user: req.user ? req.user: false });
    } catch(err) { next(err) }
});

app.get("/users", async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const users = await User.find().lean();
        users.forEach(user => { user.url = `http://localhost:1000/api/users/${user._id}` });
        res.render("users", { users, user })
    } catch(err) { next(err) }
})

// http://localhost:1000/register - POST - User registration
app.post("/register", async (req, res, next) => {
    try {
        const { email, firstname, lastname, idNumber, username, password } = req.body;
        const isEmailTaken = await User.findOne({ email: email });
        const isUsernameTaken = await User.findOne({ username: username });
        const user = await User.findOne({ firstname: firstname, lastname: lastname });
        if (isUsernameTaken) {
            req.flash("error_msg", "Username is already taken");
            res.redirect("/");
        } else if (user) {
            req.flash("error_msg", "You already have an account");
            res.redirect("/");
        } else if (isEmailTaken) {
            req.flash("error_msg", "Email is already taken");
            res.redirect("/");
        } else {
            const newUser = await User.create({
                email, firstname, lastname, idNumber, username, password
            });
            req.flash("success_msg", "Successfully registered!");
            res.redirect("/");
        }
    } catch(err) { next(err) }
});

app.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
        // successFlash: true,
        failureFlash: true
    })(req, res, next);
});

app.delete("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) { return next(err) }
    });
    res.redirect("/");
});

app.get("/profile", checkAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).lean();
        // console.log(user)
        res.render("profile", { user });
    } catch(err) { next(err) }
});

app.put("/profile", checkAuthenticated, async (req, res) => {
    try {
        const updUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        // console.log(updUser);
        req.flash("success_msg", "Profile has been updated");
        res.redirect("/profile");
    } catch(err) { next(err) }
});

app.get("/dashboard", checkAuthenticated, async (req, res, next) => {
    try {
        // if (req.user.role === "student") {
        if (req.user.role === "student") {
            const events = await Event.find({ date: { $gte: new Date() } }).populate("reservers").lean();
            // const events = await Event.find().populate("reservers").lean();
            events.forEach(event => event.userID = req.user._id);
            // events.forEach(event => event.userID = "64108c29baa28ce45b57c7bf");
            res.render("student/dashboard", {
                user: req.user,
                events,
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
                    }
                }
            });
        } else {
            const events = await Event.find().sort({ date: -1 }).lean();
            events.forEach(event => event.url = process.env.NODE_ENV === "development" ? `http://localhost:1000/api/event/${event._id}`: `https://ccs-icct-tech-guild.onrender.com/api/event/${event._id}`);
            const user = await User.findById(req.user._id);
            res.render("admin/dashboard", { user, events });
            // res.render("admin/dashboard", { events });
        }
    } catch(err) { next(err) }

});

app.get("/api/event/:id", async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        res.json(event)
    } catch (err) { next(err) }
});

// app.get("/downloadable-forms", (req, res) => {
//     res.render("downloadble-forms", { userLogged: req.user });
// });

app.get("/ces", (req, res) => {
    res.render("ces");
});

// Handles non-existing route
app.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);
  });
  
// Error handler middleware
app.use((err, req, res, next) => {
    console.log(err)
    if (err.status === 404) {
        res.status(err.status).render("error", { err });
        return;
    }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));