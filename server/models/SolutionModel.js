const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema({
    owner: {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User'
    },
    problem: {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Problem'
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