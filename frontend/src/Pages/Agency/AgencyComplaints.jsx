import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import AgencyLayout from '../../constant/AgencyLayout';

const AgencyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    category: '',
    priority: '',
    search: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          navigate('/agency/login');
          return;
        }

        const params = new URLSearchParams();
        if (filter.status) params.append('status', filter.status);
        if (filter.category) params.append('category', filter.category);
        if (filter.priority) params.append('priority', filter.priority);
        if (filter.search) params.append('search', filter.search);

        const response = await axios.get(
          `https://ngewe.pythonanywhere.com/api/agency/complaints/?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setComplaints(response.data);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError(err.response?.data?.error || 'Failed to load complaints');
        if (err.response?.status === 401) {
          navigate('/agency/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [filter, navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const token = Cookies.get('access_token');
      await axios.patch(
        `https://ngewe.pythonanywhere.com/api/agency/complaints/${complaintId}/`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setComplaints(prev => prev.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, status: newStatus } 
          : complaint
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update complaint status');
    }
  };

  const openComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const openResponseModal = (complaint) => {
    setSelectedComplaint(complaint);
    setIsResponseModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsResponseModalOpen(false);
    setSelectedComplaint(null);
    setResponseText('');
    setIsPublic(true);
  };

 const handleResponseSubmit = async () => {
  try {
    const token = Cookies.get('access_token');
    if (!token || !selectedComplaint) return;
    console.log("Submitting response for complaint:", selectedComplaint.id);

    
    const response = await axios.post(
      `https://ngewe.pythonanywhere.com/api/citizen/response/${selectedComplaint.id}/`,
      {
        message: responseText,
        is_public: isPublic
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update state
    setComplaints(prev => prev.map(c => 
      c.id === selectedComplaint.id ? {
        ...c,
        responses: [...(c.responses || []), response.data]
      } : c
    ));

    setError('');
    alert('Response submitted!');
    closeModal();
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    setError(err.response?.data?.error || 'Failed to submit response');
  }
};

  const getFullAddress = (complaint) => {
    if (!complaint.location) return 'Location not specified';

    const village = complaint.location.name || 'N/A';
    const cell = complaint.location.cell?.name || 'N/A';
    const sector = complaint.location.cell?.sector?.name || 'N/A';
    const district = complaint.location.cell?.sector?.district?.name || 'N/A';
    const province = complaint.location.cell?.sector?.district?.province?.name || 'N/A';

    return `${village}, ${cell}, ${sector}, ${district}, ${province}`;
  };

  if (loading) {
    return (
     
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading complaints...</div>
        </div>
      
    );
  }

  if (error) {
    return (
   
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-4 my-6">
          {error}
        </div>
   
    );
  }

  return (
   
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">All Agency Complaints</h1>
        
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">All Categories</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Security">Security</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Transportation">Transportation</option>
                <option value="Governmental">Governmental</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={filter.priority}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">All Priorities</option>
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="3">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filter.search}
                onChange={handleFilterChange}
                placeholder="Search complaints..."
                className="w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {complaints.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints.map(complaint => (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">#{complaint.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{complaint.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{complaint.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{complaint.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {complaint.location?.name || 'N/A'}, {complaint.location?.cell?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          complaint.priority === 1 ? 'bg-red-100 text-red-800' :
                          complaint.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {complaint.priority === 1 ? 'High' : complaint.priority === 2 ? 'Medium' : 'Low'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={complaint.status}
                          onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                          className={`border rounded p-1 text-sm ${
                            complaint.status === 'Resolved' ? 'bg-green-50 text-green-800' :
                            complaint.status === 'Rejected' ? 'bg-red-50 text-red-800' :
                            'bg-yellow-50 text-yellow-800'
                          }`}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => openComplaintDetails(complaint)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openResponseModal(complaint)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Respond
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No complaints found matching your filters
            </div>
          )}
        </div>

        {/* Complaint Details Modal */}
        {isModalOpen && selectedComplaint && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold mb-4">
                    Complaint #{selectedComplaint.id}: {selectedComplaint.title}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Complaint Details</h3>
                    <div className="space-y-2">
                      <p><strong>Category:</strong> {selectedComplaint.category}</p>
                      <p><strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${
                          selectedComplaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          selectedComplaint.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedComplaint.status}
                        </span>
                      </p>
                      <p><strong>Priority:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${
                          selectedComplaint.priority === 1 ? 'bg-red-100 text-red-800' :
                          selectedComplaint.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedComplaint.priority === 1 ? 'High' : 
                           selectedComplaint.priority === 2 ? 'Medium' : 'Low'}
                        </span>
                      </p>
                      <p><strong>Submitted:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Location Information</h3>
                    <div className="space-y-2">
                      <p><strong>Full Address:</strong> {getFullAddress(selectedComplaint)}</p>
                      {selectedComplaint.location && (
                        <>
                          <p><strong>Village:</strong> {selectedComplaint.location.name || 'N/A'}</p>
                          <p><strong>Cell:</strong> {selectedComplaint.location.cell?.name || 'N/A'}</p>
                          <p><strong>Sector:</strong> {selectedComplaint.location.cell?.sector?.name || 'N/A'}</p>
                          <p><strong>District:</strong> {selectedComplaint.location.cell?.sector?.district?.name || 'N/A'}</p>
                          <p><strong>Province:</strong> {selectedComplaint.location.cell?.sector?.district?.province?.name || 'N/A'}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="whitespace-pre-line">{selectedComplaint.description}</p>
                  </div>
                </div>

                {selectedComplaint.responses && selectedComplaint.responses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Responses</h3>
                    <div className="space-y-4">
                      {selectedComplaint.responses.map((response, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{response.agency_name || 'Agency'}</p>
                            <span className="text-sm text-gray-500">
                              {new Date(response.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-1 whitespace-pre-line">{response.message}</p>
                          <div className="mt-1 text-sm text-gray-500">
                            {response.is_public ? 'Public response' : 'Private response'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => openResponseModal(selectedComplaint)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Response
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
          
        {/* Response Modal */}
        {isResponseModalOpen && selectedComplaint && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">
                    Respond to Complaint #{selectedComplaint.id}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Response Message
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Type your response here..."
                  />
                </div>

                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                    Make this response public
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResponseSubmit}
                    disabled={!responseText.trim()}
                    className={`px-4 py-2 rounded text-white ${
                      !responseText.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Submit Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default AgencyComplaints;