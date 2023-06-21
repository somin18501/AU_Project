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

module.exports.ListAllProblem = async (req,res) => {
    try {
        const list = await Problem.find();
        return res.status(200).json({message: "list of problems",success: true, list});
    } catch (error) {
        console.error(error);
    }
}

module.exports.ListSingleProblem = async (req,res) => {
    try {
        const { id } = req.params;
        const doc = await Problem.findById(id);
        if(doc){
            return res.status(200).json({message: "specific problem",success: true, doc});
        }else{
            return res.status(400).json({message: "no such problem exists",success: false});
        }
    } catch (error) {
        console.error(error);
    }
}