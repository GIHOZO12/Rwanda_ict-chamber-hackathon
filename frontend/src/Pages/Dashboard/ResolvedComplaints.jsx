import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ResolvedComplaints = () => {
  const [responses, setResponses] = useState({
    received: [],
    sent: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(
          'https://ngewe.pythonanywhere.com/api/my-responses/',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setResponses({
          received: response.data.received_responses || [],
          sent: response.data.sent_responses || []
        });
      } catch (err) {
        setError('Failed to load your responses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  if (loading) return <div className="text-center py-8">Loading your responses...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Complaint Responses</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'received' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('received')}
        >
          Received ({responses.received.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'sent' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent ({responses.sent.length})
        </button>
      </div>

      {/* Responses List */}
      {activeTab === 'received' ? (
        responses.received.length === 0 ? (
          <p className="text-gray-500">You haven't received any responses yet.</p>
        ) : (
          <div className="space-y-4">
            {responses.received.map(response => (
              <ResponseCard 
                key={response.id} 
                response={response} 
                type="received"
              />
            ))}
          </div>
        )
      ) : (
        responses.sent.length === 0 ? (
          <p className="text-gray-500">You haven't sent any responses yet.</p>
        ) : (
          <div className="space-y-4">
            {responses.sent.map(response => (
              <ResponseCard 
                key={response.id} 
                response={response} 
                type="sent"
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

// Reusable Response Card Component
const ResponseCard = ({ response, type }) => {
  const bgColor = type === 'received' && response.is_agency_response 
    ? 'bg-blue-50 border-blue-200' 
    : 'bg-gray-50 border-gray-200';
  
  return (
    <div className={`border rounded-lg p-4 ${bgColor}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="font-bold text-lg">{response.complaint_title}</h2>
          <p className="text-sm text-gray-600">
            {type === 'received' ? (
              response.is_agency_response 
                ? `From: ${response.agency_name || 'Government Agency'}`
                : `From: ${response.responder_name || 'You'}`
            ) : (
              `To: ${response.complaint_title}`
            )}
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(response.created_at).toLocaleString()}
        </span>
      </div>
      
      <div className="mt-3">
        <p className="whitespace-pre-line text-gray-800">{response.message}</p>
        {!response.is_public && (
          <p className="text-xs text-gray-500 mt-2">(Private response)</p>
        )}
      </div>
    </div>
  );
};

export default ResolvedComplaints;