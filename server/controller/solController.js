var Docker = require('dockerode');
var docker = new Docker();
// -----------------------------------------------------------
const Testcase = require("../models/TestcaseModel");
const Solution = require("../models/SolutionModel");
const { spawnSync } = require("child_process");
const fs = require('fs');
const path = require('path');
const { generateFile } = require("./generateFile");
const { ObjectId } = require('mongodb')

const outputPath = path.join(__dirname,"outputs");

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive: true});
}

module.exports.SubmitSol = async (req,res) => {
    try{
        const { proid, owner, problem, language, code, verdict, submittedAt } = req.body;
        const sol = await Solution.create({ proid, owner, problem, language, code, verdict, submittedAt });
        res.status(201).json({message: "Solution Submitted",success: true, sol});
        if(code === undefined){
            return res.status(400).json({success: false,error: "empty code"})
        }
        else{
            let problem = new ObjectId(proid);
            const { tests } = await Testcase.findOne({ problem });
            let result = "accepted";
            if(language === "cpp" || language === "c"){
                const filepath = await generateFile(language, code);
                for (var i = 0, l = tests.length; i < l; i++) {
                    var ip = tests[i].input;
                    var op = tests[i].output;
                    const jobId = path.basename(filepath).split('.')[0];
                    const outpath = path.join(outputPath,`${jobId}`);
                    let obj = spawnSync(`g++ ${filepath} -o ${outpath} && ${outpath}`,[],{input:ip,encoding:'utf-8',shell:true});
                    if(obj.error){
                        result = "compilation error";
                        console.log("first: "+obj.error);
                        fs.unlinkSync(outpath);
                        break;
                    }
                    if(obj.stderr !== ''){
                        result = "compilation error";
                        console.log("second: "+obj.stderr);
                        fs.unlinkSync(outpath);
                        break;
                    }
                    if(obj.stdout !== op){
                        result = "wrong answer";
                        fs.unlinkSync(outpath);
                        break;
                    } else{
                        fs.unlinkSync(outpath);
                    }
                }
                fs.unlinkSync(filepath);
                const soldoc = await Solution.findById(sol._id.toString());
                soldoc.set({
                    verdict: result
                })
                await soldoc.save();
            }else if(language === "py"){
                const filepath = await generateFile(language, code);
                for (var i = 0, l = tests.length; i < l; i++) {
                    var ip = tests[i].input;
                    var op = tests[i].output;
                    let obj = spawnSync(`python3 ${filepath}`,[],{input:ip,encoding:'utf-8',shell:true});
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

module.exports.RunInput = async (req,res) => {
    try {
        const { input, language, code } = req.body;
        if(code === undefined){
            return res.status(400).json({error: "empty code"})
        }
        if(language === "cpp" || language === "c"){
            const filepath = await generateFile(language, code);
            const jobId = path.basename(filepath).split('.')[0];
            const outpath = path.join(outputPath,`${jobId}`);
            let obj = spawnSync(`g++ ${filepath} -o ${outpath} && ${outpath}`,[],{input:input,encoding:'utf-8',shell:true});
            fs.unlinkSync(filepath);
            if(obj.error){
                const result = "compilation error";
                console.log("first: "+obj.error);
                return res.status(200).json({result});
            }
            if(obj.stderr !== ''){
                const result = "compilation error";
                console.log("second: "+obj.stderr);
                return res.status(200).json({result});
            }
            fs.unlinkSync(outpath);
            return res.status(200).json({result: obj.stdout});
        }else if(language === "py"){
            const filepath = await generateFile(language, code);
            let obj = spawnSync(`python3 ${filepath}`,[],{input:input,encoding:'utf-8',shell:true});
            fs.unlinkSync(filepath);
            if(obj.error){
                const result = "compilation error";
                return res.status(200).json({result});
            }
            if(obj.stderr !== ''){
                const result = "compilation error";
                return res.status(200).json({result});
            }
            return res.status(200).json({result: obj.stdout});
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports.AllSolForProb = async (req,res) => {
    try {
        const { id } = req.params;
        const list = await Solution.find({problem:id});
        return res.status(200).json({message: "all submissions for this problem",success: true, list});
    } catch (error) {
        console.error(error);
    }
}

module.exports.AllSolForUser = async (req,res) => {
    try {
        const { id } = req.params;
        const list = await Solution.find({owner:id});
        return res.status(200).json({message: "all submissions of this user",success: true, list});
    } catch (error) {
        console.error(error);
    }
}

module.exports.MySolStat = async (req,res) => {
    try {
        const { id } = req.params;
        const doc = await Solution.findById(id.toString());
        return res.status(200).json({message: "verdict of submission",success: true, doc});
    } catch (error) {
        console.error(error);
    }
}

module.exports.DeleteSol = async (req,res) => {
    try {
        const { id } = req.params;
        let prob = new ObjectId(id);
        await Solution.deleteMany({proid:prob});
        return res.status(200).json({message: "solutions deleted successfully",success: true});
    } catch (error) {
        console.error(error);
    }
}

// module.exports.RunInput = async (req,res) => {
//     try {
//         const { input, language, code } = req.body;
//         if(code === undefined){
//             return res.status(400).json({error: "empty code"})
//         }
//         if(language === "cpp" || language === "c"){
//             fs.writeFileSync(`code.${language}`, code);
//             fs.writeFileSync('input.txt', input);
//             var auxContainer;
//             docker.createContainer({
//                 Image: 'gcc',
//                 AttachStdin: false,
//                 AttachStdout: true,
//                 AttachStderr: true,
//                 Tty: true,
//                 Cmd: ['/bin/bash'],
//                 OpenStdin: false,
//                 StdinOnce: false
//             }).then(function(container) {
//                 auxContainer = container;
//                 return auxContainer.start();
//             }).then(function(data) {
//                 let obj = spawnSync(`docker cp code.${language}  ${auxContainer.id}:/code.${language}`,{encoding:"utf-8",shell:true});
//                 obj = spawnSync(`docker cp input.txt  ${auxContainer.id}:/input.txt`,{encoding:"utf-8",shell:true});
//                 obj = spawnSync(`docker exec ${auxContainer.id} g++ code.${language} -o code.exe`,{encoding:"utf-8",shell:true});
//                 obj = spawnSync(`docker cp best.sh ${auxContainer.id}:/best.sh`,{encoding:"utf-8",shell:true});
//                 obj = spawnSync(`docker exec ${auxContainer.id} //bin//sh ./best.sh`,{encoding:"utf-8",shell:true});
//                 obj = spawnSync(`docker cp ${auxContainer.id}:/output.txt output.txt`,{encoding:"utf-8",shell:true});
//                 const ans=fs.readFileSync('output.txt',{ encoding: 'utf8'});
//                 res.status(200).json({result: ans});
//                 fs.unlinkSync(`code.${language}`);
//                 fs.unlinkSync('input.txt');
//                 fs.unlinkSync('output.txt');
//                 return auxContainer.stop();
//             }).then(function(data) {
//                 return auxContainer.remove();
//             }).catch(function(err) {
//                 console.log(err);
//             }); 
//         }else if(language === "py"){
//             fs.writeFileSync(`code.${language}`, code);
//             fs.writeFileSync('input.txt', input);
//             var auxContainer;
//             docker.createContainer({
//                 Image: 'python',
//                 AttachStdin: false,
//                 AttachStdout: true,
//                 AttachStderr: true,
//                 Tty: true,
//                 Cmd: ['/bin/bash'],
//                 OpenStdin: false,
//                 StdinOnce: false
//             }).then(function(container) {
//                 auxContainer = container;
//                 return auxContainer.start();
//             }).then(function(data) {
//                 let obj = spawnSync(`docker cp code.${language}  ${auxContainer.id}:/code.${language}`,{encoding:"utf-8",shell:true});
//                 obj = spawnSync(`docker cp input.txt  ${auxContainer.id}:/input.txt`,{encoding:"utf-8",shell:true});
//                 obj = spawnSync(`docker cp best2.sh ${auxContainer.id}:/best2.sh`,{encoding:"utf-8",shell:true});
//                 obj = spawnSync(`docker exec ${auxContainer.id} //bin//sh ./best2.sh`,{encoding:"utf-8",shell:true});
//                 obj = spawnSync(`docker cp ${auxContainer.id}:/output.txt output.txt`,{encoding:"utf-8",shell:true});
//                 const ans=fs.readFileSync('output.txt',{ encoding: 'utf8'});
//                 res.status(200).json({result: ans});
//                 fs.unlinkSync(`code.${language}`);
//                 fs.unlinkSync('input.txt');
//                 fs.unlinkSync('output.txt');
//                 return auxContainer.stop();
//             }).then(function(data) {
//                 return auxContainer.remove();
//             }).catch(function(err) {
//                 console.log(err);
//             }); 
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

// module.exports.SubmitSol = async (req,res) => {
//     try{
//         const { proid, owner, problem, language, code, verdict, submittedAt } = req.body;
//         const sol = await Solution.create({ proid, owner, problem, language, code, verdict, submittedAt });
//         res.status(201).json({message: "Solution Submitted",success: true, sol});
//         if(code === undefined){
//             return res.status(400).json({success: false,error: "empty code"})
//         }
//         else{
//             let problem = new ObjectId(proid);
//             const { tests } = await Testcase.findOne({ problem });
//             let result = "accepted";
//             if(language === "cpp" || language === "c"){
//                 fs.writeFileSync(`code.${language}`, code);
//                 var auxContainer;
//                 docker.createContainer({
//                     Image: 'gcc',
//                     AttachStdin: false,
//                     AttachStdout: true,
//                     AttachStderr: true,
//                     Tty: true,
//                     Cmd: ['/bin/bash'],
//                     OpenStdin: false,
//                     StdinOnce: false
//                 }).then(function(container) {
//                     auxContainer = container;
//                     return auxContainer.start();
//                 }).then(async(data)=>{
//                     let obj = spawnSync(`docker cp code.${language}  ${auxContainer.id}:/code.${language}`,{encoding:"utf-8",shell:true});
//                     for (var i = 0, l = tests.length; i < l; i++) {
//                         fs.writeFileSync('input.txt', tests[i].input);
//                         obj = spawnSync(`docker cp input.txt  ${auxContainer.id}:/input.txt`,{encoding:"utf-8",shell:true});
//                         obj = spawnSync(`docker exec ${auxContainer.id} g++ code.${language} -o code.exe`,{encoding:"utf-8",shell:true});
//                         obj = spawnSync(`docker cp best.sh ${auxContainer.id}:/best.sh`,{encoding:"utf-8",shell:true});
//                         obj = spawnSync(`docker exec ${auxContainer.id} //bin//sh ./best.sh`,{encoding:"utf-8",shell:true});
//                         obj = spawnSync(`docker cp ${auxContainer.id}:/output.txt output.txt`,{encoding:"utf-8",shell:true});
//                         const ans=fs.readFileSync('output.txt',{ encoding: 'utf8'});
//                         if(tests[i].output !== ans){
//                             result = "wrong answer";
//                             break;
//                         }
//                     }
//                     fs.unlinkSync(`code.${language}`);
//                     fs.unlinkSync('input.txt');
//                     fs.unlinkSync('output.txt'); 
//                     const soldoc = await Solution.findById(sol._id.toString());
//                     soldoc.set({
//                         verdict: result
//                     })
//                     await soldoc.save();
//                     return auxContainer.stop();
//                 }).then(function(data) {
//                     return auxContainer.remove();
//                 }).catch(function(err) {
//                     console.log(err);
//                 }); 
//             }else if(language === "py"){
//                 fs.writeFileSync(`code.${language}`, code);
//                 var auxContainer;
//                 docker.createContainer({
//                     Image: 'python',
//                     AttachStdin: false,
//                     AttachStdout: true,
//                     AttachStderr: true,
//                     Tty: true,
//                     Cmd: ['/bin/bash'],
//                     OpenStdin: false,
//                     StdinOnce: false
//                 }).then(function(container) {
//                     auxContainer = container;
//                     return auxContainer.start();
//                 }).then(async(data)=>{
//                     let obj = spawnSync(`docker cp code.${language}  ${auxContainer.id}:/code.${language}`,{encoding:"utf-8",shell:true});
//                     for (var i = 0, l = tests.length; i < l; i++) {
//                         fs.writeFileSync('input.txt', tests[i].input);
//                         obj = spawnSync(`docker cp input.txt  ${auxContainer.id}:/input.txt`,{encoding:"utf-8",shell:true});
//                         obj = spawnSync(`docker cp best2.sh ${auxContainer.id}:/best2.sh`,{encoding:"utf-8",shell:true});
//                         obj = spawnSync(`docker exec ${auxContainer.id} //bin//sh ./best2.sh`,{encoding:"utf-8",shell:true});
//                         obj = spawnSync(`docker cp ${auxContainer.id}:/output.txt output.txt`,{encoding:"utf-8",shell:true});
//                         const ans=fs.readFileSync('output.txt',{ encoding: 'utf8'});
//                         if(tests[i].output !== ans){
//                             result = "wrong answer";
//                             break;
//                         }
//                     }
//                     fs.unlinkSync(`code.${language}`);
//                     fs.unlinkSync('input.txt');
//                     fs.unlinkSync('output.txt'); 
//                     const soldoc = await Solution.findById(sol._id.toString());
//                     soldoc.set({
//                         verdict: result
//                     })
//                     await soldoc.save();
//                     return auxContainer.stop();
//                 }).then(function(data) {
//                     return auxContainer.remove();
//                 }).catch(function(err) {
//                     console.log(err);
//                 }); 
//             }
//         }
//     }catch(error){
//         console.error(error);
//     }
// }