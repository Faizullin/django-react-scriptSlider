import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export interface INavbarProps {
    auth: any
}



export default function Navbar({auth} : INavbarProps){
    const [isOpenNavbar,setIsOpenNavbar] = useState(false);
    const handleMobileToggle = () => setIsOpenNavbar(!isOpenNavbar);
    useEffect(function(){
        if(isOpenNavbar) {
            document.body.classList.add('mobile-nav-active');
        } else {
            document.body.classList.remove('mobile-nav-active');
        }
    },[isOpenNavbar])

    return (
        <div className="container mx-auto flex items-center justify-between px-4">
            <Link to="/" className="logo flex items-center">
                <h1>ScriptSlider<span>.</span></h1>
            </Link>
            <div className={`${ isOpenNavbar ? "" : "hidden" } fixed inset-0 mobile-nav-bg`}>
            </div>
            <nav id="navbar" className="navbar">
                <ul className="flex flex-col p-4 mt-4 md:flex-row m-bg-green-basic">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/">About</NavLink>
                    </li>
                    <li>
                        <NavLink to="/script">Scripts</NavLink>
                    </li>
                    <li>
                        <Link to="/script?action=create">Create Script</Link>
                    </li>
                    {/* <AuthDropdown auth={auth} className={ route().current('pages.home') ? `active` : `` }/> */}
                </ul>
            </nav>
            <div className="block md:hidden">
                <i className={`mobile-nav-toggle mobile-nav-show bi bi-list ${isOpenNavbar ? "hidden" : ""} m-0`} onClick={handleMobileToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </i>
                <i className={`mobile-nav-toggle mobile-nav-hide bi bi-x ${!isOpenNavbar ? "hidden" : ""} m-0`} onClick={handleMobileToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </i>
            </div>
        </div>
    );
}