import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Login } from "../services/api";
import useToken from "../components/useToken";

export default function LoginPage(){
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [pass,setPassword] = useState('');
    const { token, setToken } = useToken();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(email && pass){
            const data = {
              email: email,
              password: pass,
            }
            const { success, message, token } = await Login(data);
            if (success) {
                setToken(token)
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
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
            Already have an account? <Link to={"/signup"}>Signup</Link>
            </span>
        </form>
        <ToastContainer />
        </div>
    );
}