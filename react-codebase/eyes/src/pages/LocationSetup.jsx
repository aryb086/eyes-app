import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LocationSetup = () => {
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewCityForm, setShowNewCityForm] = useState(false);
  const [showNewNeighborhoodForm, setShowNewNeighborhoodForm] = useState(false);
  
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/locations/cities');
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast.error('Failed to load cities. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Fetch neighborhoods when a city is selected
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      if (!selectedCity) return;
      
      try {
        const response = await axios.get(
          `http://localhost:5001/api/locations/cities/${selectedCity}/neighborhoods`
        );
        setNeighborhoods(response.data.neighborhoods || []);
      } catch (error) {
        console.error('Error fetching neighborhoods:', error);
        toast.error('Failed to load neighborhoods. Please try again.');
      }
    };

    fetchNeighborhoods();
  }, [selectedCity]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedNeighborhood('');
    setShowNewNeighborhoodForm(false);
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!newCity.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post('http://localhost:5001/api/locations/cities', {
        name: newCity.trim(),
        country: 'USA' // Default country, can be made dynamic
      });
      
      setCities([...cities, response.data.city]);
      setSelectedCity(response.data.city._id);
      setNewCity('');
      setShowNewCityForm(false);
      toast.success('City added successfully!');
    } catch (error) {
      console.error('Error adding city:', error);
      const errorMsg = error.response?.data?.message || 'Failed to add city. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNeighborhood = async (e) => {
    e.preventDefault();
    if (!newNeighborhood.trim() || !selectedCity) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `http://localhost:5001/api/locations/cities/${selectedCity}/neighborhoods`,
        { name: newNeighborhood.trim() }
      );
      
      // Update the neighborhoods list
      setNeighborhoods([...neighborhoods, response.data.neighborhood]);
      setSelectedNeighborhood(response.data.neighborhood.id);
      setNewNeighborhood('');
      setShowNewNeighborhoodForm(false);
      toast.success('Neighborhood added successfully!');
    } catch (error) {
      console.error('Error adding neighborhood:', error);
      const errorMsg = error.response?.data?.message || 'Failed to add neighborhood. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCity || !selectedNeighborhood) {
      toast.error('Please select a city and neighborhood');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.put(
        `http://localhost:5001/api/users/${currentUser.id}/location`,
        {
          city_id: selectedCity,
          neighborhood_id: selectedNeighborhood
        },
        {
          headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        }
      );

      // Update user context with new location
      const city = cities.find(c => c._id === selectedCity);
      const neighborhood = neighborhoods.find(n => n.id === selectedNeighborhood);
      
      if (city && neighborhood) {
        updateUser({
          ...currentUser,
          location: {
            city_id: selectedCity,
            city_name: city.name,
            neighborhood_id: selectedNeighborhood,
            neighborhood_name: neighborhood.name
          }
        });
      }

      toast.success('Location updated successfully!');
      navigate('/feed');
    } catch (error) {
      console.error('Error updating location:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update location. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Set Your Location</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join your neighborhood or city to see local updates and connect with neighbors.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* City Selection */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <select
                id="city"
                value={selectedCity}
                onChange={handleCityChange}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCityForm(!showNewCityForm)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showNewCityForm ? 'Cancel' : '+ Add New'}
              </button>
            </div>

            {/* New City Form */}
            {showNewCityForm && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="flex">
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Enter city name"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleAddCity}
                    disabled={isSubmitting || !newCity.trim()}
                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Neighborhood Selection */}
          {selectedCity && (
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                Neighborhood
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <select
                  id="neighborhood"
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  disabled={!selectedCity}
                >
                  <option value="">Select a neighborhood</option>
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood.id} value={neighborhood.id}>
                      {neighborhood.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewNeighborhoodForm(!showNewNeighborhoodForm)}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedCity}
                >
                  {showNewNeighborhoodForm ? 'Cancel' : '+ Add New'}
                </button>
              </div>

              {/* New Neighborhood Form */}
              {showNewNeighborhoodForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <div className="flex">
                    <input
                      type="text"
                      value={newNeighborhood}
                      onChange={(e) => setNewNeighborhood(e.target.value)}
                      placeholder="Enter neighborhood name"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleAddNeighborhood}
                      disabled={isSubmitting || !newNeighborhood.trim()}
                      className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={!selectedCity || !selectedNeighborhood || isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationSetup;
