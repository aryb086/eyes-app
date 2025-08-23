import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiImage, FiMapPin, FiUsers, FiGlobe, FiX } from 'react-icons/fi';
import styles from '../styles/createPost.module.css';

const CreatePost = ({ onClose, onSubmit, user }) => {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('neighborhood');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    
    setIsSubmitting(true);
    onSubmit(content, image);
    setContent('');
    setImage(null);
    setIsSubmitting(false);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImage(null);
  };

  return (
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h2>Create Post</h2>
        <button onClick={onClose} className={styles.closeButton}>
          <FiX size={24} />
        </button>
      </div>
      
      <div className={styles.authorInfo}>
        <img 
          src={user?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
          alt="User" 
          className={styles.authorAvatar}
        />
        <div>
          <div className={styles.authorName}>{user?.username || 'Anonymous'}</div>
          <div className={styles.privacySelector}>
            <select 
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className={styles.privacySelect}
            >
              <option value="neighborhood">
                <FiUsers /> Neighborhood
              </option>
              <option value="public">
                <FiGlobe /> Public
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.postForm}>
        <div className={styles.formGroup}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening in your neighborhood?"
            className={styles.postInput}
            rows={5}
            required
          />
          
          {image && (
            <div className={styles.imagePreview}>
              <img src={image} alt="Preview" className={styles.previewImage} />
              <button 
                type="button" 
                onClick={removeImage}
                className={styles.removeImageButton}
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
        
        <div className={styles.postActions}>
          <div className={styles.mediaButtons}>
            <label className={styles.mediaButton}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              <FiImage className={styles.mediaIcon} />
              <span>Photo</span>
            </label>
            
            <button type="button" className={styles.mediaButton}>
              <FiMapPin className={styles.mediaIcon} />
              <span>Location</span>
            </button>
          </div>
          
          <button 
            type="submit" 
            className={styles.postButton}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

CreatePost.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default CreatePost;
