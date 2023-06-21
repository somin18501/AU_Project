import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetProSol, VerifyUser } from "../services/api";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions";

export default function AllSubmissionPage(){
    const { id } = useParams();
    const [solArr,setSolArr] = useState([]);
    const [mySub,setMySub] = useState(false); 
    const token = useSelector(state=>state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [uName,setUName] = useState('');

    useEffect(()=>{
        const getProSol = async ()=>{
            const { list } = await GetProSol(id);
            setSolArr(list); 
            if(token.token !== ""){
                const data = { token: token.token };
                const { status, user } = await VerifyUser(data);
                if(!status) dispatch(logoutUser());
                setUName(user);
            }
        }
        getProSol();
    },[id])

    const handleMySub = () =>{
        if(token.token === ""){
            navigate("/login");
        }
        setMySub(true);
    }

    return (
        <div>
            <div>
                <button className="border" onClick={handleMySub}>My Submission</button>
                <button className="border" onClick={()=>setMySub(false)}>All Submission</button>
            </div>
            {
                !mySub && solArr.length>0 && solArr.map((item)=>(
                    <div className="flex flex-row justify-around bg-gray-300 mt-10">
                        <div>
                            {item.owner}
                        </div>
                        <div>
                            {item.problem}
                        </div>
                        <div>
                            {item.language}
                        </div>
                        <div>
                            {item.verdict}
                        </div>
                        <div>
                            {item.submittedAt.substring(0, 10)}
                        </div>
                    </div>
                ))
            }
            {
                mySub && solArr.length>0 && solArr.filter((it)=>{return it.owner === uName}).map((item)=>(
                    <div className="flex flex-row justify-around bg-gray-300 mt-10">
                        <div>
                            {item.owner}
                        </div>
                        <div>
                            {item.problem}
                        </div>
                        <div>
                            {item.language}
                        </div>
                        <div>
                            {item.verdict}
                        </div>
                        <div>
                            {item.submittedAt.substring(0, 10)}
                        </div>
                    </div>
                ))
            }
        </div>
    );
}