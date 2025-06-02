import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';

const PropertyFilters = () => {
  const { filters, updateFilter, updateAmenity, resetFilters } = useFilter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePropertyTypeChange = (e) => {
    updateFilter('propertyType', e.target.value);
  };

  const handlePriceChange = (type, value) => {
    updateFilter(type, value);
  };

  const handleBedroomsChange = (e) => {
    updateFilter('bedrooms', e.target.value);
  };

  const handleRadiusChange = (e) => {
    updateFilter('radius', parseInt(e.target.value));
  };

  const handleAmenityChange = (amenity, checked) => {
    updateAmenity(amenity, checked);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button 
          onClick={resetFilters}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {/* Property Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            value={filters.propertyType}
            onChange={handlePropertyTypeChange}
            className="input"
          >
            <option value="">All Types</option>
            <option value="pg">PG</option>
            <option value="hostel">Hostel</option>
            <option value="flat">Flat</option>
            <option value="room">Room</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>

        {/* Price Range Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (₹)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="input"
              min="0"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="input"
              min="0"
            />
          </div>
        </div>

        {/* Bedrooms Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <select
            value={filters.bedrooms}
            onChange={handleBedroomsChange}
            className="input"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* Search Radius Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Radius: {filters.radius} km
          </label>
          <input
            type="range"
            min="1"
            max="25"
            value={filters.radius}
            onChange={handleRadiusChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 km</span>
            <span>25 km</span>
          </div>
        </div>

        {/* Distance from College/University */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Distance from College</label>
          <select
            value={filters.collegeDistance || ''}
            onChange={(e) => updateFilter('collegeDistance', e.target.value)}
            className="input"
          >
            <option value="">Any Distance</option>
            <option value="0.5">Within 0.5 km</option>
            <option value="1">Within 1 km</option>
            <option value="2">Within 2 km</option>
            <option value="3">Within 3 km</option>
            <option value="5">Within 5 km</option>
          </select>
        </div>

        {/* Mess/Food Facilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Food Options</label>
          <select
            value={filters.foodFacility || ''}
            onChange={(e) => updateFilter('foodFacility', e.target.value)}
            className="input"
          >
            <option value="">Any</option>
            <option value="mess">Mess Available</option>
            <option value="mealsPlan">Meals Plan Available</option>
            <option value="kitchen">Kitchen Available</option>
          </select>
        </div>

        {/* Toggle for Amenities */}
        <button
          type="button"
          className="flex w-full items-center justify-between text-sm font-medium text-primary-600 hover:text-primary-800"
          onClick={toggleExpand}
        >
          <span>Amenities</span>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Amenities Checkboxes */}
        {isExpanded && (
          <div className="pt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="wifi"
                type="checkbox"
                checked={filters.amenities.wifi}
                onChange={(e) => handleAmenityChange('wifi', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="wifi" className="ml-2 text-sm text-gray-700">
                WiFi
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="ac"
                type="checkbox"
                checked={filters.amenities.ac}
                onChange={(e) => handleAmenityChange('ac', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="ac" className="ml-2 text-sm text-gray-700">
                Air Conditioning
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="studyRoom"
                type="checkbox"
                checked={filters.amenities.studyRoom}
                onChange={(e) => handleAmenityChange('studyRoom', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="studyRoom" className="ml-2 text-sm text-gray-700">
                Study Room
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="parking"
                type="checkbox"
                checked={filters.amenities.parking}
                onChange={(e) => handleAmenityChange('parking', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="parking" className="ml-2 text-sm text-gray-700">
                Parking
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="tv"
                type="checkbox"
                checked={filters.amenities.tv}
                onChange={(e) => handleAmenityChange('tv', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="tv" className="ml-2 text-sm text-gray-700">
                TV
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="kitchen"
                type="checkbox"
                checked={filters.amenities.kitchen}
                onChange={(e) => handleAmenityChange('kitchen', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="kitchen" className="ml-2 text-sm text-gray-700">
                Kitchen
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="washingMachine"
                type="checkbox"
                checked={filters.amenities.washingMachine}
                onChange={(e) => handleAmenityChange('washingMachine', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="washingMachine" className="ml-2 text-sm text-gray-700">
                Washing Machine
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="gym"
                type="checkbox"
                checked={filters.amenities.gym}
                onChange={(e) => handleAmenityChange('gym', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="gym" className="ml-2 text-sm text-gray-700">
                Gym
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="laundry"
                type="checkbox"
                checked={filters.amenities.laundry}
                onChange={(e) => handleAmenityChange('laundry', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="laundry" className="ml-2 text-sm text-gray-700">
                Laundry Service
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="hotWater"
                type="checkbox"
                checked={filters.amenities.hotWater}
                onChange={(e) => handleAmenityChange('hotWater', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="hotWater" className="ml-2 text-sm text-gray-700">
                Hot Water
              </label>
            </div>
          </div>
        )}

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
          <select
            value={filters.roomType || ''}
            onChange={(e) => updateFilter('roomType', e.target.value)}
            className="input"
          >
            <option value="">Any Type</option>
            <option value="single">Single Occupancy</option>
            <option value="double">Double Sharing</option>
            <option value="triple">Triple Sharing</option>
            <option value="dormitory">Dormitory</option>
          </select>
        </div>

        {/* Gender Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preference</label>
          <select
            value={filters.gender || ''}
            onChange={(e) => updateFilter('gender', e.target.value)}
            className="input"
          >
            <option value="">Any</option>
            <option value="male">Male Only</option>
            <option value="female">Female Only</option>
            <option value="coed">Co-ed</option>
          </select>
        </div>

        {/* Apply Filters Button */}
        <button
          type="button"
          className="w-full btn-primary"
          onClick={() => {
            // This will trigger the search with the current filters
            // The actual search logic will be in the Search page
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default PropertyFilters;
