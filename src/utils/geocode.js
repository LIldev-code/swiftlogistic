export const geocodeAddress = async (address) => {
  const controller = new AbortController();
  const signal = controller.signal;

  // Set a timeout for the request
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

  try {
    console.log(`Geocoding address: ${address}`);
    
    // If address is empty or undefined, return a default location
    if (!address || address.trim() === '') {
      console.warn('Empty address provided, using default coordinates');
      // Default to a central location (London coordinates)
      return [-0.1278, 51.5074];
    }
    
    // Clean and normalize the address
    const cleanAddress = address.trim();
    
    // First attempt: Try country-specific search
    // This is most reliable for country names
    try {
      const countryResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          cleanAddress
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1&types=country`,
        { signal }
      );
      
      if (countryResponse.ok) {
        const countryData = await countryResponse.json();
        if (countryData.features && countryData.features.length > 0) {
          const [countryLon, countryLat] = countryData.features[0].center;
          console.log(`Country geocoded coordinates: (${countryLat}, ${countryLon})`);
          return [countryLon, countryLat];
        }
      }
    } catch (err) {
      console.log('Country-specific search failed, trying general search');
    }
    
    // Second attempt: Try with multiple types for better results
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        cleanAddress
      )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1&types=country,region,place,locality,address`,
      { signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Geocoding request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Geocoding response data:", data); // Log the raw response data

    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].center;
      console.log(`Geocoded coordinates: (${lat}, ${lon})`);
      return [lon, lat]; // Return in order [longitude, latitude]
    } else {
      console.warn(`No geocoding result found for address: ${cleanAddress}`);
      
      // Third attempt: Try with just the first part of the address
      const firstPart = cleanAddress.split(',')[0].trim();
      const fallbackResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          firstPart
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`,
        { signal }
      );
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.features && fallbackData.features.length > 0) {
          const [fallbackLon, fallbackLat] = fallbackData.features[0].center;
          console.log(`Fallback geocoded coordinates: (${fallbackLat}, ${fallbackLon})`);
          return [fallbackLon, fallbackLat];
        }
      }
      
      // Fourth attempt: Try with a worldwide search with no type restrictions
      try {
        const worldwideResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            cleanAddress
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1&autocomplete=true`,
          { signal }
        );
        
        if (worldwideResponse.ok) {
          const worldwideData = await worldwideResponse.json();
          if (worldwideData.features && worldwideData.features.length > 0) {
            const [worldwideLon, worldwideLat] = worldwideData.features[0].center;
            console.log(`Worldwide search coordinates: (${worldwideLat}, ${worldwideLon})`);
            return [worldwideLon, worldwideLat];
          }
        }
      } catch (err) {
        console.log('Worldwide search failed');
      }
      
      // Fifth attempt: Check our predefined list as a last resort
      const countryCoordinates = getCountryCoordinates(cleanAddress);
      if (countryCoordinates) {
        console.log(`Using predefined coordinates for location: ${cleanAddress}`);
        return countryCoordinates;
      }
      
      // Last resort: try to match partial country names from our list
      for (const [country, coords] of Object.entries(commonCountries)) {
        if (cleanAddress.toLowerCase().includes(country.toLowerCase())) {
          console.log(`Matched with predefined country: ${country}`);
          return coords;
        }
      }
      
      // Absolute last resort: return a default location
      console.warn('All geocoding attempts failed, using default coordinates');
      return [-0.1278, 51.5074]; // Default to London
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Geocoding request timed out");
    } else {
      console.error("Geocoding error:", error);
    }
    // Return a default location instead of null
    return [-0.1278, 51.5074]; // Default to London
  }
};

