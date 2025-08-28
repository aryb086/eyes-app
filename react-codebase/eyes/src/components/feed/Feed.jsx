import React, { useState, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams, useLocation as useRouterLocation } from 'react-router-dom';
import { FiHome, FiCompass, FiBell, FiMessageSquare, FiBookmark, FiSettings, FiMapPin } from 'react-icons/fi';
import { BsLightningCharge } from 'react-icons/bs';
import { RiCommunityLine } from 'react-icons/ri';
import { useLocation } from '../../contexts/LocationContext';
import locationService from '../../services/locationService';
import PostCard from './components/PostCard';
import CreatePost from './components/CreatePost';
import styles from './styles/feed.module.css';
import postService from '../../services/postService';

const Feed = ({ user, onLogout, isCityFeed = false, cityId = null }) => {
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const pathname = routerLocation?.pathname || '';
  const { stateCode, cityId: userCityId } = useLocation();
  const [activeTab, setActiveTab] = useState(isCityFeed ? 'city' : 'neighborhood');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [viewType, setViewType] = useState('all'); // 'all' or 'alerts'
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  // Get the city ID from the URL params first, then fall back to props
  const params = useParams();
  const effectiveCityId = cityId || params.cityId;
  const cityName = useMemo(() => {
    try {
      if (!stateCode || !effectiveCityId) return null;
      const cities = locationService.getCities().map(cityName => ({
      id: cityName.toLowerCase().replace(/\s+/g, '-'),
      name: cityName
    }));
      const c = cities.find(ci => ci.id === effectiveCityId);
      return c?.name || null;
    } catch {
      return null;
    }
  }, [stateCode, effectiveCityId]);
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch posts from backend
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {
          scope: isCityFeed ? 'city' : 'neighborhood',
          cityId: isCityFeed ? effectiveCityId : userCityId,
          stateCode,
          neighborhood: user?.neighborhood || undefined,
          page: 1,
          limit: 20,
        };
        const data = await postService.getFeed(params);
        // data could be an array or an object with results
        const list = Array.isArray(data) ? data : (data?.results || data?.data || []);
        setPosts(list);
      } catch (e) {
        console.error('Failed to load feed', e);
        setError(typeof e === 'string' ? e : (e?.message || 'Failed to load feed'));
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [isCityFeed, effectiveCityId, stateCode, userCityId, user?.neighborhood]);
  
  // Filter posts based on the current view (city or neighborhood)
  useEffect(() => {
    let filtered = [...posts];
    
    if (isCityFeed && effectiveCityId) {
      // Show posts from this city
      filtered = filtered.filter(post => 
        post.user?.cityId === effectiveCityId && 
        post.user?.stateCode === stateCode
      );
    } else if (activeTab === 'neighborhood') {
      // Show posts from the user's neighborhood (filtered by location service)
      filtered = filtered.filter(post => 
        post.user?.location === user?.neighborhood &&
        post.user?.cityId === userCityId &&
        post.user?.stateCode === stateCode
      );
    }
    
    // Apply additional filters
    if (viewType === 'alerts') {
      filtered = filtered.filter(post => post.type === 'alert');
    }
    
    setFilteredPosts(filtered);
  }, [posts, activeTab, viewType, isCityFeed, effectiveCityId, stateCode, userCityId, user?.neighborhood]);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId, commentText) => {
    const newComment = {
      id: Date.now(),
      user: {
        name: user?.username || 'Anonymous',
        avatar: user?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'
      },
      text: commentText,
      timestamp: 'Just now'
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments ? [...post.comments, newComment] : [newComment];
        return {
          ...post,
          comments: updatedComments,
          commentsCount: updatedComments.length
        };
      }
      return post;
    }));
  };

  const handleSave = (postId, isSaved) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        // Determine the new save count based on the current state
        const currentIsSaved = post.isSaved || false;
        let newSaveCount = post.saves || 0;
        
        // Only update the count if the saved state is changing
        if (isSaved !== currentIsSaved) {
          newSaveCount = isSaved ? newSaveCount + 1 : Math.max(0, newSaveCount - 1);
        }
        
        return {
          ...post,
          isSaved: isSaved,
          saves: newSaveCount
        };
      }
      return post;
    }));
    
    // In a real app, you would also update the backend here
    // await savePost(postId, isSaved);
  };

  const handleShare = async (postId) => {
    // First, find the post to get the current share count
    const postToShare = posts.find(post => post.id === postId);
    if (!postToShare) return;
    
    // Optimistically update the UI
    const currentShares = postToShare.shares || 0;
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: currentShares + 1 }
        : post
    ));
    
    try {
      // In a real app, you would call an API to track the share
      // await sharePost(postId);
      console.log(`Shared post ${postId}`);
    } catch (error) {
      console.error('Error sharing post:', error);
      // Rollback the UI update if the API call fails
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, shares: Math.max(0, currentShares) }
          : post
      ));
    }
  };

  const handleNewPost = async (content, image = null) => {
    try {
      const payload = {
        content,
        image,
        scope: isCityFeed ? 'city' : 'neighborhood',
        cityId: effectiveCityId || userCityId,
        stateCode,
        neighborhood: user?.neighborhood,
      };
      await postService.createPost(payload);
      // Refetch to ensure consistency across accounts
      const params = {
        scope: isCityFeed ? 'city' : 'neighborhood',
        cityId: isCityFeed ? effectiveCityId : userCityId,
        stateCode,
        neighborhood: user?.neighborhood || undefined,
        page: 1,
        limit: 20,
      };
      const data = await postService.getFeed(params);
      const list = Array.isArray(data) ? data : (data?.results || data?.data || []);
      setPosts(list);
      setShowCreatePost(false);
    } catch (e) {
      console.error('Failed to create post', e);
      // keep modal open to let user retry or close
    }
  };

  return (
    <div className={styles.feedContainer}>
      {/* Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Eyes</div>

        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${activeTab === 'home' ? styles.active : ''}`}>
            <FiHome className={styles.navIcon} />
            <span>Home</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${!isCityFeed ? styles.active : ''}`}
            onClick={() => (!isCityFeed ? setActiveTab('neighborhood') : navigate('/feed'))}
          >
            <RiCommunityLine className={styles.navIcon} />
            <span>Neighborhood</span>
          </button>

          <button 
            className={`${styles.navItem} ${isCityFeed ? styles.active : ''}`}
            onClick={() => navigate(`/city/${userCityId}`)}
          >
            <FiMapPin className={styles.navIcon} />
            <span>City</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'explore' ? styles.active : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <FiCompass className={styles.navIcon} />
            <span>Explore</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${pathname.startsWith('/notifications') ? styles.active : ''}`}
            onClick={() => navigate('/notifications')}
          >
            <FiBell className={styles.navIcon} />
            <span>Notifications</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${pathname.startsWith('/saved') ? styles.active : ''}`}
            onClick={() => navigate('/saved')}
          >
            <FiBookmark className={styles.navIcon} />
            <span>Saved</span>
          </button>
          
          <button 
            className={styles.navItem}
            onClick={() => navigate('/settings')}
          >
            <FiSettings className={styles.navIcon} />
            <span>Settings</span>
          </button>
        </nav>


        <button className={styles.createPostButton} onClick={() => setShowCreatePost(true)}>
          Create Post
        </button>
      </aside>
      
      <main className={styles.mainContent}>
        <div className={styles.feedHeader}>
          <h1 className={styles.feedTitleRow}>
            <span className={styles.feedTitleText}>{isCityFeed ? 'City Feed' : 'Neighborhood Feed'}</span>
            {isCityFeed ? (
              <button 
                onClick={() => navigate('/feed')}
                className={styles.cityLink}
                type="button"
              >
                <RiCommunityLine className={styles.cityLinkIcon} />
                <span>View Neighborhood Feed</span>
              </button>
            ) : (
              <button 
                onClick={() => navigate(`/city/${userCityId}`)}
                className={styles.cityLink}
                type="button"
              >
                <FiMapPin className={styles.cityLinkIcon} />
                <span>View City Feed</span>
              </button>
            )}
          </h1>
          <div className={styles.viewControls}>
            <div className={styles.tabButtons}>
              <button 
                className={`${styles.tabButton} ${!isCityFeed ? styles.active : ''}`}
                onClick={() => (isCityFeed ? navigate('/feed') : setActiveTab('neighborhood'))}
              >
                Neighborhood
              </button>
              <button 
                className={`${styles.tabButton} ${isCityFeed ? styles.active : ''}`}
                onClick={() => navigate(`/city/${userCityId}`)}
              >
                City
              </button>
            </div>
            <div className={styles.viewButtons}>
              <button 
                className={`${styles.viewButton} ${viewType === 'all' ? styles.active : ''}`}
                onClick={() => setViewType('all')}
              >
                All Posts
              </button>
              <button 
                className={`${styles.viewButton} ${viewType === 'alerts' ? styles.active : ''}`}
                onClick={() => setViewType('alerts')}
              >
                Alerts Only
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.postsContainer}>
        {filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No posts to show</h3>
            <p>Be the first to post in your {isCityFeed ? 'city' : 'neighborhood'}!</p>
            <button 
              onClick={() => setShowCreatePost(true)}
              className={styles.createPostButton}
            >
              Create Post
            </button>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={handleLike}
              onComment={handleComment}
              onSave={handleSave}
              onShare={handleShare}
            />
            ))
        )}
      </div>
      </main>
      
      {/* Right Sidebar removed as requested */}
      
      {/* Create Post Modal */}
      {showCreatePost && (
        <div className={styles.modalOverlay}>
          <CreatePost 
            onClose={() => setShowCreatePost(false)} 
            onSubmit={handleNewPost}
            user={user}
          />
        </div>
      )}
    </div>
  );
};

Feed.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    photoURL: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default Feed;
