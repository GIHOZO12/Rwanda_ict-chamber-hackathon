import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ComplaintForm from './Dashboard/ComplaintForm'
import ResolvedComplaints from './Dashboard/ResolvedComplaints'
import Messages from './Dashboard/Messages'
import Allsubmitted from './Dashboard/Allsubmitted'

const Dashboard = () => {
  return (
    <div className="flex-1">
      <div className={`
        pt-4 px-4 pb-20            
        md:ml-2 md:pt-6 md:pl-2    
        md:pr-6 md:pb-6             
        min-h-[calc(100vh-4rem)]
        bg-gray-50
      `}>
        <Routes>
          <Route path="start-complaint" element={<ComplaintForm />} />
          <Route path="all_compaints" element={<Allsubmitted />} />
          <Route path="resolved-complaints" element={<ResolvedComplaints />} />
          <Route path="send-message" element={<Messages />} />
          <Route path="view-messages" element={<Messages viewMode />} />
          <Route index element={
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Welcome to Your Dashboard</h2>
              <p className="text-gray-600">Select a service from the sidebar to get started.</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard