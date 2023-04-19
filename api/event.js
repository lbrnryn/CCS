const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");

// Add event - POST /api/event
router.post("/", async (req, res, next) => {
    try {
        const event = await Event.create(req.body);
        res.json(event)
        // res.redirect("/dashboard");
    } catch(err) { next(err) }
});

// Update event - PUT /api/event
router.put("/:id", async (req, res, next) => {
    try {
        const updEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updEvent)
    } catch(err) { next(err) }
});

// Delete event - DELETE /api/event
router.delete("/:id", async (req, res, next) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
    } catch(err) { next(err) }
});

// PUT /api/event/:id/attendee - Add attendees in event 
router.put("/:id/attendee", async (req, res, next) => {
    try {
        const { reserverID } = req.body;
        await Event.findByIdAndUpdate(req.params.id, {
            $pull: { reservers: reserverID },
            $push: { attendees: reserverID }
        });

        const attendee = await User.findById({ _id: reserverID });
        res.json(attendee)

    } catch(err) { next(err) }
});

// PUT /api/event/:id/absentee - Add absentees in event 
router.put("/:id/absentee", async (req, res, next) => {
    try {
        const { reserverID } = req.body;
        await Event.findByIdAndUpdate(req.params.id, {
            $pull: { reservers: reserverID },
            $push: { absentees: reserverID }
        });

        const attendee = await User.findById({ _id: reserverID });
        res.json(attendee)

    } catch(err) { next(err) }
});

module.exports = router;