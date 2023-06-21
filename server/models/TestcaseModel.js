const mongoose = require("mongoose");

const testcaseSchema = new mongoose.Schema({
    
    tests:[
        {
            input:{
                type: String,
                required: true,
            },
            output:{
                type: String,
                required: true,
            },
        }
    ]
});

module.exports = mongoose.model("Testcase", testcaseSchema);