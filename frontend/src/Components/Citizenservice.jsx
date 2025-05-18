import React from 'react';
import { Link } from 'react-router-dom';

const CitizenService = () => {
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
};

export default CitizenService;