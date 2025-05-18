import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">Welcome to Rwanda Citizen Portal</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A platform for citizens to submit complaints and feedback about public services
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => navigate('/government_agency')}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Government Agency
          </button>
          <button 
            onClick={() => navigate('/tracking')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Track Complaint
          </button>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-blue-600">1</div>
              <h3 className="text-xl font-semibold mb-2">Submit Complaint</h3>
              <p className="text-gray-600">Fill out our simple form with details about your issue</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-blue-600">2</div>
              <h3 className="text-xl font-semibold mb-2">Automatic Routing</h3>
              <p className="text-gray-600">Your complaint gets routed to the appropriate government agency</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-blue-600">3</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor the status of your complaint through our portal</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;