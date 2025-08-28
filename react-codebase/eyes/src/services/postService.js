import api, { ENDPOINTS } from './api';

class PostService {
  // Get all posts
  async getAllPosts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.neighborhood) queryParams.append('neighborhood', filters.neighborhood);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.page) queryParams.append('page', filters.page);
      
      const endpoint = filters.city || filters.neighborhood 
        ? `${ENDPOINTS.POSTS.GET_ALL}?${queryParams.toString()}`
        : ENDPOINTS.POSTS.GET_ALL;
      
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('Get posts failed:', error);
      throw error;
    }
  }

  // Get posts by city
  async getPostsByCity(city, filters = {}) {
    try {
      const queryParams = new URLSearchParams({ city, ...filters });
      const response = await api.get(`${ENDPOINTS.POSTS.GET_BY_CITY}?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Get posts by city failed:', error);
      throw error;
    }
  }

  // Get posts by neighborhood
  async getPostsByNeighborhood(neighborhood, filters = {}) {
    try {
      const queryParams = new URLSearchParams({ neighborhood, ...filters });
      const response = await api.get(`${ENDPOINTS.POSTS.GET_BY_NEIGHBORHOOD}?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Get posts by neighborhood failed:', error);
      throw error;
    }
  }

  // Get posts by location (user's current location)
  async getPostsByLocation(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`${ENDPOINTS.POSTS.GET_BY_LOCATION}?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Get posts by location failed:', error);
      throw error;
    }
  }

  // Get single post by ID
  async getPostById(id) {
    try {
      const response = await api.get(ENDPOINTS.POSTS.GET_BY_ID(id));
      return response;
    } catch (error) {
      console.error('Get post failed:', error);
      throw error;
    }
  }

  // Create new post
  async createPost(postData) {
    try {
      const response = await api.post(ENDPOINTS.POSTS.CREATE, postData);
      return response;
    } catch (error) {
      console.error('Create post failed:', error);
      throw error;
    }
  }

  // Update post
  async updatePost(id, postData) {
    try {
      const response = await api.put(ENDPOINTS.POSTS.UPDATE(id), postData);
      return response;
    } catch (error) {
      console.error('Update post failed:', error);
      throw error;
    }
  }

  // Delete post
  async deletePost(id) {
    try {
      const response = await api.delete(ENDPOINTS.POSTS.DELETE(id));
      return response;
    } catch (error) {
      console.error('Delete post failed:', error);
      throw error;
    }
  }

  // Like post
  async likePost(id) {
    try {
      const response = await api.post(ENDPOINTS.POSTS.LIKE(id));
      return response;
    } catch (error) {
      console.error('Like post failed:', error);
      throw error;
    }
  }

  // Unlike post
  async unlikePost(id) {
    try {
      const response = await api.post(ENDPOINTS.POSTS.UNLIKE(id));
      return response;
    } catch (error) {
      console.error('Unlike post failed:', error);
      throw error;
    }
  }

  // Add comment to post
  async addComment(postId, commentData) {
    try {
      const response = await api.post(ENDPOINTS.POSTS.COMMENT(postId), commentData);
      return response;
    } catch (error) {
      console.error('Add comment failed:', error);
      throw error;
    }
  }

  // Get comments for a post
  async getComments(postId) {
    try {
      const response = await api.get(`${ENDPOINTS.POSTS.COMMENT(postId)}`);
      return response;
    } catch (error) {
      console.error('Get comments failed:', error);
      throw error;
    }
  }
}

const postService = new PostService();
export default postService;
