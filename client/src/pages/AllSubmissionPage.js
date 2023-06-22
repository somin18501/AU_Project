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
            <div className="my-2 flex flex-row justify-between">
                <button className="border-2 rounded-lg p-2 text-white ml-4" onClick={handleMySub}>My Submission</button>
                <button className="border-2 rounded-lg p-2 text-white mr-4" onClick={()=>setMySub(false)}>All Submission</button>
            </div>
            <div class="relative overflow-x-auto shadow-md">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                User Name
                            </th>
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
                            !mySub && solArr.length>0 && solArr.map((item)=>(
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.owner}
                                    </th>
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
                        {
                            mySub && solArr.length>0 && solArr.filter((it)=>{return it.owner === uName}).map((item)=>(
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.owner}
                                    </th>
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