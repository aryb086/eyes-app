import React from 'react';
import { useLocation } from '../../contexts/LocationContext';
import styles from '../../styles/locationSelector.module.css';

const LocationSelector = ({ showNeighborhood = true, className = '' }) => {
  const {
    stateCode,
    cityId,
    neighborhood,
    states,
    cities,
    neighborhoods,
    setStateCode,
    setCityId,
    setNeighborhood,
    saveUserLocation,
    isLoading
  } = useLocation();

  const handleSave = () => {
    const saved = saveUserLocation();
    if (saved) {
      // Show success message or update UI
      console.log('Location saved!');
    }
  };

  if (isLoading) {
    return <div>Loading location data...</div>;
  }

  return (
    <div className={`${styles.locationSelector} ${className}`}>
      <div className={styles.selectGroup}>
        <label htmlFor="state">State</label>
        <select
          id="state"
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
          className={styles.select}
        >
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.selectGroup}>
        <label htmlFor="city">City</label>
        <select
          id="city"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          className={styles.select}
          disabled={!stateCode}
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {showNeighborhood && (
        <div className={styles.selectGroup}>
          <label htmlFor="neighborhood">Neighborhood (Optional)</label>
          <select
            id="neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className={styles.select}
            disabled={!cityId}
          >
            <option value="">Select a neighborhood</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      <button 
        onClick={handleSave} 
        className={styles.saveButton}
        disabled={!stateCode || !cityId}
      >
        Save Location
      </button>
    </div>
  );
};

export default LocationSelector;
