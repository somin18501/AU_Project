import { useEffect, useState } from "react";
import { GetProbList } from "../services/api";
import { Link } from "react-router-dom";

export default function AllProblemPage(){
    const [proArr,setProArr] = useState([])

    useEffect(()=>{
        const getlist = async () =>{
            const { list } = await GetProbList();
            setProArr(list); 
        }
        getlist();
    },[]);


    return (
        <div className="flex flex-col">
            {
                proArr.length>0 && proArr.map((item)=>(
                    <Link to={`/SingleProblem/${item._id}`} className="flex flex-row justify-around mt-3 bg-cyan-400">
                        <div>
                            {item.proname}
                        </div>
                        <div>
                            {item.difficulty}
                        </div>
                    </Link>
                ))
            }
        </div>
    );
}