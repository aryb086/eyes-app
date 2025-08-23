import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import postService from '../services/postService';
import CustomButton from '../components/ui/Button';

function Profile() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: ''
  });

  const isOwnProfile = !userId || userId === currentUser?.id;
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = userId 
          ? await userService.getUserProfile(userId)
          : currentUser;
          
        setProfile(profileData);
        
        // If viewing another user's profile, check if we're following them
        if (userId && userId !== currentUser?.id) {
          const currentUserData = await userService.getUserProfile(currentUser.id);
          setIsFollowing(currentUserData.following.includes(userId));
        }
        
        // Load user's posts
        const userPosts = await postService.getUserPosts(profileData.id);
        setPosts(userPosts);
        
        // Set form data
        setFormData({
          fullName: profileData.fullName || '',
          bio: profileData.bio || ''
        });
        
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUser) {
      loadProfile();
    }
  }, [userId, currentUser]);
  
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowUser(profile.id);
      } else {
        await userService.followUser(profile.id);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Failed to update follow status', err);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      // In a real app, you would call an API to update the profile
      // await userService.updateProfile(formData);
      setProfile(prev => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9fe7ff]"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Profile not found</h2>
          <CustomButton 
            text="Go to Feed"
            onClick={() => navigate('/feed')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#9fe7ff]">Eyes</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{currentUser?.username}</span>
            <button 
              onClick={() => {
                // Handle logout
                navigate('/login');
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4 md:mb-0 md:mr-8">
              {profile.username?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="text-2xl font-bold bg-gray-700 text-white p-2 rounded"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold">{profile.fullName || profile.username}</h2>
                  )}
                  <p className="text-gray-400">@{profile.username}</p>
                </div>
                
                {isOwnProfile ? (
                  isEditing ? (
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <CustomButton 
                        text="Cancel"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-500"
                      />
                      <CustomButton 
                        text="Save Changes"
                        onClick={handleSave}
                      />
                    </div>
                  ) : (
                    <CustomButton 
                      text="Edit Profile"
                      onClick={() => setIsEditing(true)}
                    />
                  )
                ) : (
                  <CustomButton 
                    text={isFollowing ? 'Following' : 'Follow'}
                    onClick={handleFollow}
                    className={isFollowing ? 'bg-gray-600 hover:bg-gray-500' : ''}
                  />
                )}
              </div>
              
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4"
                  rows="3"
                />
              ) : (
                <p className="text-gray-300 mb-4">{profile.bio || 'No bio yet.'}</p>
              )}
              
              <div className="flex space-x-6 text-sm text-gray-400">
                <div>
                  <span className="font-semibold text-white">{posts.length}</span> posts
                </div>
                <div>
                  <span className="font-semibold text-white">{profile.followers?.length || 0}</span> followers
                </div>
                <div>
                  <span className="font-semibold text-white">{profile.following?.length || 0}</span> following
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-8">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map(post => (
              <div 
                key={post._id} 
                className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                {post.images?.[0] && (
                  <img 
                    src={post.images[0]} 
                    alt="Post" 
                    className="w-full h-64 object-cover"
                  />
                )}
                {!post.images?.[0] && (
                  <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-gray-300 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-400">
                    <span className="flex items-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likes?.length || 0}
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.comments?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {isOwnProfile 
                ? "You haven't posted anything yet." 
                : `${profile.username} hasn't posted anything yet.`}
            </p>
            {isOwnProfile && (
              <button 
                onClick={() => navigate('/feed')}
                className="mt-4 text-[#9fe7ff] hover:underline"
              >
                Create your first post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
