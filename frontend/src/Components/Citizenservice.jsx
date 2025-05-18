import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const CitizenService = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Desktop sidebar
  if (!isMobile) {
    return (
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-100 shadow-lg z-40">
        <div className="p-4">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Citizen Services</h2>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/dashboard/start-complaint" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
              >
                Start Complaint
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/all_compaints" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
              >
                All submitted complaints
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/resolved-complaints" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
              >
                Resolved Complaints
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/send-message" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
              >
                Send Message
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/view-messages" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
              >
                View Messages
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Mobile menu button and overlay
  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="fixed left-4 top-20 z-50 p-2 bg-blue-800 text-white rounded-md shadow-lg md:hidden"
      >
        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      <div 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-100 shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Citizen Services</h2>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/dashboard/start-complaint" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                onClick={toggleMobileMenu}
              >
                Start Complaint
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/all_compaints" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                onClick={toggleMobileMenu}
              >
                All submitted complaints
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/resolved-complaints" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                onClick={toggleMobileMenu}
              >
                Resolved Complaints
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/send-message" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                onClick={toggleMobileMenu}
              >
                Send Message
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/view-messages" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                onClick={toggleMobileMenu}
              >
                View Messages
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CitizenService;