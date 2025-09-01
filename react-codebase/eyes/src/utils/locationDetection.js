// Location detection utility for parsing addresses and detecting cities/neighborhoods

// Common cities and their neighborhoods
const CITY_DATA = {
  'seattle': {
    name: 'Seattle',
    state: 'WA',
    neighborhoods: {
      'capitol hill': 'Capitol Hill',
      'downtown': 'Downtown Seattle',
      'ballard': 'Ballard',
      'fremont': 'Fremont',
      'queen anne': 'Queen Anne',
      'belltown': 'Belltown',
      'first hill': 'First Hill',
      'central district': 'Central District',
      'madrona': 'Madrona',
      'madison valley': 'Madison Valley',
      'lake union': 'Lake Union',
      'south lake union': 'South Lake Union',
      'pioneer square': 'Pioneer Square',
      'international district': 'International District',
      'chinatown': 'Chinatown',
      'georgetown': 'Georgetown',
      'west seattle': 'West Seattle',
      'alki': 'Alki',
      'columbia city': 'Columbia City',
      'beacon hill': 'Beacon Hill',
      'mount baker': 'Mount Baker',
      'rainier valley': 'Rainier Valley',
      'university district': 'University District',
      'udistrict': 'University District',
      'u district': 'University District',
      'greenwood': 'Greenwood',
      'phinney ridge': 'Phinney Ridge',
      'wallingford': 'Wallingford',
      'green lake': 'Green Lake',
      'lake city': 'Lake City',
      'northgate': 'Northgate',
      'maple leaf': 'Maple Leaf',
      'roosevelt': 'Roosevelt',
      'wedgwood': 'Wedgwood',
      'bryant': 'Bryant',
      'view ridge': 'View Ridge',
      'laurelhurst': 'Laurelhurst',
      'windermere': 'Windermere',
      'sand point': 'Sand Point',
      'magnolia': 'Magnolia',
      'interbay': 'Interbay',
      'lower queen anne': 'Lower Queen Anne',
      'upper queen anne': 'Upper Queen Anne'
    }
  },
  'new york': {
    name: 'New York',
    state: 'NY',
    neighborhoods: {
      'manhattan': 'Manhattan',
      'brooklyn': 'Brooklyn',
      'queens': 'Queens',
      'bronx': 'Bronx',
      'staten island': 'Staten Island',
      'times square': 'Times Square',
      'soho': 'SoHo',
      'chelsea': 'Chelsea',
      'greenwich village': 'Greenwich Village',
      'east village': 'East Village',
      'lower east side': 'Lower East Side',
      'upper east side': 'Upper East Side',
      'upper west side': 'Upper West Side',
      'harlem': 'Harlem',
      'washington heights': 'Washington Heights',
      'williamsburg': 'Williamsburg',
      'dumbo': 'DUMBO',
      'park slope': 'Park Slope',
      'prospect heights': 'Prospect Heights',
      'fort greene': 'Fort Greene',
      'cobble hill': 'Cobble Hill',
      'boerum hill': 'Boerum Hill',
      'carroll gardens': 'Carroll Gardens',
      'red hook': 'Red Hook',
      'gowanus': 'Gowanus',
      'sunset park': 'Sunset Park',
      'bay ridge': 'Bay Ridge',
      'bensonhurst': 'Bensonhurst',
      'sheepshead bay': 'Sheepshead Bay',
      'brighton beach': 'Brighton Beach',
      'coney island': 'Coney Island',
      'astoria': 'Astoria',
      'long island city': 'Long Island City',
      'sunnyside': 'Sunnyside',
      'woodside': 'Woodside',
      'jackson heights': 'Jackson Heights',
      'elmhurst': 'Elmhurst',
      'corona': 'Corona',
      'flushing': 'Flushing',
      'bayside': 'Bayside',
      'douglaston': 'Douglaston',
      'little neck': 'Little Neck',
      'jamaica': 'Jamaica',
      'st. albans': 'St. Albans',
      'springfield gardens': 'Springfield Gardens',
      'ozone park': 'Ozone Park',
      'howard beach': 'Howard Beach',
      'rockaway': 'Rockaway',
      'far rockaway': 'Far Rockaway'
    }
  },
  'los angeles': {
    name: 'Los Angeles',
    state: 'CA',
    neighborhoods: {
      'downtown': 'Downtown LA',
      'hollywood': 'Hollywood',
      'beverly hills': 'Beverly Hills',
      'santa monica': 'Santa Monica',
      'venice': 'Venice',
      'marina del rey': 'Marina del Rey',
      'culver city': 'Culver City',
      'west hollywood': 'West Hollywood',
      'weho': 'West Hollywood',
      'silver lake': 'Silver Lake',
      'echo park': 'Echo Park',
      'los feliz': 'Los Feliz',
      'koreatown': 'Koreatown',
      'midtown': 'Midtown',
      'westlake': 'Westlake',
      'macarthur park': 'MacArthur Park',
      'pico union': 'Pico Union',
      'west adams': 'West Adams',
      'jefferson park': 'Jefferson Park',
      'leimert park': 'Leimert Park',
      'baldwin hills': 'Baldwin Hills',
      'crenshaw': 'Crenshaw',
      'inglewood': 'Inglewood',
      'compton': 'Compton',
      'gardena': 'Gardena',
      'torrance': 'Torrance',
      'redondo beach': 'Redondo Beach',
      'manhattan beach': 'Manhattan Beach',
      'hermosa beach': 'Hermosa Beach',
      'el segundo': 'El Segundo',
      'playa del rey': 'Playa del Rey',
      'playa vista': 'Playa Vista',
      'brentwood': 'Brentwood',
      'bel air': 'Bel Air',
      'encino': 'Encino',
      'sherman oaks': 'Sherman Oaks',
      'studio city': 'Studio City',
      'north hollywood': 'North Hollywood',
      'noho': 'North Hollywood',
      'tujunga': 'Tujunga',
      'sunland': 'Sunland',
      'glendale': 'Glendale',
      'burbank': 'Burbank',
      'pasadena': 'Pasadena',
      'altadena': 'Altadena',
      'sierra madre': 'Sierra Madre',
      'arcadia': 'Arcadia',
      'monrovia': 'Monrovia',
      'duarte': 'Duarte',
      'azusa': 'Azusa',
      'covina': 'Covina',
      'west covina': 'West Covina',
      'diamond bar': 'Diamond Bar',
      'walnut': 'Walnut',
      'rowland heights': 'Rowland Heights',
      'hacienda heights': 'Hacienda Heights',
      'la habra': 'La Habra',
      'fullerton': 'Fullerton',
      'brea': 'Brea',
      'yorba linda': 'Yorba Linda',
      'anaheim': 'Anaheim',
      'garden grove': 'Garden Grove',
      'westminster': 'Westminster',
      'huntington beach': 'Huntington Beach',
      'fountain valley': 'Fountain Valley',
      'costa mesa': 'Costa Mesa',
      'newport beach': 'Newport Beach',
      'irvine': 'Irvine',
      'lake forest': 'Lake Forest',
      'mission viejo': 'Mission Viejo',
      'laguna beach': 'Laguna Beach',
      'dana point': 'Dana Point',
      'san clemente': 'San Clemente',
      'san juan capistrano': 'San Juan Capistrano'
    }
  },
  'chicago': {
    name: 'Chicago',
    state: 'IL',
    neighborhoods: {
      'downtown': 'The Loop',
      'loop': 'The Loop',
      'river north': 'River North',
      'gold coast': 'Gold Coast',
      'old town': 'Old Town',
      'lincoln park': 'Lincoln Park',
      'lakeview': 'Lakeview',
      'wrigleyville': 'Wrigleyville',
      'boystown': 'Boystown',
      'andersonville': 'Andersonville',
      'uptown': 'Uptown',
      'edgewater': 'Edgewater',
      'rogers park': 'Rogers Park',
      'west loop': 'West Loop',
      'fulton market': 'Fulton Market',
      'south loop': 'South Loop',
      'printers row': 'Printers Row',
      'bronzeville': 'Bronzeville',
      'hyde park': 'Hyde Park',
      'kenwood': 'Kenwood',
      'woodlawn': 'Woodlawn',
      'south shore': 'South Shore',
      'chatham': 'Chatham',
      'auburn gresham': 'Auburn Gresham',
      'englewood': 'Englewood',
      'west englewood': 'West Englewood',
      'back of the yards': 'Back of the Yards',
      'bridgeport': 'Bridgeport',
      'chinatown': 'Chinatown',
      'pilsen': 'Pilsen',
      'little village': 'Little Village',
      'lawndale': 'Lawndale',
      'austin': 'Austin',
      'oak park': 'Oak Park',
      'forest park': 'Forest Park',
      'berwyn': 'Berwyn',
      'cicero': 'Cicero',
      'summit': 'Summit',
      'willow springs': 'Willow Springs',
      'burr ridge': 'Burr Ridge',
      'hinsdale': 'Hinsdale',
      'western springs': 'Western Springs',
      'la grange': 'La Grange',
      'countryside': 'Countryside',
      'hickory hills': 'Hickory Hills',
      'orland park': 'Orland Park',
      'tinley park': 'Tinley Park',
      'oak lawn': 'Oak Lawn',
      'beverly': 'Beverly',
      'morgan park': 'Morgan Park',
      'mount greenwood': 'Mount Greenwood',
      'evergreen park': 'Evergreen Park',
      'oak forest': 'Oak Forest',
      'orland hills': 'Orland Hills',
      'mokena': 'Mokena',
      'new lenox': 'New Lenox',
      'frankfort': 'Frankfort',
      'matteson': 'Matteson',
      'park forest': 'Park Forest',
      'homewood': 'Homewood',
      'flossmoor': 'Flossmoor',
      'olympia fields': 'Olympia Fields',
      'country club hills': 'Country Club Hills',
      'hazel crest': 'Hazel Crest',
      'markham': 'Markham',
      'harvey': 'Harvey',
      'dolton': 'Dolton',
      'calumet city': 'Calumet City',
      'lansing': 'Lansing',
      'lynwood': 'Lynwood',
      'south holland': 'South Holland',
      'riverdale': 'Riverdale',
      'blue island': 'Blue Island',
      'midlothian': 'Midlothian',
      'crestwood': 'Crestwood',
      'palos heights': 'Palos Heights',
      'palos park': 'Palos Park',
      'palos hills': 'Palos Hills',
      'worth': 'Worth',
      'bedford park': 'Bedford Park',
      'summit argo': 'Summit Argo',
      'forest view': 'Forest View',
      'stickney': 'Stickney',
      'burbank': 'Burbank'
    }
  }
};

