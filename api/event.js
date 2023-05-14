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

// /api/event/:id
router.route('/:id')
    // Get an event
    .get(async (req, res, next) => {
        try {
            const event = await Event.findById(req.params.id);
            res.json(event)
        } catch (err) { next(err) }
    })
    // Update an event
    .put(async (req, res, next) => {
        try {
            const updEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updEvent)
        } catch(err) { next(err) }
    })
    // Delete an event
    .delete(async (req, res, next) => {
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

// /api/event/:id/reserver
router.route('/:id/reserver')
    // Add reservers in event
    .put(async (req, res, next) => {
        try {
            const { userID } = req.body;
            const user = await User.findById(userID);
            const updEvent = await Event.findByIdAndUpdate(req.params.id, {
                $push: { reservers: userID }
            }, { new: true });
            res.json({ updEvent, user })
            // req.flash("success_msg", "You successfully reserved a seat")
        } catch(err) { next(err) }
    })
    // Remove reservers in event
    .delete(async (req, res, next) => {
        try {
            const { userID } = req.body;
            await Event.findByIdAndUpdate(req.params.id, {
                $pull: { reservers: userID }
            }, { new: true });

            // if (url.parse(req.headers.referer).pathname === "/dashboard") {
            //     req.flash("error_msg", "Your seat reservation is now cancelled")
            //     res.redirect("/dashboard");
            // } else {
            //     res.redirect(`/event/${req.params.id}`);
            // }
        } catch (err) { next(err) }
    })

module.exports = router;