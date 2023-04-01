const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const { listofReserversHelper } = require("../templateHelper");
const checkAuthenticated = require("../middleware.js"); 

// /event/:id
router.route("/:id")
    .get(checkAuthenticated, async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id);
            const event = await Event.findById(req.params.id).populate("reservers").populate("attendees").lean();
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
    .put(async (req, res) => {
        try {
            const updEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.redirect("/dashboard");
        } catch (err) { next(err) }
    })
    .delete(async (req, res) => {
        try {
            await Event.findByIdAndDelete(req.params.id);
            res.redirect("/dashboard");
        } catch(err) { next(err) }
    })

// /event
router.post("/", async (req, res, next) => {
    try {
        const event = await Event.create(req.body);
        res.redirect("/dashboard");
    } catch(err) { next(err) }
});

// PUT /event/:id/reserver - Add reservers in event 
router.put("/:id/reserver", async (req, res, next) => {
    try {
        const { userID } = req.body;
        const updEvent = await Event.findByIdAndUpdate(req.params.id, {
            $push: { reservers: userID }
        }, { new: true });
        req.flash("success_msg", "You successfully reserved a seat")
        res.redirect("/dashboard");
    } catch(err) { next(err) }
});

// DELETE /event/:id/reserver - Remove reservers in event 
router.delete("/:id/reserver", async (req, res, next) => {
    try {
        const { userID } = req.body;
        const updEvent = await Event.findByIdAndUpdate(req.params.id, {
            $pull: { reservers: userID }
        }, { new: true });

        if (url.parse(req.headers.referer).pathname === "/dashboard") {
            req.flash("error_msg", "Your seat reservation is now cancelled")
            res.redirect("/dashboard");
        } else {
            res.redirect(`/event/${req.params.id}`);
        }
    } catch (err) { next(err) }
});

module.exports = router;

// GET /event/:id
// router.get("/:id", checkAuthenticated, async (req, res, next) => {
//     try {
//         const user = await User.findById(req.user._id);
//         const event = await Event.findById(req.params.id).populate("reservers").populate("attendees").lean();
//         res.render("event", {
//             user,
//             event,
//             helpers: {
//                 listofReservers(reservers, eventID) {
//                     return listofReserversHelper({ reservers, eventID })
//                 }
//             }
//         });
//     } catch (err) { next(err) }
// });

// PUT /event/:id
// router.put("/:id", async (req, res) => {
//     try {
//         console.log(req.body.time)
//         console.log(typeof req.body.time)
//         const updEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.redirect("/dashboard");
//     } catch (err) { next(err) }
// });

// DELETE /event/:id
// router.delete("/:id", async (req, res) => {
//     try {
//         await Event.findByIdAndDelete(req.params.id);
//         res.redirect("/dashboard");
//     } catch(err) { next(err) }
// });