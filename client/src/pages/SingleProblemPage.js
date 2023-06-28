import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChkSolStat, GetProb, PostCodeForRun, SubmitSol, VerifyUser } from "../services/api";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions";

export default function SingleProblem(){
    
    const { id } = useParams();
    const [proName,setProName] = useState('');
    const [proStat,setProStat] = useState('');
    const [proConst,setProConst] = useState('');
    const [diff,setDiff] = useState('');
    const [uname,setUName] = useState('');
    const [writer,setWriter] = useState('');
    const token = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [language,setLanguage] = useState('c');
    const [code,setCode] = useState('');
    const [stat,setStatus] = useState('');
    const [input,setInput] = useState('');
    const [output,setOutput] = useState('');

    useEffect(()=>{
        const getProb = async () => {
            const resp = await GetProb(id);
            setProName(resp.doc.proname);
            setProStat(resp.doc.statement);
            setProConst(resp.doc.constraints);
            setDiff(resp.doc.difficulty);
            setWriter(resp.doc.writer);
            if(token.token !== ""){
                const data = { token: token.token };
                const { status, user } = await VerifyUser(data);
                if(!status){
                    dispatch(logoutUser());
                    navigate("/login");
                }
                setUName(user); 
            }else{
                setUName('random');
            }
        }
        getProb();
    },[uname]);
    
    const handleSubmit = async () => {
        if(token.token === ""){
            navigate("/login");
        }
        if(language && code && uname){
            const data = {
                proid: id,
                owner: uname,
                problem: proName,
                language: language,
                code: code,
            }
            const { sol } = await SubmitSol(data);
            let intervalID = setInterval( async () => {
                const { doc } = await ChkSolStat(sol._id);
                if (doc.verdict !== "pending") {
                    clearInterval(intervalID); 
                    setStatus(doc.verdict);
                }
            }, 1000);
        }
    }

    const handleRun = async () => {
        if(language && code){
            const data = {
                input: input,
                language: language,
                code: code,
            }
            const resp = await PostCodeForRun(data);
            setOutput(resp.result);
        }
    }

    return (
        <div className="flex flex-col text-white">
            <div className="flex flex-row justify-between mt-10">
                <div className="ml-24">
                    <div className="text-3xl mb-2">
                        {proName}
                    </div>
                    <div className="text-xl my-4">
                        {proStat}
                    </div>
                    <div className="text-lg my-4">
                        {proConst}
                    </div>
                    <div>
                        Writer: {writer}
                    </div>
                </div>
                <div>
                    {diff}
                </div>
                <div className="mr-24">
                    <Link to={`/AllSubmissions/${proName}`} className="mt-1 border-2 rounded-lg p-2">Submissions</Link>
                </div>
            </div>
            <div className="flex flex-row justify-around">
                <div>
                    <form className="flex flex-col">
                        <div className="my-2 ml-5">
                            <select value={language} className="bg-white text-black rounded-lg" onChange={(ev)=>setLanguage(ev.target.value)}>
                                <option value="c">C</option>
                                <option value="cpp">C++</option>
                                <option value="py">Python</option>
                            </select>
                        </div>
                        <div>
                            <textarea value={code} onChange={(ev)=>setCode(ev.target.value)} className="ml-5 bg-white text-black rounded-lg" rows="25" cols="100"></textarea>
                        </div>
                    </form>
                    <div className="flex flex-row">
                        <button onClick={handleSubmit} className="border-2 rounded-lg m-2 ml-6 p-2">Submit</button>
                        {
                            stat !== '' && (
                                <div className="ml-4 mt-4">
                                    Verdict: Your Solution got {stat}!!!
                                </div>
                            )
                        }
                    </div>
                </div>
                <div>
                    <form>
                        <div className="mt-6">
                            <p>Input</p>
                            <textarea className="bg-white text-black rounded-lg mr-4 mt-2" value={input} onChange={(ev)=>setInput(ev.target.value)} rows="10"></textarea>
                        </div>
                        <div className="mt-2">
                            <p>Output</p>
                            <textarea
                                defaultValue={output}
                                className="bg-white text-black rounded-lg mr-4 mt-2"
                                rows={10}
                            />
                        </div>
                    </form>
                    <button onClick={handleRun} className="mt-1 border-2 rounded-lg p-2">Run</button>
                </div>
            </div>
            
        </div>
    );
}