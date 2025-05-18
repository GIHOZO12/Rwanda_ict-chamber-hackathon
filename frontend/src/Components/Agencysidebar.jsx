import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FiHome, FiClipboard, FiUsers, FiSettings, FiBarChart2, FiMessageSquare, FiLogOut } from 'react-icons/fi';

const AgencySidebar = () => {
  const navigate = useNavigate();
  const agencyData = JSON.parse(Cookies.get('agency_data'));
  
  const handleLogout = () => {
    Cookies.remove('agency_access');
    Cookies.remove('agency_refresh');
    Cookies.remove('agency_data');
    navigate('/agency/login');
  };

  const sidebarItems = [
    { path: '/agency/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { path: '/agency/complaints', icon: <FiClipboard size={20} />, label: 'Complaints' },
    
  ];

  return (
    <div className="h-screen w-64 bg-blue-800 text-white fixed left-0 top-0 shadow-lg">
      <div className="p-4 border-b border-blue-700">
        <h1 className="text-xl font-bold">Agency Portal</h1>
        <p className="text-blue-200 text-sm">Rwanda Government</p>
      </div>
      
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6 p-2 bg-blue-700 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="font-bold">
              {agencyData?.name?.substring(0, 2).toUpperCase() || 'AG'}
            </span>
          </div>
          <div>
            <p className="font-medium">{agencyData?.name || 'Agency'}</p>
            <p className="text-xs text-blue-200">{agencyData?.category || 'Government'}</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-700 font-medium' : 'hover:bg-blue-700/50'
                }`
              }
            >
              <span className="text-blue-200">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-blue-700">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-blue-700/50"
        >
          <FiLogOut size={20} className="text-blue-200" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AgencySidebar;