import { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { Link } from "react-router-dom";
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { logout } from "../../../redux/store/reducers/authSlice";
import Icon from '@mdi/react';

export default function AuthDropdown() {
    const dispath = useAppDispatch()
    const { user } = useAppSelector(state => state.auth)
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);
    
    const handleLogout = (event: any) => {
        event.preventDefault()
        dispath(logout())
    }

    return (
        <li className="dropdown">
            { (user.isAuthenticated) ? (
                <a onClick={e => {
                    e.preventDefault()
                    setOpenDropdown(openDropdown => !openDropdown)
                }} className={openDropdown ? 'active' : ''}>
                    <span>{ user.username }</span>
                    { openDropdown ? (
                        <Icon path={ mdiChevronDown } className="h-5 w-5 md:hidden"/>
                    ) : (
                        <Icon path={ mdiChevronUp } className="h-5 w-5 md:hidden"/>
                    ) }
                </a>
            ) : (
                <Link to='/auth/login'>
                    <span>Log In</span>
                </Link>
            ) }
            <ul className={openDropdown ? 'dropdown-active' : ''}>
                
                { (user.isAuthenticated) ?
                    (
                        <>
                            <li>
                                <Link to="/profile">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/script">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <a href="#" onClick={ handleLogout }>
                                    Log out
                                </a>
                            </li>
                        </>
                    ) : ""
                }

            </ul>
        </li>
    )
}