// Function to detect city and neighborhood from address
export const detectLocationFromAddress = (address) => {
  const addressLower = address.toLowerCase();
  
  // Detect city
  let detectedCity = null;
  let detectedNeighborhood = null;
  let detectedState = null;
  
  for (const [cityKey, cityData] of Object.entries(CITY_DATA)) {
    if (addressLower.includes(cityKey)) {
      detectedCity = cityData.name;
      detectedState = cityData.state;
      
      // Detect neighborhood within the city
      for (const [neighborhoodKey, neighborhoodName] of Object.entries(cityData.neighborhoods)) {
        if (addressLower.includes(neighborhoodKey)) {
          detectedNeighborhood = neighborhoodName;
          break;
        }
      }
      break;
    }
  }
  
  // If no specific neighborhood found, try to infer from common patterns
  if (!detectedNeighborhood && detectedCity) {
    const cityData = CITY_DATA[detectedCity.toLowerCase()];
    if (cityData) {
      // Look for street names or area indicators
      for (const [neighborhoodKey, neighborhoodName] of Object.entries(cityData.neighborhoods)) {
        if (addressLower.includes(neighborhoodKey.replace(' ', '')) || 
            addressLower.includes(neighborhoodKey.replace(' ', '-'))) {
          detectedNeighborhood = neighborhoodName;
          break;
        }
      }
    }
  }
  
  // Fallback neighborhood if none detected
  if (detectedCity && !detectedNeighborhood) {
    const cityData = CITY_DATA[detectedCity.toLowerCase()];
    if (cityData) {
      // Get first neighborhood as fallback
      detectedNeighborhood = Object.values(cityData.neighborhoods)[0];
    }
  }
  
  return {
    city: detectedCity || 'Demo City',
    neighborhood: detectedNeighborhood || 'Demo Neighborhood',
    state: detectedState || 'Demo State',
    country: 'USA',
    address: address,
    coordinates: [47.6062, -122.3321], // Default Seattle coordinates
    zipCode: '98102' // Default zip
  };
};

