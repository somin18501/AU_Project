const Problem = require("../models/ProblemModel");
const Testcase = require("../models/TestcaseModel");
const Solution = require("../models/SolutionModel");

module.exports.SubmitSol = async (req,res) => {
    try{
        const { owner, problem, code, verdict, submittedAt } = req.body;
        const sol = await Solution.create({ owner, problem, code, verdict, submittedAt });
        res.status(201).json({message: "Solution Submitted",success: true, sol});
        const { tests } = await Testcase.findOne({ problem });
        
    }catch(error){
        console.error(error);
    }
}