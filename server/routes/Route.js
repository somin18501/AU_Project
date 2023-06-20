const { Signup, Login } = require("../controller/AuthController");
const { AddProblem } = require("../controller/problemController");
const { SubmitSol } = require("../controller/solController");
const { uploadFile } = require("../controller/testController");
const { userVerification } = require("../middleware/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post('/login', Login);
router.post('/addproblem', AddProblem);
router.post('/upload', uploadFile);
router.post('/submit', SubmitSol);
router.post('/',userVerification);

module.exports = router;