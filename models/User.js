const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstname: { type: String, lowercase: true, trim: true },
    lastname: { type: String, lowercase: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    idNumber: { type: String, lowercase: true, trim: true },
    username: String,
    password: String,
    hashedPassword: String,
    role: { type: String, default: "student" }
}, { timestamps: true });

userSchema.pre("save", async function() {
    const salt = await bcrypt.genSalt(10);
    this.hashedPassword = await bcrypt.hash(this.password, salt);
})

module.exports = mongoose.model("User", userSchema);