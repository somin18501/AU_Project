import React, { useEffect, useState } from "react";
import { AddProblem, UploadFile, VerifyUser } from "../services/api";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions";
import { useNavigate } from "react-router-dom";

export default function AddProblemForm(){

    const token = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [uname,setUName] = useState('');
    const [pName,setPName] = useState('');
    const [statement,setStatement] = useState('');
    const [constraint,setConstraint] = useState('');
    const [diff,setDiff] = useState('Medium');
    const [fname,setFName] = useState('');

    useEffect(()=>{
        const validateUser = async ()=>{
            if(token.token !== ""){
                const data = { token: token.token };
                const { status, user } = await VerifyUser(data);
                if(!status){
                    dispatch(logoutUser());
                    navigate("/login");
                }
                setUName(user);
            }
            else navigate("/login");
        }
        validateUser();
    },[])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(pName && statement && constraint && fname){
            const data = {
                writer: uname,
                proname: pName,
                statement: statement,
                constraints: constraint,
                difficulty: diff,
            }
            const { success, prob } = await AddProblem(data);
            if (success) {
                const data = new FormData();
                data.append("name",fname.name);
                data.append("file",fname);
                data.append("problem",prob._id);
                const op = await UploadFile(data);
                if(op.success) navigate('/');
            }
        }
    }

    return (
        <div className="text-white mx-10 mt-2">
            <div>
                <h3 className="text-2xl mt-4">Add Problem Name</h3>
                <input  className="border rounded-md w-full text-black" type="text" 
                            value={pName}
                            onChange={ev => setPName(ev.target.value)}
                            placeholder="Must be unique and short" required />
                <h3 className="text-2xl mt-4">Add Problem Statement</h3>
                <textarea   className="border w-full rounded-lg text-black" type="text" rows={10}
                            value={statement}
                            onChange={ev => setStatement(ev.target.value)}
                            placeholder="Must Explain Question properly" required />
                <h3 className="text-2xl mt-4">Add Problem Constraints</h3>
                <textarea   className="border w-full rounded-lg text-black" type="text" rows={7} 
                            value={constraint}
                            onChange={ev => setConstraint(ev.target.value)}
                            placeholder="Must be to the point" />
                <div>
                    <select value={diff} className="bg-white text-black rounded-lg m-2" onChange={(ev)=>setDiff(ev.target.value)}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <input className="rounded-lg m-1" type="file" onChange={(ev)=>setFName(ev.target.files[0])}/>
                    <button className="border-2 rounded-lg mr-1 mb-2 p-2" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}