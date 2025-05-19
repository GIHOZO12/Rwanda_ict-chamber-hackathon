import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AgencyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access_token'); // Changed from 'access' to 'access_token'
        if (!token) {
          navigate('/agency/login'); // Using navigate instead of window.location
          return;
        }

        const response = await axios.get('https://ngewe.pythonanywhere.com/api/agency/dashboard/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.error || 
                err.response?.data?.detail || 
                'Failed to load dashboard data');
        
        if (err.response?.status === 401) {
          navigate('/agency/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto p-4">
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
          No dashboard data available
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Agency Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Agency Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Name:</strong> {dashboardData.agency?.name || 'N/A'}</p>
          <p><strong>Category:</strong> {dashboardData.agency?.category || 'N/A'}</p>
          <p><strong>Code:</strong> {dashboardData.agency?.agency_code || 'N/A'}</p>
          <p><strong>Email:</strong> {dashboardData.agency?.email || 'N/A'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h3 className="font-bold">Total Complaints</h3>
          <p className="text-2xl">{dashboardData.stats?.total || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h3 className="font-bold">Submitted</h3>
          <p className="text-2xl">{dashboardData.stats?.submitted || 0}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg shadow">
          <h3 className="font-bold">In Progress</h3>
          <p className="text-2xl">{dashboardData.stats?.in_progress || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="font-bold">Resolved</h3>
          <p className="text-2xl">{dashboardData.stats?.resolved || 0}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Complaints</h2>
          <div className="text-sm text-gray-500">
            Showing {dashboardData.complaints?.length || 0} complaints
          </div>
        </div>
        
        {dashboardData.complaints?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.complaints.map(complaint => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">#{complaint.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{complaint.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{complaint.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 bg-gray-100 text-gray-600 rounded-lg">
            No complaints found
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyDashboard;