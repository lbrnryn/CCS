const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.route('/:id')
    // Get a user
    .get(async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.json(user);
        } catch(err) { next(err) }
    })
    // Update a user
    .put(async (req, res) => {
        try {
            const updUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updUser);
        } catch(err) { next(err) }
    })
    // Delete a user
    .delete(async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
        } catch (err) { next(err) }
    })

// Get users /api/users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch(err) { next(err) }
});

module.exports = router;