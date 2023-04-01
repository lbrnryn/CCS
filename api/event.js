const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");

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

module.exports = router;