import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GetProb, VerifyUser } from "../services/api";
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

    useEffect(()=>{
        const getProb = async () => {
            const resp = await GetProb(id);
            setProName(resp.doc.proname);
            setProStat(resp.doc.statement);
            setProConst(resp.doc.constraints);
            setDiff(resp.doc.difficulty);
            setWriter(resp.doc.writer);
        }
        getProb();
    },[id]);
    
    const handleSubmit = async () => {
        if(token.token === ""){
            navigate("/login");
        }
        const data = { token: token.token };
        const { status, user } = await VerifyUser(data);
        if(!status){
            dispatch(logoutUser());
            navigate("/login");
        }
        setUName(user); 
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div>
                    <div>
                        {proName}
                    </div>
                    <div>
                        {proStat}
                    </div>
                    <div>
                        {proConst}
                    </div>
                    <div>
                        {diff}
                    </div>
                    <div>
                        {writer}
                    </div>
                </div>
                <div>
                    <Link to={`/AllSubmissions/${proName}`} className="border">Submissions</Link>
                </div>
            </div>
            <div className="d-flex flex-row">
                <form className="d-flex flex-column">
                    <div className="my-2 ml-5">
                        <select value={language} className="bg-gray-300" onChange={(ev)=>setLanguage(ev.target.value)}>
                            <option value="c">C</option>
                            <option value="cpp">C++</option>
                            <option value="py">Python</option>
                        </select>
                    </div>
                    <div>
                        <textarea value={code} onChange={(ev)=>setCode(ev.target.value)} className="ml-5 bg-gray-300" rows="25" cols="100"></textarea>
                    </div>
                </form>
                <button onClick={handleSubmit} className="border">Submit</button>
            </div>
        </div>
    );
}