// Function to get coordinates for common countries and cities
const getCountryCoordinates = (address) => {
  const normalizedAddress = address.toLowerCase().trim();
  
  // Direct match
  if (commonCountries[normalizedAddress]) {
    return commonCountries[normalizedAddress];
  }
  
  // Check for variations (with spaces, commas, etc.)
  for (const [location, coords] of Object.entries(commonCountries)) {
    if (normalizedAddress === location.toLowerCase() || 
        normalizedAddress === location.toLowerCase() + ' ' || 
        normalizedAddress.startsWith(location.toLowerCase() + ',') ||
        normalizedAddress.endsWith(', ' + location.toLowerCase())) {
      return coords;
    }
  }
  
  return null;
};

// Common countries and cities with their coordinates [longitude, latitude]
const commonCountries = {
  // Europe
  'romania': [25.0136, 45.9443],
  'bucharest': [26.1025, 44.4268],
  'uk': [-3.4360, 55.3781],
  'united kingdom': [-3.4360, 55.3781],
  'london': [-0.1278, 51.5074],
  'england': [-1.1743, 52.3555],
  'france': [2.2137, 46.2276],
  'paris': [2.3522, 48.8566],
  'germany': [10.4515, 51.1657],
  'berlin': [13.4050, 52.5200],
  'italy': [12.5674, 41.8719],
  'rome': [12.4964, 41.9028],
  'spain': [-3.7492, 40.4637],
  'madrid': [-3.7038, 40.4168],
  'portugal': [-8.2245, 39.3999],
  'lisbon': [-9.1393, 38.7223],
  'netherlands': [5.2913, 52.1326],
  'amsterdam': [4.9041, 52.3676],
  'belgium': [4.4699, 50.5039],
  'brussels': [4.3517, 50.8503],
  'switzerland': [8.2275, 46.8182],
  'zurich': [8.5417, 47.3769],
  'austria': [13.3333, 47.3333],
  'vienna': [16.3738, 48.2082],
  'greece': [21.8243, 39.0742],
  'athens': [23.7275, 37.9838],
  'poland': [19.1451, 51.9194],
  'warsaw': [21.0122, 52.2297],
  'sweden': [18.6435, 60.1282],
  'stockholm': [18.0686, 59.3293],
  'norway': [8.4689, 60.4720],
  'oslo': [10.7522, 59.9139],
  'finland': [25.7482, 61.9241],
  'helsinki': [24.9384, 60.1699],
  'denmark': [9.5018, 56.2639],
  'copenhagen': [12.5683, 55.6761],
  'ireland': [-8.2439, 53.4129],
  'dublin': [-6.2603, 53.3498],
  'hungary': [19.5033, 47.1625],
  'budapest': [19.0402, 47.4979],
  'czech republic': [15.4730, 49.8175],
  'prague': [14.4378, 50.0755],
  'bulgaria': [25.4858, 42.7339],
  'sofia': [23.3219, 42.6977],
  'croatia': [15.2000, 45.1000],
  'zagreb': [15.9819, 45.8150],
  'serbia': [21.0059, 44.0165],
  'belgrade': [20.4612, 44.8125],
  'ukraine': [31.1656, 48.3794],
  'kyiv': [30.5234, 50.4501],
  'belarus': [27.9534, 53.7098],
  'minsk': [27.5615, 53.9045],
  'slovakia': [19.6990, 48.6690],
  'bratislava': [17.1077, 48.1486],
  'slovenia': [14.9955, 46.1512],
  'ljubljana': [14.5058, 46.0569],
  'estonia': [25.0136, 58.5953],
  'tallinn': [24.7536, 59.4370],
  'latvia': [24.6032, 56.8796],
  'riga': [24.1052, 56.9496],
  'lithuania': [23.8813, 55.1694],
  'vilnius': [25.2797, 54.6872],
  'moldova': [28.3699, 47.4116],
  'chisinau': [28.8575, 47.0105],
  
  // Africa
  'cameroon': [12.3547, 7.3697],
  'douala': [9.7679, 4.0511],
  'yaounde': [11.5021, 3.8480],
  'nigeria': [8.6753, 9.0820],
  'lagos': [3.3792, 6.5244],
  'abuja': [7.4951, 9.0579],
  'south africa': [22.9375, -30.5595],
  'cape town': [18.4241, -33.9249],
  'johannesburg': [28.0473, -26.2041],
  'egypt': [30.8025, 26.8206],
  'cairo': [31.2357, 30.0444],
  'morocco': [-7.0926, 31.7917],
  'casablanca': [-7.5898, 33.5731],
  'kenya': [37.9062, -0.0236],
  'nairobi': [36.8219, -1.2921],
  'ghana': [-1.0232, 7.9465],
  'accra': [-0.1870, 5.6037],
  'ethiopia': [40.4897, 9.1450],
  'addis ababa': [38.7578, 8.9806],
  'algeria': [1.6596, 28.0339],
  'algiers': [3.0588, 36.7538],
  'tunisia': [9.5375, 33.8869],
  'tunis': [10.1815, 36.8065],
  'senegal': [-14.4524, 14.4974],
  'dakar': [-17.4440, 14.7167],
  
  // Americas
  'usa': [-95.7129, 37.0902],
  'united states': [-95.7129, 37.0902],
  'new york': [-74.0060, 40.7128],
  'los angeles': [-118.2437, 34.0522],
  'chicago': [-87.6298, 41.8781],
  'canada': [-106.3468, 56.1304],
  'toronto': [-79.3832, 43.6532],
  'vancouver': [-123.1207, 49.2827],
  'mexico': [-102.5528, 23.6345],
  'mexico city': [-99.1332, 19.4326],
  'brazil': [-51.9253, -14.2350],
  'sao paulo': [-46.6333, -23.5505],
  'rio de janeiro': [-43.1729, -22.9068],
  'argentina': [-63.6167, -38.4161],
  'buenos aires': [-58.3816, -34.6037],
  'colombia': [-74.2973, 4.5709],
  'bogota': [-74.0721, 4.7110],
  'peru': [-75.0152, -9.1900],
  'lima': [-77.0428, -12.0464],
  'chile': [-71.5430, -35.6751],
  'santiago': [-70.6693, -33.4489],
  
  // Asia
  'china': [104.1954, 35.8617],
  'beijing': [116.4074, 39.9042],
  'shanghai': [121.4737, 31.2304],
  'japan': [138.2529, 36.2048],
  'tokyo': [139.6917, 35.6895],
  'india': [78.9629, 20.5937],
  'new delhi': [77.2090, 28.6139],
  'mumbai': [72.8777, 19.0760],
  'russia': [105.3188, 61.5240],
  'moscow': [37.6173, 55.7558],
  'south korea': [127.9785, 35.9078],
  'seoul': [126.9780, 37.5665],
  'thailand': [100.9925, 15.8700],
  'bangkok': [100.5018, 13.7563],
  'vietnam': [108.2772, 14.0583],
  'hanoi': [105.8342, 21.0278],
  'indonesia': [113.9213, -0.7893],
  'jakarta': [106.8456, -6.2088],
  'malaysia': [101.9758, 4.2105],
  'kuala lumpur': [101.6869, 3.1390],
  'singapore': [103.8198, 1.3521],
  'philippines': [121.7740, 12.8797],
  'manila': [120.9842, 14.5995],
  'pakistan': [69.3451, 30.3753],
  'islamabad': [73.0479, 33.6844],
  'saudi arabia': [45.0792, 23.8859],
  'riyadh': [46.7219, 24.7136],
  'united arab emirates': [53.8478, 23.4241],
  'dubai': [55.2708, 25.2048],
  'israel': [34.8516, 31.0461],
  'tel aviv': [34.7818, 32.0853],
  'turkey': [35.2433, 38.9637],
  'istanbul': [28.9784, 41.0082],
  'iran': [53.6880, 32.4279],
  'tehran': [51.3890, 35.6892],
  
  // Oceania
  'australia': [133.7751, -25.2744],
  'sydney': [151.2093, -33.8688],
  'melbourne': [144.9631, -37.8136],
  'new zealand': [174.8860, -40.9006],
  'auckland': [174.7633, -36.8485],
  'wellington': [174.7762, -41.2865]
};
