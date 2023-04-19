const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

// GET /api/articles/:id - Get single article
router.get("/:id", async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id).lean();
        res.json(article);
    } catch(err) { next(err) }
});

// PUT - /api/articles/:id - Update single article
router.put("/:id", async (req, res, next) => {
    const { author, title, body } = req.body;
    try {
        const updArticle = await Article.findByIdAndUpdate(req.params.id, {
            author, title, body, markedHtml: dompurify.sanitize(marked.parse(body))
        }, { new: true});
        res.json(updArticle);
    } catch (err) { next(err) }
});

// DELETE - /api/articles/:id - Delete single article
router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete({ _id: req.params.id });
    res.json({ message: "Article is now deleted!" })
});

// POST - /api/articles - Add single article
router.post("/", async (req, res, next) => {
    const { author, title, body } = req.body;
    try {
        const newArticle = await Article.create({ author, title, body });
        res.json(newArticle);
    } catch (err) { next(err) }
});

module.exports = router;