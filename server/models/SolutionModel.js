const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema({
    proid: {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Problem'
    },
    owner: {
        type: String, 
        required: true,
    },
    problem: {
        type: String, 
        required: true,
    },
    language: {
        type: String,
        required: [true, "language is required"],
    },
    code: {
        type: String,
        required: [true, "code is required"],
    },
    verdict: {
        type: String,
        default: "pending",
    },
    submittedAt: {
        type: Date,
        default: new Date(),
    },
});

module.exports = mongoose.model("Solution", solutionSchema);