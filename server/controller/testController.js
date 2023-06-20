const fs = require("fs");
const path = require("path");
const Testcase = require("../models/TestcaseModel");

module.exports.uploadFile = async (req,res) => {
    try {
        const { problem } = req.body;
        const existingProname = await Testcase.findOne({ problem });
        if (existingProname) {
            fs.unlinkSync(req.files.file.tempFilePath);
            return res.json({ message: "Testcases already defined",success: false });
        }else{
            let fileName = req.files.file.name;
            const parts = fileName.split(".");
            const ext = parts[parts.length - 1];
            const newName = "tests."+ext;
            let newPath = path.join(process.cwd(),'public',newName);
            req.files.file.mv(newPath);
            let rawdata = fs.readFileSync(`${newPath}`);
            let arr = JSON.parse(rawdata);
            fs.unlinkSync(newPath);
            const test = await Testcase.create({ problem, tests: arr });
            return res.status(201).json({message: "Testcases added successfully",success: true, test});
        }
    } catch (error) {
        console.error(error);
    }
}