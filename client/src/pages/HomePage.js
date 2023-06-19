import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { VerifyUser } from "../services/api";
import useToken from "../components/useToken";

export default function HomePage(){

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const { token, setToken } = useToken();

    useEffect(() => {
        const verifyCookie = async () => {
          if (!token) {
            navigate("/login");
          }
          const data = { token: token };
          const { status, user } = await VerifyUser(data);
          setUsername(user);
          return status? toast(`Hello ${user}`,{position: "top-right"}): (localStorage.removeItem("token"), navigate("/login"));
        };
        verifyCookie();
    }, [token]);

    const Logout = () => {
        localStorage.removeItem("token");
        navigate("/signup");
    };

    return (
        <>
            <div className="home_page">
                <h4>
                {" "}
                Welcome <span>{username}</span>
                </h4>
                <button onClick={Logout}>LOGOUT</button>
            </div>
            <ToastContainer />
        </>
    );
}