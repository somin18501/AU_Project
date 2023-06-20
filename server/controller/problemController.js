const Problem = require("../models/ProblemModel");

module.exports.AddProblem = async (req,res,next) => {
    try{
        const { writer, proname, statement, constraints, difficulty, createdAt } = req.body;
        const existingProname = await Problem.findOne({ proname });
        if (existingProname) {
            return res.json({ message: "Problem Name already exists" });
        }
        const prob = await Problem.create({ writer, proname, statement, constraints, difficulty, createdAt });
        res.status(201).json({message: "Problem added successfully",success: true, prob});
        next()
    }catch(error){
        console.error(error);
    }
}