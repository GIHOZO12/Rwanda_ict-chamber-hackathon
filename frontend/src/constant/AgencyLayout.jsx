import React from 'react';
import { Outlet } from 'react-router-dom';
import AgencySidebar from '../Components/Agencysidebar';
import Topbar from '../Components/Topbar'; // Import the Topbar component

const AgencyLayout = () => {
  return (
    <div className="flex">
      <AgencySidebar />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Topbar />

        <main className="p-6 mt-16"> 
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;