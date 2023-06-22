import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Register } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/actions";

export default function SignupPage(){
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [uname,setUname] = useState('');
    const [pass,setPassword] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(email && uname && pass){
            const data = {
              email: email,
              username: uname,
              password: pass,
            }
            const { success, message, token } = await Register(data);
            if (success) {
                dispatch(loginUser({token}));
                handleSuccess(message);
                navigate(-1);
            } else {
                handleError(message);
            }
            setEmail('');
            setUname('');
            setPassword('');
        }
    }

    const handleError = (err) =>
        toast.error(err, {
        position: "bottom-left",
    });

    const handleSuccess = (msg) =>
        toast.success(msg, {
        position: "bottom-right",
    });

    return (
        <div className="mt-20 flex items-center justify-center">
            <div className="form_container">
                <h2>Signup Account</h2>
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
                    <label htmlFor="email">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={uname}
                        placeholder="Enter your username"
                        onChange={(ev)=>setUname(ev.target.value)}
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
                    Already have an account? <Link to={"/login"}>Login</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}