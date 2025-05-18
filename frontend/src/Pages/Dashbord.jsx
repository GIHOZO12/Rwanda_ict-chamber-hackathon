import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import ComplaintForm from './Dashboard/ComplaintForm'
import ResolvedComplaints from './Dashboard/ResolvedComplaints'
import Messages from './Dashboard/Messages'
import Allsubmitted from './Dashboard/Allsubmitted'


const Dashboard = () => {
  return (
    <div className="ml-64 p-6"> 
      <Routes>
        <Route path="start-complaint" element={<ComplaintForm />} />
        <Route path="all_compaints" element={<Allsubmitted/>}/>
        <Route path="resolved-complaints" element={<ResolvedComplaints />} />
        <Route path="send-message" element={<Messages />} />
        
        <Route path="view-messages" element={<Messages viewMode />} />
        <Route index element={
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
            <p className="text-gray-600">Select a service from the sidebar to get started.</p>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default Dashboard