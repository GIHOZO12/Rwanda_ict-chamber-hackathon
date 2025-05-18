import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiXCircle,
  FiMapPin,
  FiUser,
  FiCalendar,
  FiAlertTriangle,
  FiArrowRight,
  FiList,
  FiMail
} from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TrackingComplaints = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [showRecentComplaints, setShowRecentComplaints] = useState(false);
  const navigate = useNavigate();

  // Check if there's a ticket number in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ticketParam = params.get('ticket');
    if (ticketParam) {
      setTicketNumber(ticketParam);
    }
  }, []);

  // Fetch recent complaints when component mounts
  useEffect(() => {
    const fetchRecentComplaints = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/my-complaints/?limit=5');
        setRecentComplaints(res.data);
      } catch (err) {
        console.error('Failed to fetch recent complaints', err);
      }
    };
    
    fetchRecentComplaints();
  }, []);

  // Auto-fetch if ticket number is in URL
  useEffect(() => {
    if (ticketNumber) {
      fetchComplaintDetails();
    }
  }, [ticketNumber]);

  const fetchComplaintDetails = async () => {
    if (!ticketNumber.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Use the combined endpoint we created in the backend
      const res = await axios.get(`http://127.0.0.1:8000/api/track-complaint/${ticketNumber}/`);
      setComplaint(res.data);
      setResponses(res.data.responses || []);
      
      // Update URL without reload
      navigate(`?ticket=${ticketNumber}`, { replace: true });
    } catch (err) {
      handleFetchError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchError = (err) => {
    if (err.response?.status === 404) {
      setError('No complaint found with this ticket number. Please check the number and try again.');
    } else if (err.response?.status === 403) {
      setError('You do not have permission to view this complaint.');
    } else if (err.message === 'Network Error') {
      setError('Network error. Please check your internet connection and try again.');
    } else {
      setError('Failed to fetch complaint details. Please try again later.');
    }
    setComplaint(null);
    setResponses([]);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Submitted': return <FiClock className="text-yellow-500" />;
      case 'In Progress': return <FiCheckCircle className="text-blue-500" />;
      case 'Resolved': return <FiCheckCircle className="text-green-500" />;
      case 'Rejected': return <FiXCircle className="text-red-500" />;
      default: return <FiAlertCircle className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 1: return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">High</span>;
      case 2: return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Medium</span>;
      default: return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Low</span>;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchComplaintDetails();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Complaint</h1>
          <p className="text-gray-600">Enter your complaint ticket number to check the status</p>
        </div>

        {/* Search Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter complaint ID (e.g. COMP-123)"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {recentComplaints.length > 0 && (
                <button 
                  onClick={() => setShowRecentComplaints(!showRecentComplaints)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
                  title="Show recent complaints"
                >
                  <FiList />
                </button>
              )}
            </div>
            <button
              onClick={fetchComplaintDetails}
              disabled={!ticketNumber || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center min-w-[140px]"
            >
              {isLoading ? 'Searching...' : (
                <>
                  <FiSearch className="mr-2" />
                  Track
                </>
              )}
            </button>
          </div>

          {/* Recent complaints dropdown */}
          {showRecentComplaints && recentComplaints.length > 0 && (
            <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                Your Recent Complaints
              </div>
              <ul className="divide-y divide-gray-200">
                {recentComplaints.map((comp) => (
                  <li key={comp.id}>
                    <button
                      onClick={() => {
                        setTicketNumber(comp.id);
                        setShowRecentComplaints(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex justify-between items-center"
                    >
                      <span className="truncate">
                        <span className="font-medium">#{comp.id}</span> - {comp.title}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        comp.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        comp.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {comp.status}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="mt-3 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {complaint && (
          <div className="space-y-6">
            {/* Complaint Details Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{complaint.title}</h2>
                    <p className="text-gray-600">Complaint ID: #{complaint.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(complaint.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      complaint.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.status}
                    </span>
                    {getPriorityBadge(complaint.priority)}
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Complaint Details</h3>
                    <div className="space-y-3">
                <p className="flex items-center text-sm">
  <FiUser className="mr-2 text-gray-500 flex-shrink-0" />
  <span className="text-gray-500">Submitted by:</span> 
  <span className="ml-1 text-gray-900">
    {complaint?.user_details?.first_name || complaint?.user?.first_name || 'Unknown'} 
    {complaint?.user_details?.last_name || complaint?.user?.last_name || ''}
  </span>
</p>
                      <p className="flex items-center text-sm">
                        <FiCalendar className="mr-2 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-500">Date Submitted:</span> 
                        <span className="ml-1 text-gray-900">
                          {formatDate(complaint.created_at)}
                        </span>
                      </p>
                      <p className="flex items-center text-sm">
                        <FiAlertTriangle className="mr-2 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-500">Category:</span> 
                        <span className="ml-1 text-gray-900">{complaint.category}</span>
                      </p>
                      {complaint.assigned_to && (
                        <p className="flex items-center text-sm">
                          <FiMail className="mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-500">Assigned to:</span> 
                          <span className="ml-1 text-gray-900">{complaint.assigned_to.name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                    <div className="flex items-start">
                      <FiMapPin className="mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900">{complaint.location.name}</p>
                        <p className="text-xs text-gray-500">
                          {complaint.location.cell.sector.district.province.name} → 
                          {complaint.location.cell.sector.district.name} → 
                          {complaint.location.cell.sector.name} → 
                          {complaint.location.cell.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{complaint.description}</p>
                  </div>
                  {complaint.attachment && (
                    <div className="mt-3">
                      <a 
                        href={complaint.attachment} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <FiPaperclip className="mr-1" /> View attached file
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Updates */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Status Updates</h3>
                <span className="text-sm text-gray-500">
                  {responses.length} update{responses.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {responses.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {responses.map((response, index) => (
                    <div key={index} className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <FiUser className="text-blue-600" />
                          </div>
                          <div>
                           <p className="font-medium">
  {response?.responder_name || 'System'}
  {response?.agency_name && ` (${response.agency_name})`}
</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(response.created_at)}
                            </p>
                          </div>
                        </div>
                        {response.is_agency_response && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Official Response
                          </span>
                        )}
                      </div>
                      <div className="pl-11">
                        <p className="text-gray-700 whitespace-pre-line">{response.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No updates available for this complaint yet.
                </div>
              )}
            </div>
          </div>
        )}

        {!complaint && !error && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiSearch className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No complaint selected</h3>
            <p className="text-gray-500 mb-4">Enter your complaint ID above to view its status</p>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/submit-complaint')}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto"
              >
                Submit a new complaint <FiArrowRight className="ml-1" />
              </button>
              {recentComplaints.length > 0 && (
                <button 
                  onClick={() => setShowRecentComplaints(true)}
                  className="text-gray-600 hover:text-gray-800 text-sm flex items-center justify-center mx-auto"
                >
                  View your recent complaints <FiList className="ml-1" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingComplaints;