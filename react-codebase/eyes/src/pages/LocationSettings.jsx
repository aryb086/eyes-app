import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../contexts/LocationContext';
import LocationSelector from '../components/common/LocationSelector';
import styles from '../styles/locationSettings.module.css';

const LocationSettings = () => {
  const navigate = useNavigate();
  const { saveUserLocation, getCurrentLocation } = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const currentLocation = getCurrentLocation();
  
  const handleSave = () => {
    const saved = saveUserLocation();
    if (saved) {
      setShowSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ← Back
        </button>
        <h1>Location Settings</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Your Current Location</h2>
          <p className={styles.currentLocation}>
            {currentLocation.neighborhood ? `${currentLocation.neighborhood}, ` : ''}
            {currentLocation.city}, {currentLocation.stateCode}
          </p>
          
          <div className={styles.divider}></div>
          
          <h2>Change Location</h2>
          <p className={styles.helpText}>
            Select your location to see relevant posts and connect with your community.
          </p>
          
          <div className={styles.selectorContainer}>
            <LocationSelector />
          </div>
          
          <div className={styles.buttonGroup}>
            <button 
              onClick={handleBack}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className={styles.saveButton}
            >
              Save Changes
            </button>
          </div>
          
          {showSuccess && (
            <div className={styles.successMessage}>
              ✓ Location updated successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSettings;
