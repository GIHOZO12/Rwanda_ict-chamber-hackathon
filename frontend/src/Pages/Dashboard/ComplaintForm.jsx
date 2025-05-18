import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location_id: null,
    priority: 3
  });
  
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load provinces on mount
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/provinces/')
      .then(res => setProvinces(res.data))
      .catch(err => console.error(err));
  }, []);

 

 useEffect(() => {
    if (submitMessage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitMessage]);

  useEffect(() => {
    if (selectedProvince) {
      axios.get(`http://127.0.0.1:8000/api/provinces/${selectedProvince}/districts/`)
        .then(res => {
          setDistricts(res.data);
          setSelectedDistrict(null);
          setSelectedSector(null);
          setSelectedCell(null);
          setFormData(prev => ({ ...prev, location_id: null }));
        })
        .catch(err => console.error(err));
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`http://127.0.0.1:8000/api/districts/${selectedDistrict}/sectors/`)
        .then(res => {
          setSectors(res.data);
          setSelectedSector(null);
          setSelectedCell(null);
          setFormData(prev => ({ ...prev, location_id: null }));
        })
        .catch(err => console.error(err));
    } else {
      setSectors([]);
      setSelectedSector(null);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSector) {
      axios.get(`http://127.0.0.1:8000/api/sectors/${selectedSector}/cells/`)
        .then(res => {
          setCells(res.data);
          setSelectedCell(null);
          setFormData(prev => ({ ...prev, location_id: null }));
        })
        .catch(err => console.error(err));
    } else {
      setCells([]);
      setSelectedCell(null);
    }
  }, [selectedSector]);

  useEffect(() => {
    if (selectedCell) {
      axios.get(`http://127.0.0.1:8000/api/cells/${selectedCell}/villages/`)
        .then(res => {
          setVillages(res.data);
          setFormData(prev => ({ ...prev, location_id: null }));
        })
        .catch(err => console.error(err));
    } else {
      setVillages([]);
    }
  }, [selectedCell]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Validate required fields
    if (!formData.location_id) {
      setSubmitMessage({
        type: 'error',
        text: 'Please select a valid village'
      });
      setIsSubmitting(false);
      return;
    }

    const dataToSend = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location_id: Number(formData.location_id),
      priority: Number(formData.priority)
    };

    try {
      const token = Cookies.get('access');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/complaints/', 
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

     setSubmitMessage({ 
        type: 'success', 
        text: `Complaint #${response.data.id} submitted!\nTitle: "${response.data.title}"\nStatus: ${response.data.status}`
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        location_id: null,
        priority: 3
      });
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedSector(null);
      setSelectedCell(null);
      
    } catch (err) {
      console.error('Submission error:', err.response?.data || err.message);
      
      let errorMessage = 'Failed to submit complaint. Please try again.';
      if (err.response?.data) {
        if (err.response.data.errors) {
          errorMessage = Object.entries(err.response.data.errors)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setSubmitMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md md:mx-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit a New Complaint</h2>
      
      {submitMessage && (
        <div className={`mb-6 p-4 rounded-md ${
          submitMessage.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Section */}
        <div className="space-y-4 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900">Location Information</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Province*</label>
              <select 
                value={selectedProvince || ''}
                onChange={(e) => setSelectedProvince(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedProvince && (
              <div>
                <label className="block text-sm font-medium text-gray-700">District*</label>
                <select 
                  value={selectedDistrict || ''}
                  onChange={(e) => setSelectedDistrict(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedDistrict && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Sector*</label>
                <select 
                  value={selectedSector || ''}
                  onChange={(e) => setSelectedSector(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Sector</option>
                  {sectors.map(sector => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedSector && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Cell*</label>
                <select 
                  value={selectedCell || ''}
                  onChange={(e) => setSelectedCell(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Cell</option>
                  {cells.map(cell => (
                    <option key={cell.id} value={cell.id}>
                      {cell.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedCell && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Village*</label>
                <select 
                  name="location_id"
                  value={formData.location_id || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    location_id: Number(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Village</option>
                  {villages.map(village => (
                    <option key={village.id} value={village.id}>
                      {village.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Complaint Details */}
        <div className="space-y-4 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900">Complaint Details</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category*</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
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
              <label className="block text-sm font-medium text-gray-700">Priority*</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="3">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Complaint Description</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Brief summary of your complaint"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Please provide detailed information about your complaint..."
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !formData.location_id}
            className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              isSubmitting || !formData.location_id
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;