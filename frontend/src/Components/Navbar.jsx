import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
    const [profile, setProfile] = useState(null);
    const [showPopover, setShowPopover] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const popoverRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentUser();
        window.addEventListener('userLoggedIn', fetchCurrentUser);
        
        return () => {
            window.removeEventListener('userLoggedIn', fetchCurrentUser);
        };
    }, []);

    const fetchCurrentUser = () => {
        const token = Cookies.get('access');
        if (!token) return;

        axios.get("https://ngewe.pythonanywhere.com/api/current_user/", {
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

        axios.post("https://ngewe.pythonanywhere.com/api/logout/", 
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
            cleanupAfterLogout();
        });
    };

    const cleanupAfterLogout = () => {
        Cookies.remove('access');
        Cookies.remove('refresh');
        Cookies.remove('username');
        setProfile(null);
        setMobileMenuOpen(false);
        navigate('/login');
    };

    const togglePopover = () => {
        setShowPopover(!showPopover);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl font-bold hover:text-blue-200 transition-colors">
                            Rwanda Citizen Portal
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex space-x-4">
                            <NavLink to="/" label="Home" />
                            <NavLink to="/help" label="Help/Support" />
                            <NavLink to="/tracking" label="Track Complaint" />
                        </div>

                        {profile ? (
                            <div className="relative ml-4" ref={popoverRef}>
                                <button
                                    onClick={togglePopover}
                                    className="flex items-center space-x-1 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    aria-expanded={showPopover}
                                    aria-haspopup="true"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        <FiUser className="h-4 w-4" />
                                    </div>
                                    <span className="ml-2">{profile.username}</span>
                                    <FiChevronDown className={`ml-1 h-4 w-4 transition-transform ${showPopover ? 'transform rotate-180' : ''}`} />
                                </button>

                                {showPopover && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                                        <Link 
                                            to="/dashboard" 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowPopover(false)}
                                        >
                                            Citizen Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                        >
                                            <FiLogOut className="mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink to="/login" label="Login" />
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <FiX className="block h-6 w-6" />
                            ) : (
                                <FiMenu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-blue-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLink to="/" label="Home" onClick={toggleMobileMenu} />
                        <MobileNavLink to="/help" label="Help/Support" onClick={toggleMobileMenu} />
                        <MobileNavLink to="/track" label="Track Complaint" onClick={toggleMobileMenu} />
                        
                        {profile ? (
                            <>
                                <MobileNavLink 
                                    to="/dashboard" 
                                    label="Citizen Dashboard" 
                                    onClick={toggleMobileMenu}
                                />
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <MobileNavLink 
                                to="/login" 
                                label="Login" 
                                onClick={toggleMobileMenu}
                            />
                        )}
                    </div>
                    {profile && (
                        <div className="pt-4 pb-3 border-t border-blue-800">
                            <div className="flex items-center px-5">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                    <FiUser className="h-5 w-5" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">{profile.username}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, label }) => (
    <Link 
        to={to} 
        className="px-3 py-2 rounded-md text-sm font-medium hover:text-blue-200 hover:bg-blue-700 transition-colors"
    >
        {label}
    </Link>
);

// Reusable NavLink component for mobile
const MobileNavLink = ({ to, label, onClick }) => (
    <Link
        to={to}
        className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-600"
        onClick={onClick}
    >
        {label}
    </Link>
);

export default Navbar;