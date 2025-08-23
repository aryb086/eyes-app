import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1/users';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch user data';
  }
};

const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch user profile';
  }
};

const followUser = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/${userId}/follow`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to follow user';
  }
};

export default {
  getCurrentUser,
  getUserProfile,
  followUser
};
