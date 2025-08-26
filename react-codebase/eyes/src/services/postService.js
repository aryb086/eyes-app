import axios from 'axios';
import { getApiUrl } from './api';

const BASE_URL = getApiUrl();
const API_URL = `${BASE_URL}/posts`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    }
  };
};

const createPost = async (postData) => {
  try {
    const response = await axios.post(API_URL, postData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create post';
  }
};

const getFeed = async (params = {}) => {
  try {
    // Default values
    const { page = 1, limit = 10, ...otherParams } = params;
    
    // Build query string
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...otherParams
    });
    
    const response = await axios.get(
      `${API_URL}?${queryParams.toString()}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch feed';
  }
};

const likePost = async (postId) => {
  try {
    const response = await axios.put(`${API_URL}/like/${postId}`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to like post';
  }
};

export default {
  createPost,
  getFeed,
  likePost
};
