import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import CitizenService from './Components/Citizenservice';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashbord';
import Govermentagency from './Pages/Govermentagency';
import AgencyLayout from './constant/AgencyLayout';
import AgencyComplaints from './Pages/Agency/AgencyComplaints';
import Agencymaindashbord from './Pages/Agency/Agencymaindashbord';
import TrackingComplaints from './Pages/TrackingComplaints';
import HelpAndSupport from './Pages/HelpAndSupport';

const App = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAgencyRoute = location.pathname.startsWith('/agency');

  return (
    <div className="flex flex-col min-h-screen">
 
      {!isAgencyRoute  && <Navbar />}
      
      <div className="flex flex-1">
     
        {isDashboardRoute && <CitizenService />}
        
     
        <div className="flex-1">
          <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/government_agency" element={<Govermentagency />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/tracking" element={<TrackingComplaints/>}/>
  <Route path="/help" element={<HelpAndSupport/>}/>
  <Route path="/dashboard/*" element={<Dashboard />} />

  <Route path="/agency/*" element={<AgencyLayout />}>
    <Route path="dashboard" element={<Agencymaindashbord />} />
    <Route path="complaints" element={<AgencyComplaints />} />
  </Route>
</Routes>
        </div>
      </div>
    </div>
  );
};

export default App;