const express = require("express");
const router = express.Router();
const User = require("../models/User");

// http://localhost:1000/api/users/:id
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch(err) { next(err) }
});

// http://localhost:1000/api/users/:id
router.put("/:id", async (req, res) => {
    try {
        const updUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updUser);
    } catch(err) { next(err) }
});

// http://localhost:1000/api/users
router.get("/", async (req, res) => {
    try {
        // const user = await User.findOne(req.query);
        const users = await User.find();
        res.json({ usersCount: users.length, users })
    } catch(err) { next(err) }
});

module.exports = router;