import { Link, useLocation } from "react-router-dom";

export default function AccountNav(){
    const {pathname} = useLocation();
    let subpage = pathname.split('/')?.[1];

    function linkClasses(type=null){
        let classes = 'w-full text-center gap-1 py-2 px-6'
        if(type === subpage){
            classes += ' border-b-2 border-white-300 text-white';
        }else{
            classes += ' text-gray-500';
        }
        return classes;
    }

    return (
        <nav className="w-full flex flex-row justify-around mb-4">
            <Link className={linkClasses('profile')} to={'/profile'}>
                My Submissions
            </Link>
            <Link className={linkClasses('myproblems')} to={'/myproblems'}>
                My Problems
            </Link>
        </nav>
    );
}