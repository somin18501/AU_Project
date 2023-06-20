const Testcase = require("../models/TestcaseModel");
const Solution = require("../models/SolutionModel");
const { spawnSync } = require("child_process");
const fs = require('fs');
const path = require('path');
const { generateFile } = require("./generateFile");

const outputPath = path.join(__dirname,"outputs");

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive: true});
}

module.exports.SubmitSol = async (req,res) => {
    try{
        const { owner, problem, language, code, verdict, submittedAt } = req.body;
        const sol = await Solution.create({ owner, problem, language, code, verdict, submittedAt });
        res.status(201).json({message: "Solution Submitted",success: true, sol});
        if(code === undefined){
            return res.status(400).json({success: false,error: "empty code"})
        }
        else{
            const { tests } = await Testcase.findOne({ problem });
            let result = "accepted";
            if(language === "cpp"){
                const filepath = await generateFile(language, code);
                for (var i = 0, l = tests.length; i < l; i++) {
                    var ip = tests[i].input;
                    var op = tests[i].output;
                    const jobId = path.basename(filepath).split('.')[0];
                    const outpath = path.join(outputPath,`${jobId}.exe`);
                    let obj = spawnSync(`g++ ${filepath} -o ${outpath} && cd ${outputPath} && ${jobId}.exe`,[],{input:ip,encoding:'utf-8',shell:true});
                    fs.unlinkSync(outpath);
                    if(obj.error){
                        result = "compilation error";
                        break;
                    }
                    if(obj.stderr !== ''){
                        result = "compilation error";
                        break;
                    }
                    if(obj.stdout !== op){
                        result = "wrong answer";
                        break;
                    } 
                }
                fs.unlinkSync(filepath);
                const soldoc = await Solution.findById(sol._id.toString());
                soldoc.set({
                    verdict: result
                })
                await soldoc.save();
            }
        }
    }catch(error){
        console.error(error);
    }
}