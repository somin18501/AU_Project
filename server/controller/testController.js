const fs = require("fs");
const path = require("path");
const Testcase = require("../models/TestcaseModel");
const { ObjectId } = require('mongodb')

module.exports.uploadFile = async (req,res) => {
    try {
        const { problem } = req.body;
        let prob = new ObjectId(problem);
        let fileName = req.files.file.name;
        let uploadPath = path.join(__dirname, "public");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        const parts = fileName.split(".");
        const ext = parts[parts.length - 1];
        const newName = "tests."+ext;
        uploadPath = path.join(uploadPath,newName);
        await req.files.file.mv(uploadPath);
        let arr = JSON.parse(fs.readFileSync(`${uploadPath}`,"utf-8"));
        const test = new Testcase({ problem: prob, tests: arr });
        test.save()
        fs.unlink(uploadPath, (err) => {});
        return res.status(201).json({message: "Testcases added successfully",success: true});
    } catch (error) {
        console.error(error);
    }
}

module.exports.DeleteTest = async (req,res) => {
    try {
        const { id } = req.params;
        let prob = new ObjectId(id); 
        await Testcase.deleteOne({problem:prob});
        return res.status(200).json({message: "testcases deleted successfully",success: true});
    } catch (error) {
        console.error(error);
    }
} 