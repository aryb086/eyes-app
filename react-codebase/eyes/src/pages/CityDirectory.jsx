import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStates, getCitiesByState } from '../services/locationService';
import styles from '../styles/cityDirectory.module.css';

const CityDirectory = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load states on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const statesData = getStates();
        setStates(statesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading location data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Update cities when selected state changes
  useEffect(() => {
    if (selectedState) {
      const citiesData = getCitiesByState(selectedState);
      setCities(citiesData);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  // Filter cities based on search query
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.neighborhoods.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading locations...</p>
      </div>
    );
  }

  return (
    <div className={styles.cityDirectory}>
      <div className={styles.header}>
        <h1>City Directory</h1>
        <p className={styles.subtitle}>
          Browse and explore cities and neighborhoods across the US
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.selectContainer}>
          <label htmlFor="state">Select a State:</label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className={styles.select}
          >
            <option value="">Choose a state</option>
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search cities or neighborhoods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            disabled={!selectedState}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {!selectedState ? (
        <div className={styles.prompt}>
          <p>Select a state to view available cities and neighborhoods</p>
        </div>
      ) : filteredCities.length === 0 ? (
        <div className={styles.noResults}>
          <p>No matching cities or neighborhoods found. Try a different search term.</p>
        </div>
      ) : (
        <div className={styles.citiesGrid}>
          {filteredCities.map((city) => (
            <div key={city.id} className={styles.cityCard}>
              <div className={styles.cityHeader}>
                <h2>
                  <Link to={`/city/${city.id}`} className={styles.cityLink}>
                    {city.name}, {states.find(s => s.code === selectedState)?.name}
                  </Link>
                </h2>
                <span className={styles.neighborhoodCount}>
                  {city.neighborhoods.length} neighborhoods
                </span>
              </div>
              
              <div className={styles.neighborhoods}>
                <h4>Neighborhoods:</h4>
                <div className={styles.neighborhoodTags}>
                  {city.neighborhoods.slice(0, 5).map((neighborhood, index) => (
                    <span key={index} className={styles.neighborhoodTag}>
                      {neighborhood}
                    </span>
                  ))}
                  {city.neighborhoods.length > 5 && (
                    <span className={styles.moreNeighborhoods}>
                      +{city.neighborhoods.length - 5} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className={styles.cityActions}>
                <Link 
                  to={`/city/${city.id}`} 
                  className={styles.viewButton}
                >
                  View City Feed
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityDirectory;
