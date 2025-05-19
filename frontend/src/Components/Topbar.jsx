import React, { useEffect, useState } from 'react';
import { FiBell, FiSearch, FiMenu, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Topbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = () => {
    const token = Cookies.get('access');
    
    if (token) {
      axios.get("https://ngewe.pythonanywhere.com/api/current_user/", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((error) => {
        console.log('Error fetching user data:', error);
      });
    }
  };

  const handleLogout = () => {
    const refreshToken = Cookies.get('refresh');
    
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
      Cookies.remove('access');
      Cookies.remove('refresh');
      window.location.href = '/login';
    })
    .catch((error) => {
      console.log('Error during logout:', error);
      // Fallback cleanup
      Cookies.remove('access');
      Cookies.remove('refresh');
      window.location.href = '/login';
    });
  };

  return (
    <div className="fixed left-64 right-0 top-0 h-16 bg-white shadow-sm z-10 flex items-center justify-between px-6">
      {/* Left side - Menu button (for mobile) and Search */}
      <div className="flex items-center space-x-4">
        <button className="lg:hidden text-gray-600 hover:text-gray-900">
          <FiMenu size={20} />
        </button>
        
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* Right side - User controls */}
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-600 hover:text-gray-900">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <Link to="/">
          <button className="text-sm text-gray-600 hover:text-blue-600">
            Go to Public Site
          </button>
        </Link>
        
        {currentUser ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <FiUser className="text-blue-600" size={18} />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">
                {currentUser.username} {currentUser.last_name}
              </p>
              <p className="text-xs text-gray-500">
                Citizen
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-blue-600 ml-2"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="text-sm text-gray-600 hover:text-blue-600">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Topbar;