const { Signup, Login } = require("../controller/AuthController");
const { AddProblem, ListAllProblem, ListSingleProblem } = require("../controller/problemController");
const { SubmitSol, AllSolForProb, MySolStat, RunInput, AllSolForUser } = require("../controller/solController");
const { uploadFile } = require("../controller/testController");
const { userVerification } = require("../middleware/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post('/login', Login);

router.post('/addproblem', AddProblem);
router.post('/upload', uploadFile);

router.post('/submit', SubmitSol);
router.post('/run', RunInput);

router.get('/allproblems', ListAllProblem);
router.get('/singleproblem/:id', ListSingleProblem);

router.get('/allsolproblem/:id', AllSolForProb);
router.get('/allsoluser/:id', AllSolForUser);
router.get('/mysolstat/:id', MySolStat);

router.post('/',userVerification);

module.exports = router;