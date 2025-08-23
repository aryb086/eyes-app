import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Feed from '../components/feed';

function FeedPage() {
  const { currentUser, logout } = useAuth();
  
  // In a real app, you would pass the user data to the Feed component
  // and handle the logout functionality
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Feed 
      user={{
        id: currentUser?.uid,
        username: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User',
        email: currentUser?.email,
        photoURL: currentUser?.photoURL
      }} 
      onLogout={handleLogout} 
    />
  );
}

export default FeedPage;
