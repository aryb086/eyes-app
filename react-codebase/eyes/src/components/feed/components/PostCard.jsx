import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  FiHeart, 
  FiMessageCircle, 
  FiShare2, 
  FiBookmark, 
  FiMoreHorizontal, 
  FiX,
  FiSend
} from 'react-icons/fi';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import styles from '../styles/postCard.module.css';

const PostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onSave, 
  onShare 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() && onComment) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    if (onSave) {
      onSave(post.id, newSavedState);
    }
  };

  const handleShare = async () => {
    try {
      // In a real app, this would generate a shareable link
      const link = `${window.location.origin}/post/${post.id}`;
      setShareLink(link);
      
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post',
          text: post.content.substring(0, 100) + '...',
          url: link,
        });
        // Call the parent's onShare handler after successful share
        onShare && onShare(post.id);
      } else {
        setIsSharing(true);
        // For non-share API, we'll call onShare when the link is copied
        // This will be handled in the copyToClipboard function
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Only log the error if it's not an 'AbortError' (user cancelled the share)
      if (error.name !== 'AbortError') {
        // Show error to user in a real app
        console.error('Error sharing post:', error);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      // Call the parent's onShare handler after successful copy
      onShare && onShare(post.id);
      setIsSharing(false);
      // Show a toast or notification in a real app
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
      // Optionally show an error message to the user
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <article className={`${styles.postCard} ${post.type === 'alert' ? styles.alert : ''} ${post.type === 'event' ? styles.event : ''}`}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img 
            src={post.author?.avatar || post.author?.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
            alt={post.author?.fullName || post.author?.username} 
            className={styles.avatar}
          />
          <div>
            <h3 className={styles.userName}>{post.author?.fullName || post.author?.username}</h3>
            <div className={styles.postMeta}>
                              <span className={styles.userLocation}>{post.neighborhood}, {post.city}</span>
              <span className={styles.dotSeparator}>•</span>
              <span className={styles.timestamp}>{post.timestamp}</span>
              {post.type === 'alert' && (
                <span className={styles.postBadge}>Alert</span>
              )}
              {post.type === 'event' && (
                <span className={`${styles.postBadge} ${styles.eventBadge}`}>Event</span>
              )}
            </div>
          </div>
        </div>
        <button className={styles.moreButton}>
          <FiMoreHorizontal />
        </button>
      </div>
      
      <div className={styles.postContent}>
        {post.content && <p>{post.content}</p>}
        {post.image && (
          <div className={styles.postImage}>
            <img 
              src={post.image} 
              alt="Post content" 
              onError={(e) => {
                console.error('Error loading image:', post.image);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
      
      <div className={styles.postStats}>
        <div className={styles.likes}>
          <span className={styles.likeIcon}></span>
          <span>{formatNumber(post.likes)}</span>
        </div>
        <div className={styles.comments}>
          <span>{post.commentsCount || 0} comments</span>
          <span className={styles.dotSeparator}>•</span>
          <span>{post.shares || 0} shares</span>
          <span className={styles.dotSeparator}>•</span>
          <span>{post.saves || 0} saves</span>
        </div>
      </div>
      
      <div className={styles.postActions}>
        <button 
          className={`${styles.actionButton} ${post.isLiked ? styles.liked : ''}`}
          onClick={() => onLike(post.id)}
        >
          {post.isLiked ? (
            <FaHeart className={styles.actionIcon} />
          ) : (
            <FiHeart className={styles.actionIcon} />
          )}
          <span>Like</span>
        </button>
        
        <button 
          className={`${styles.actionButton} ${showComments ? styles.active : ''}`}
          onClick={() => setShowComments(!showComments)}
        >
          <FiMessageCircle className={styles.actionIcon} />
          <span>Comment</span>
        </button>
        
        <button 
          className={styles.actionButton}
          onClick={handleShare}
        >
          <FiShare2 className={styles.actionIcon} />
          <span>Share</span>
        </button>
        
        <button 
          className={`${styles.actionButton} ${isSaved ? styles.saved : ''}`}
          onClick={handleSave}
        >
          {isSaved ? (
            <FaBookmark className={styles.actionIcon} />
          ) : (
            <FiBookmark className={styles.actionIcon} />
          )}
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className={styles.commentsSection}>
          <div className={styles.commentsList}>
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <img 
                    src={comment.user.avatar} 
                    alt={comment.user.name} 
                    className={styles.commentAvatar}
                  />
                  <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentUser}>{comment.user.name}</span>
                      <span className={styles.commentTime}>{comment.timestamp}</span>
                    </div>
                    <p className={styles.commentText}>{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
            )}
          </div>
          
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className={styles.commentInput}
            />
            <button 
              type="submit" 
              className={styles.commentSubmit}
              disabled={!commentText.trim()}
            >
              <FiSend />
            </button>
          </form>
        </div>
      )}

      {/* Share Modal */}
      {isSharing && (
        <div className={styles.modalOverlay}>
          <div className={styles.shareModal}>
            <div className={styles.modalHeader}>
              <h3>Share Post</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsSharing(false)}
              >
                <FiX />
              </button>
            </div>
            <div className={styles.shareContent}>
              <p>Copy this link to share:</p>
              <div className={styles.linkContainer}>
                <input 
                  type="text" 
                  value={shareLink} 
                  readOnly 
                  className={styles.shareLink}
                />
                <button 
                  onClick={copyToClipboard}
                  className={styles.copyButton}
                >
                  Copy
                </button>
              </div>
              <div className={styles.shareOptions}>
                <button className={styles.shareOption}>
                  <span className={styles.shareIcon}>📱</span>
                  <span>Message</span>
                </button>
                <button className={styles.shareOption}>
                  <span className={styles.shareIcon}>✉️</span>
                  <span>Email</span>
                </button>
                <button className={styles.shareOption}>
                  <span className={styles.shareIcon}>🔗</span>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
    isLiked: PropTypes.bool,
    type: PropTypes.oneOf(['post', 'alert', 'event']),
    image: PropTypes.string,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
};

export default PostCard;
