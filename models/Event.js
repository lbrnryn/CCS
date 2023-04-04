const mongoose = require("mongoose");

const event = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    time: String,
    reservers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    absentees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rationale: String,
    objectives: String,
    guidelines: String,
    room: String
}, { timestamps: true });

module.exports = mongoose.model("Event", event);