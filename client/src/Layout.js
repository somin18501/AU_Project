import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function Layout(){
    return (
        <div className="flex flex-col min-h-screen bg-gray-800">
            <Navbar />
            <Outlet />
        </div>
    );
}