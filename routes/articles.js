const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const User = require("../models/User");

const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

// GET - http://localhost:1000/articles
router.get("/", async (req, res, next) => {
    try {
        const userLogged = req.user ? true: false;
        const user = userLogged ? await User.findById(req.user._id): false;
        const articles = await Article.find({ isApproved: true}).populate("author").lean();
        res.render("articles", { articles, user });
    } catch (err) { next(err) }
});

module.exports = router;