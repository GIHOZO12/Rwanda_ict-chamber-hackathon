import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [profile, setProfile] = useState(null);
    const [showPopover, setShowPopover] = useState(false);
    const popoverRef = useRef(null);

    useEffect(() => {
        fetchCurrentUser();
         window.addEventListener('userLoggedIn', fetchCurrentUser);
        
        return () => {
            
            window.removeEventListener('userLoggedIn', fetchCurrentUser);
        };
    }, []);

    const fetchCurrentUser = () => {
        const token = Cookies.get('access');

        axios.get("http://127.0.0.1:8000/api/current_user/", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            setProfile(res.data);
        })
        .catch((error) => {
            console.log('Error fetching user data:', error);
        });
    };

   const handleLogout = () => {
    const refreshToken = Cookies.get('refresh');
    
    if (!refreshToken) {
        console.error('No refresh token found');
        
        cleanupAfterLogout();
        return;
    }

    axios.post("http://127.0.0.1:8000/api/logout/", 
        { refresh: refreshToken }, 
        {
            headers: {
                'Authorization': `Bearer ${Cookies.get('access')}`,
                'Content-Type': 'application/json'
            }
        }
    )
    .then(() => {
        cleanupAfterLogout();
    })
    .catch((error) => {
        console.log('Error during logout:', error);
        // Even if logout fails, clean up locally
        cleanupAfterLogout();
    });
};

const cleanupAfterLogout = () => {
    Cookies.remove('access');
    Cookies.remove('refresh');
    Cookies.remove('username');
    setProfile(null);
    // Optional: redirect to login page
    window.location.href = '/login';
};

    const togglePopover = () => {
        setShowPopover(!showPopover);
    };

    const handleClickOutside = (event) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target)) {
            setShowPopover(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
                    Rwanda Citizen Portal
                </Link>
                
                <ul className="flex space-x-6">
                    <li>
                        <Link to="/" className="hover:text-blue-200 transition-colors py-2 px-3 rounded hover:bg-blue-700">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/help" className="hover:text-blue-200 transition-colors py-2 px-3 rounded hover:bg-blue-700">
                            Help/Support
                        </Link>
                    </li>
                    <li>
                        <Link to="/track" className="hover:text-blue-200 transition-colors py-2 px-3 rounded hover:bg-blue-700">
                            Change Language
                        </Link>
                    </li>
                    {profile ? (
                        <li className="relative">
                            <span 
                                className="flex items-center cursor-pointer py-2 px-3 rounded hover:bg-blue-700"
                                onClick={togglePopover}
                            >
                                {profile.username}
                                <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                            {showPopover && (
                                <div ref={popoverRef} className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg p-2">
                                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setShowPopover(false)}>
                                    citizen dashboard
                                    </Link>
                                    <button 
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </li>
                    ) : (
                        <li>
                            <Link to="/login" className="hover:text-blue-200 transition-colors py-2 px-3 rounded hover:bg-blue-700">
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;