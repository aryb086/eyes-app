import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiMapPin, FiPhone, FiSave, FiLogOut } from 'react-icons/fi';
import styles from '../components/feed/styles/settings.module.css';

const Settings = () => {
  const { currentUser, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    address: '',
    neighborhood: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        address: currentUser.address || '',
        neighborhood: currentUser.neighborhood || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setLoading(true);
      await updateUser({
        displayName: formData.displayName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        neighborhood: formData.neighborhood,
        ...(formData.password && { password: formData.password })
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };
  
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsCard}>
        <h2 className={styles.settingsTitle}>Account Settings</h2>
        
        {error && <div className={styles.alertError}>{error}</div>}
        {success && <div className={styles.alertSuccess}>{success}</div>}
        
        <form onSubmit={handleSubmit} className={styles.settingsForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FiUser className={styles.inputIcon} />
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FiMail className={styles.inputIcon} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FiPhone className={styles.inputIcon} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FiMapPin className={styles.inputIcon} />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your address"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FiMapPin className={styles.inputIcon} />
              Neighborhood
            </label>
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your neighborhood"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FiLock className={styles.inputIcon} />
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter new password"
            />
          </div>
          
          {formData.password && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <FiLock className={styles.inputIcon} />
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Confirm new password"
              />
            </div>
          )}
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={loading}
            >
              <FiSave className={styles.buttonIcon} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button 
              type="button" 
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              <FiLogOut className={styles.buttonIcon} />
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
