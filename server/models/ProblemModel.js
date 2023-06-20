const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    writer: {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User'
    },
    proname: {
        type: String,
        required: [true, "problem name is required"],
        unique: true,
    },
    statement: {
        type: String,
        required: [true, "Problem statement is required"],
    },
    constraints: {
        type: String,
    },
    difficulty: {
        type: String,
        default: "Medium",
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

module.exports = mongoose.model("Problem", problemSchema);