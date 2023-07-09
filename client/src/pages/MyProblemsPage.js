import { useDispatch, useSelector } from "react-redux";
import Subbar from "../components/Subbar"
import { DeleteProblem, DeleteSolution, DeleteTestcase, GetUserProb, VerifyUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logoutUser } from "../redux/actions";

export default function MyProblemsPage(){

    const token = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [uname,setUName] = useState('');
    const [proArr,setProArr] = useState([]);
    const [probId,setProbId] = useState(null);

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
                const { list } = await GetUserProb(user);
                setProArr(list);
            }else{
                setUName('random');
            }
        }
        validateUser();
    },[uname])

    if(probId!=null){
        const handleRemove = async () =>{
            if(window.confirm("Sure? want to Delete Problem") == true){
                await DeleteProblem(probId);
                await DeleteTestcase(probId);
                await DeleteSolution(probId);
                navigate("/profile");
            }else setProbId(null);
        } 
        handleRemove();
    }

    return (
        <div>
            <Subbar/>
            <div className="text-white flex flex-col justify-center items-center my-4">
                <h1>Hi! {uname}</h1>
                <p>This are all your Problems</p>
            </div>
            <div class="relative overflow-x-auto shadow-md">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Problem
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Difficulty
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Created At
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Edit 
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Delete 
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            proArr.length>0 && proArr.map((item)=>(
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td class="px-6 py-4">
                                        {item.proname}
                                    </td>
                                    <td class="px-6 py-4">
                                        {item.difficulty}
                                    </td>
                                    <td class="px-6 py-4">
                                        {item.createdAt.substring(0, 10)}
                                    </td>
                                    <td class="px-6 py-4">
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                    </td>
                                    <td class="px-6 py-4">
                                        <butoon onClick={()=>setProbId(item._id)} class="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer">Remove</butoon>
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