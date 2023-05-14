const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

// /api/articles/:id
router.route('/:id')
    // Get an article
    .get(async (req, res, next) => {
        try {
            const article = await Article.findById(req.params.id).lean();
            res.json(article);
        } catch(err) { next(err) }
    })
    // Update an article
    .put(async (req, res, next) => {
        const { author, title, body } = req.body;
        try {
            const updArticle = await Article.findByIdAndUpdate(req.params.id, {
                author, title, body, markedHtml: dompurify.sanitize(marked.parse(body))
            }, { new: true});
            res.json(updArticle);
        } catch (err) { next(err) }
    })
    // Delete an article
    .delete(async (req, res) => {
        try {
            await Article.findByIdAndDelete({ _id: req.params.id });
            res.json({ message: "Article is now deleted!" });
        } catch (err) { next(err) }
    })

// POST - /api/articles - Add single article
router.post("/", async (req, res, next) => {
    const { author, title, body } = req.body;
    try {
        const newArticle = await Article.create({ author, title, body });
        res.json(newArticle);
    } catch (err) { next(err) }
});

module.exports = router;