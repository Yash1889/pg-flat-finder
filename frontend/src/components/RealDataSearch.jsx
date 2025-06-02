import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons for different accommodation types
const accommodationIcons = {
  hostel: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  hotel: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  dormitory: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  apartments: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  guest_house: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  default: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

function RealDataSearch() {
  // State
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(2);
  const [accommodationTypes, setAccommodationTypes] = useState(['hostel', 'dormitory', 'apartments', 'guest_house']);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.7041, 77.1025]); // Default: Delhi
  const [mapZoom, setMapZoom] = useState(12);
  const [searchLocation, setSearchLocation] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  
  const mapRef = useRef(null);
  
  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!location.trim()) {
      setError('Please enter a location to search');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/v1/osm/search`, {
        params: {
          query: location,
          radius_km: radius,
          accommodation_types: accommodationTypes
        }
      });
      
      if (response.data.success) {
        setResults(response.data.results);
        
        // Update map center
        const searchLoc = response.data.location;
        setSearchLocation(searchLoc);
        setMapCenter([searchLoc.latitude, searchLoc.longitude]);
        setMapZoom(13);
        
        if (response.data.results.length === 0) {
          setError(`No accommodations found near ${location}. Try increasing the search radius or searching a different area.`);
        }
      } else {
        setError(response.data.message || 'Search failed');
        setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error searching for accommodations. Please try again later.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle accommodation type selection
  const handleTypeChange = (type) => {
    if (accommodationTypes.includes(type)) {
      setAccommodationTypes(accommodationTypes.filter(t => t !== type));
    } else {
      setAccommodationTypes([...accommodationTypes, type]);
    }
  };
  
  // Select a result for highlighting
  const handleResultClick = (result) => {
    setSelectedResult(result);
    setMapCenter([result.latitude, result.longitude]);
    setMapZoom(16);
  };
  
  // Get icon for accommodation type
  const getIcon = (type) => {
    return accommodationIcons[type] || accommodationIcons.default;
  };
  
  return (
    <div className="real-data-search">
      <div className="search-container">
        <h1 className="text-2xl font-bold mb-4">Find PG, Hostel & Apartments</h1>
        
        <form onSubmit={handleSearch} className="search-form mb-4">
          <div className="mb-3">
            <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              id="location"
              placeholder="Enter city, area or landmark"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="radius" className="block text-sm font-medium mb-1">Search Radius (km): {radius}</label>
            <input
              type="range"
              id="radius"
              min="0.5"
              max="10"
              step="0.5"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="mb-3">
            <p className="block text-sm font-medium mb-1">Accommodation Types</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={accommodationTypes.includes('hostel')}
                  onChange={() => handleTypeChange('hostel')}
                  className="mr-2"
                />
                Hostel
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={accommodationTypes.includes('dormitory')}
                  onChange={() => handleTypeChange('dormitory')}
                  className="mr-2"
                />
                Dormitory
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={accommodationTypes.includes('apartments')}
                  onChange={() => handleTypeChange('apartments')}
                  className="mr-2"
                />
                Apartments
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={accommodationTypes.includes('guest_house')}
                  onChange={() => handleTypeChange('guest_house')}
                  className="mr-2"
                />
                Guest House
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={accommodationTypes.includes('hotel')}
                  onChange={() => handleTypeChange('hotel')}
                  className="mr-2"
                />
                Hotel
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={accommodationTypes.includes('pg')}
                  onChange={() => handleTypeChange('pg')}
                  className="mr-2"
                />
                PG
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {error && (
          <div className="error-message bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
      </div>
      
      <div className="results-container grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="results-list md:col-span-1 overflow-y-auto max-h-[600px]">
          <h2 className="text-lg font-semibold mb-2">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </h2>
          
          {results.map((result, index) => (
            <div
              key={`result-${result.id}-${result.type}-${index}`}
              className={`result-card p-3 mb-2 rounded-md cursor-pointer border hover:border-blue-500 ${
                selectedResult && selectedResult.id === result.id && selectedResult.latitude === result.latitude ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onClick={() => handleResultClick(result)}
            >
              <h3 className="text-md font-semibold">{result.name}</h3>
              <p className="text-sm text-gray-600">Type: {result.type}</p>
              {result.address.street && (
                <p className="text-sm">{result.address.street} {result.address.housenumber}</p>
              )}
              {result.contact.phone && (
                <p className="text-sm">Phone: {result.contact.phone}</p>
              )}
              {result.contact.website && (
                <p className="text-sm">
                  <a 
                    href={result.contact.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Website
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
        
        <div className="map-container md:col-span-2 h-[600px] rounded-md overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Search location marker */}
            {searchLocation && (
              <Marker position={[searchLocation.latitude, searchLocation.longitude]}>
                <Popup>
                  <div>
                    <strong>Search Location</strong>
                    <p>{searchLocation.display_name}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Result markers */}
            {results.map((result, index) => (
              <Marker
                key={`marker-${result.id}-${result.type}-${index}`}
                position={[result.latitude, result.longitude]}
                icon={getIcon(result.type)}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{result.name}</h3>
                    <p>Type: {result.type}</p>
                    {result.address.street && (
                      <p>{result.address.street} {result.address.housenumber}</p>
                    )}
                    {result.contact.phone && (
                      <p>Phone: {result.contact.phone}</p>
                    )}
                    {result.contact.website && (
                      <p>
                        <a 
                          href={result.contact.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Website
                        </a>
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default RealDataSearch;
