import { useEffect, useState } from "react";
import { GetProbList } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AllProblemPage(){
    const [proArr,setProArr] = useState([])
    const navigate = useNavigate();
    const filter = useSelector(state=>state.user);

    const res = proArr.filter((prob)=>{return prob.proname.toLowerCase().includes(filter.search.toLowerCase())});

    useEffect(()=>{
        const getlist = async () =>{
            const { list } = await GetProbList();
            setProArr(list); 
        }
        getlist();
    },[]);

    return (
        <div class="relative overflow-x-auto shadow-md">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Problem Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Difficulty
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    res.length>0 && res.map((item)=>(
                        <tr onClick={()=>navigate(`/SingleProblem/${item._id}`)} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {item.proname}
                            </th>
                            <td class="px-6 py-4">
                                {item.difficulty}
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}