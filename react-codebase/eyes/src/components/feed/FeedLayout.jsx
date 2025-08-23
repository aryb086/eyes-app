import React from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { FiHome, FiCompass, FiBell, FiBookmark, FiSettings, FiMapPin } from 'react-icons/fi';
import { RiCommunityLine } from 'react-icons/ri';
import { useLocation } from '../../contexts/LocationContext';
import styles from './styles/feed.module.css';

const FeedLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const pathname = routerLocation?.pathname || '';
  const { cityId: userCityId } = useLocation();

  return (
    <div className={styles.feedContainer}>
      {/* Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Eyes</div>

        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${pathname === '/feed' ? styles.active : ''}`}
            onClick={() => navigate('/feed')}
          >
            <FiHome className={styles.navIcon} />
            <span>Home</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${pathname === '/feed' ? styles.active : ''}`}
            onClick={() => navigate('/feed')}
          >
            <RiCommunityLine className={styles.navIcon} />
            <span>Neighborhood</span>
          </button>

          <button 
            className={`${styles.navItem} ${pathname.startsWith('/city/') ? styles.active : ''}`}
            onClick={() => navigate(`/city/${userCityId}`)}
          >
            <FiMapPin className={styles.navIcon} />
            <span>City</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${pathname.startsWith('/explore') ? styles.active : ''}`}
            onClick={() => navigate('/explore')}
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

        {/* Optional: Create Post still here if needed for consistency */}
        <button className={styles.createPostButton} onClick={() => navigate('/feed')}>
          Create Post
        </button>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.feedHeader}>
          <h1 className={styles.feedTitleRow}>
            <span className={styles.feedTitleText}>{title}</span>
          </h1>
        </div>

        <div className={styles.postsContainer}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default FeedLayout;
