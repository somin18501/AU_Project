import { useState } from "react";
import { Link } from "react-router-dom";
// import useToken from "./useToken";

export default function Navbar(){
    // const { token, setToken } = useToken();

    return (
        <div className="flex flex-cols justify-around">
            <Link to={'/'}>
                Home
            </Link>
            <div>
                search
            </div>
            <Link to={'/addProblem'}>
                Add Problem
            </Link>
            <div>
                My submissions
            </div>
            <div>
                favorite
            </div>
            <div>
                Profile
            </div>
        </div>
    );
}