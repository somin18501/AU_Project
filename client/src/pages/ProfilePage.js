import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions";
import { GetUserSol, VerifyUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ProfilePage(){
    const token = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [solArr,setSolArr] = useState([]);
    const [uname,setUName] = useState('');
    const [show,setShow] = useState(null);

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
                const { list } = await GetUserSol(user);
                setSolArr(list);
            }else{
                setUName('random');
            }
        }
        validateUser();
    },[uname])

    if(show !== null){
        return (
            <div className="ml-20 mr-20 mt-10">
                <div className="flex flex-row justify-between text-white my-4 bg-gray-600 rounded-xl p-2">
                    <div className="flex flex-row">
                        <p className="mx-4">Language: {show.language}</p>
                        <p className="mx-4">Verdict: {show.verdict}</p>
                    </div>
                    <button onClick={()=>setShow(null)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
                <div>
                    <textarea value={show.code} rows={20} className="w-full rounded-xl text-white" disabled/>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="text-white flex flex-col justify-center items-center my-4">
                <h1>Hi! {uname}</h1>
                <p>This are all your Submissions</p>
            </div>
            <div class="relative overflow-x-auto shadow-md">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Problem
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Language
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Verdict
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Submitted 
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            solArr.length>0 && solArr.map((item)=>(
                                <tr onClick={()=>setShow(item)} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td class="px-6 py-4">
                                        {item.problem}
                                    </td>
                                    <td class="px-6 py-4">
                                        {item.language}
                                    </td>
                                    <td class="px-6 py-4">
                                        {item.verdict}
                                    </td>
                                    <td class="px-6 py-4">
                                        {item.submittedAt.substring(0, 10)}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>           
        </div>
    );
}