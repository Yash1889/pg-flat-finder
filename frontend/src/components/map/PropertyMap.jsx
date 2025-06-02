import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import './map.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create geocoder instance
const geocoder = new OpenStreetMapProvider();

// Component to handle map view changes
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.length === 2) {
      map.flyTo([center[1], center[0]], 12, { animate: true, duration: 1 });
    }
  }, [center, map]);
  
  return null;
}

const PropertyMap = ({ properties = [], center = [-77.0369, 38.9072] }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Convert Mapbox-style center ([lng, lat]) to Leaflet-style ([lat, lng])
  const leafletCenter = [center[1], center[0]];
  
  // Create custom icon for properties
  const createPropertyIcon = (price) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative">
          <div class="marker-pin bg-white border border-gray-200 shadow-md">
            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
              ₹${Math.round(price / 1000)}K
            </div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };
  
  // Format price with commas for thousands
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A";
  };
  
  useEffect(() => {
    // Set loading to false after the map is rendered
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={leafletCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Control to update map view when center changes */}
        <MapUpdater center={center} />
        
        {/* Add zoom control in top-right */}
        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control leaflet-bar">
            {/* Zoom controls will be auto-added */}
          </div>
        </div>
        
        {/* Property markers */}
        {properties.map(property => {
          if (!property.latitude || !property.longitude) return null;
          
          return (
            <Marker 
              key={property.id} 
              position={[property.latitude, property.longitude]}
              icon={createPropertyIcon(property.price)}
            >
              <Popup className="property-popup">
                <div className="p-2">
                  <div className="text-sm mb-1 font-semibold">{property.title}</div>
                  <div className="text-xs text-gray-600 mb-1">{property.address}</div>
                  <div className="text-sm font-bold text-primary-600">₹{formatPrice(property.price)}</div>
                  <button 
                    className="mt-2 text-xs text-white bg-primary-600 hover:bg-primary-700 px-2 py-1 rounded"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Geocoding function to search for locations
export const searchLocation = async (query) => {
  try {
    const results = await geocoder.search({ query });
    if (results && results.length > 0) {
      const { x, y, label } = results[0];
      return {
        center: [x, y], // [longitude, latitude] - note this order
        address: label
      };
    }
    return null;
  } catch (error) {
    console.error('Error searching location:', error);
    toast.error('Location search failed. Please try again.');
    return null;
  }
};

export default PropertyMap;
