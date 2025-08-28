import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ModernButton from '../components/ui/ModernButton';
import ModernCard from '../components/ui/ModernCard';

function ModernFeed() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      content: 'Just discovered this amazing new coffee shop downtown! The atmosphere is perfect for getting work done.',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3
    },
    {
      id: 2,
      author: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      content: 'Beautiful sunset from my apartment window tonight. Sometimes the simple moments are the most precious.',
      timestamp: '4 hours ago',
      likes: 28,
      comments: 7
    }
  ]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <span className="ml-2 text-xl font-bold text-white">Eyes</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2 2 0 002-2v-15a2 2 0 00-2-2h-15a2 2 0 00-2 2v15a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2 2 0 002-2v-15a2 2 0 00-2-2h-15a2 2 0 00-2 2v15a2 2 0 002 2z" />
                  </svg>
                </button>
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
                  <p className="text-xs text-gray-400">@{user?.username}</p>
                </div>
                <img
                  className="h-8 w-8 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${user?.fullName || user?.username}&background=3b82f6&color=fff`}
                  alt=""
                />
                <ModernButton
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </ModernButton>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <ModernCard className="bg-gray-800/50 border border-gray-700">
              <div className="flex space-x-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${user?.fullName || user?.username}&background=3b82f6&color=fff`}
                  alt=""
                />
                <div className="flex-1">
                  <textarea
                    className="w-full p-3 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                    rows="3"
                    placeholder="What's happening in your city?"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-4">
                      <button className="text-gray-400 hover:text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <ModernButton size="sm">Post</ModernButton>
                  </div>
                </div>
              </div>
            </ModernCard>

            {/* Posts */}
            {posts.map((post) => (
              <ModernCard key={post.id} className="bg-gray-800/50 border border-gray-700">
                <div className="flex space-x-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={post.avatar}
                    alt={post.author}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{post.author}</h3>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-500 text-sm">{post.timestamp}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{post.content}</p>
                    <div className="flex items-center space-x-6 mt-4">
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="text-gray-400 hover:text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending */}
            <ModernCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending in your area</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">#coffeeshop</span>
                  <span className="text-xs text-gray-400">12 posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">#sunset</span>
                  <span className="text-xs text-gray-400">8 posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">#downtown</span>
                  <span className="text-xs text-gray-400">5 posts</span>
                </div>
              </div>
            </ModernCard>

            {/* Nearby Users */}
            <ModernCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">People nearby</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mike Johnson</p>
                    <p className="text-xs text-gray-500">0.5 miles away</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Emma Davis</p>
                    <p className="text-xs text-gray-500">1.2 miles away</p>
                  </div>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModernFeed;
