import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PropertyCard = ({ property }) => {
  // Default image if none provided
  const defaultImage = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
  
  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A";
  };

  // Format property type for display
  const formatPropertyType = (type) => {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <motion.div 
      className="property-card h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/property/${property.id}`} className="block h-full">
        <div className="relative">
          <img 
            src={property.main_image_url || defaultImage} 
            alt={property.title} 
            className="property-card-image"
          />
          <div className="absolute top-0 right-0 bg-primary-600 text-white px-3 py-1 text-sm font-semibold m-2 rounded">
            {formatPropertyType(property.property_type)}
          </div>
          {property.distance_km !== null && (
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 text-sm m-2 rounded">
              {property.distance_km.toFixed(1)} km away
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{property.title}</h3>
            <span className="text-lg font-bold text-primary-600">₹{formatPrice(property.price)}{property.price_type === 'monthly' ? '/month' : ''}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.address}</p>
          
          {/* College Distance Badge - Highlight for students */}
          {property.college_distance_km !== undefined && (
            <div className="mb-3">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                {property.college_distance_km < 1 
                  ? `${(property.college_distance_km * 1000).toFixed(0)}m from ${property.college_name || 'college'}` 
                  : `${property.college_distance_km.toFixed(1)}km from ${property.college_name || 'college'}`}
              </span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Show room type for PGs and hostels */}
            {(property.property_type === 'pg' || property.property_type === 'hostel') && property.room_type && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                {property.room_type === 'single' ? 'Single Room' : 
                 property.room_type === 'double' ? 'Double Sharing' : 
                 property.room_type === 'triple' ? 'Triple Sharing' : 
                 property.room_type === 'dormitory' ? 'Dormitory' : property.room_type}
              </span>
            )}
            
            {/* Show gender policy */}
            {property.gender && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                {property.gender === 'male' ? 'Boys Only' : 
                 property.gender === 'female' ? 'Girls Only' : 
                 property.gender === 'coed' ? 'Co-ed' : property.gender}
              </span>
            )}
            
            {/* Still show regular bedrooms for flats/apartments */}
            {property.bedrooms && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
              </span>
            )}
            
            {property.bathrooms && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
              </span>
            )}
          </div>
          
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2">
              {/* Student-focused amenities */}
              {property.has_wifi && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">WiFi</span>
              )}
              {property.has_ac && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">AC</span>
              )}
              {property.has_mess && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Mess</span>
              )}
              {property.has_study_room && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Study Room</span>
              )}
              {property.has_laundry && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Laundry</span>
              )}
              {property.has_hot_water && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Hot Water</span>
              )}
              {/* Show +more if there are additional amenities */}
              {(property.has_wifi || property.has_ac || property.has_mess || property.has_study_room || property.has_laundry || property.has_hot_water) && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">+ more</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