// Function to get nearby neighborhoods for a detected location
export const getNearbyNeighborhoods = (city, detectedNeighborhood) => {
  const cityData = CITY_DATA[city.toLowerCase()];
  if (!cityData) {
    return [
      { id: 1, name: 'Demo Neighborhood', distance: '0.2 miles', city: city },
      { id: 2, name: 'Demo Area', distance: '0.5 miles', city: city }
    ];
  }
  
  const neighborhoods = Object.entries(cityData.neighborhoods).map(([key, name], index) => ({
    id: index + 1,
    name: name,
    distance: `${(Math.random() * 2 + 0.1).toFixed(1)} miles`,
    city: city
  }));
  
  // Sort by distance (put detected neighborhood first)
  neighborhoods.sort((a, b) => {
    if (a.name === detectedNeighborhood) return -1;
    if (b.name === detectedNeighborhood) return 1;
    return parseFloat(a.distance) - parseFloat(b.distance);
  });
  
  return neighborhoods.slice(0, 8); // Return top 8 neighborhoods
};

// Function to reverse geocode coordinates (simulated)
export const reverseGeocodeCoordinates = async (latitude, longitude) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, return Seattle location
  // In production, this would call a real geocoding service
  return {
    city: 'Seattle',
    neighborhood: 'Capitol Hill',
    state: 'WA',
    country: 'USA',
    address: 'Auto-detected from GPS',
    coordinates: [latitude, longitude],
    zipCode: '98102'
  };
};
