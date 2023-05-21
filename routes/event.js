const express = require("express");
const url = require('url');
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const { listofReserversHelper } = require("../templateHelper");
const checkAuthenticated = require("../middleware.js"); 

// /event/:id
router.route("/:id")
    .get(checkAuthenticated, async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id).lean();
            const event = await Event.findById(req.params.id).populate("reservers").populate("attendees").populate("absentees").lean();
            res.render("event", {
                user,
                event,
                helpers: {
                    listofReservers(reservers, eventID) {
                        return listofReserversHelper({ reservers, eventID })
                    }
                }
            });
        } catch (err) { next(err) }
    })

module.exports = router;