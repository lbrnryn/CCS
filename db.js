const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
    try {
        // await mongoose.connect("mongodb://127.0.0.1:27017/ccs");
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ccs");
        console.log("Database connected!")
    } catch(err) { console.log(err) }
}
mongoose.set('strictQuery', true);

module.exports = main;