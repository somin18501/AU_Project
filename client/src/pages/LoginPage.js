import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Login } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions";

export default function LoginPage(){
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [pass,setPassword] = useState('');
    const dispatch = useDispatch();
    const token = useSelector(state=>state.user);

    useEffect(()=>{
        if(token.token !== "") navigate(-1);
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(email && pass){
            const data = {
              email: email,
              password: pass,
            }
            const { success, message, token } = await Login(data);
            if (success) {
                dispatch(loginUser({token}));
                handleSuccess(message);
                navigate(-1);
            } else {
                handleError(message);
            }
            setEmail('');
            setPassword('');
        }
    }

    const handleError = (err) =>
        toast.error(err, {
        position: "bottom-left",
    });
    const handleSuccess = (msg) =>
        toast.success(msg, {
        position: "bottom-left",
    });

    return (
        <div className="mt-20 flex items-center justify-center">
            <div className="form_container">
                <h2>Login Account</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(ev)=>setEmail(ev.target.value)}
                    />
                    </div>
                    <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={pass}
                        placeholder="Enter your password"
                        onChange={(ev)=>setPassword(ev.target.value)}
                    />
                    </div>
                    <button type="submit">Submit</button>
                    <span>
                    Already have an account? <Link className="underline" to={"/signup"}>Signup</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}