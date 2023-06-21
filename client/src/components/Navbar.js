import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkIfTokenExists, logoutUser } from "../redux/actions";

export default function Navbar(){
    const token = useSelector(state=>state.user);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(checkIfTokenExists());
    },[])

    return (
        <div className="flex flex-row justify-around">
            <Link to={'/'}>
                Home
            </Link>
            <div>
                search
            </div>
            <Link to={'/addProblem'}>
                Add Problem
            </Link>
            {
                token.token && (
                    <div className="flex flex-row justify-between">
                        <div className="mx-20">
                            Profile
                        </div>
                        <button onClick={()=>dispatch(logoutUser())}>
                            logout
                        </button>
                    </div>
                )
            }
            {
                !token.token && (
                    <Link to={'/login'}>
                        Login
                    </Link>
                )
            }
        </div>
    );
}