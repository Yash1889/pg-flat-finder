import React, { createContext, useState, useContext } from 'react';

// Create context
const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  // Default filter state
  const [filters, setFilters] = useState({
    location: '',
    latitude: null,
    longitude: null,
    radius: 5,
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    // Student-focused filters
    collegeDistance: '',
    foodFacility: '',
    roomType: '',
    gender: '',
    amenities: {
      wifi: false,
      ac: false,
      parking: false,
      tv: false,
      kitchen: false,
      washingMachine: false,
      gym: false,
      // Student-focused amenities
      studyRoom: false,
      mess: false,
      laundry: false,
      hotWater: false
    }
  });

  // Update all filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Update a single filter
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Update amenity filters
  const updateAmenity = (amenity, value) => {
    setFilters(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: value
      }
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      location: '',
      latitude: null,
      longitude: null,
      radius: 5,
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      // Student-focused filters
      collegeDistance: '',
      foodFacility: '',
      roomType: '',
      gender: '',
      amenities: {
        wifi: false,
        ac: false,
        parking: false,
        tv: false,
        kitchen: false,
        washingMachine: false,
        gym: false,
        // Student-focused amenities
        studyRoom: false,
        mess: false,
        laundry: false,
        hotWater: false
      }
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.propertyType !== '' ||
      filters.minPrice !== '' ||
      filters.maxPrice !== '' ||
      filters.bedrooms !== '' ||
      filters.collegeDistance !== '' ||
      filters.foodFacility !== '' ||
      filters.roomType !== '' ||
      filters.gender !== '' ||
      Object.values(filters.amenities).some(value => value)
    );
  };

  // Format filters for API requests
  const getApiFilters = () => {
    const apiFilters = {
      ...(filters.latitude && filters.longitude ? {
        latitude: filters.latitude,
        longitude: filters.longitude,
        radius_km: filters.radius
      } : {}),
      ...(filters.propertyType ? { property_type: filters.propertyType } : {}),
      ...(filters.minPrice ? { min_price: Number(filters.minPrice) } : {}),
      ...(filters.maxPrice ? { max_price: Number(filters.maxPrice) } : {}),
      ...(filters.bedrooms ? { bedrooms: Number(filters.bedrooms) } : {}),
      // Student-focused filters
      ...(filters.collegeDistance ? { college_distance_km: Number(filters.collegeDistance) } : {}),
      ...(filters.foodFacility ? { food_facility: filters.foodFacility } : {}),
      ...(filters.roomType ? { room_type: filters.roomType } : {}),
      ...(filters.gender ? { gender: filters.gender } : {}),
      // Add amenities as individual parameters
      ...(filters.amenities.wifi ? { has_wifi: true } : {}),
      ...(filters.amenities.ac ? { has_ac: true } : {}),
      ...(filters.amenities.studyRoom ? { has_study_room: true } : {}),
      ...(filters.amenities.mess ? { has_mess: true } : {}),
      ...(filters.amenities.parking ? { has_parking: true } : {}),
      ...(filters.amenities.tv ? { has_tv: true } : {}),
      ...(filters.amenities.kitchen ? { has_kitchen: true } : {}),
      ...(filters.amenities.washingMachine ? { has_washing_machine: true } : {}),
      ...(filters.amenities.laundry ? { has_laundry: true } : {}),
      ...(filters.amenities.hotWater ? { has_hot_water: true } : {}),
      ...(filters.amenities.gym ? { has_gym: true } : {})
    };

    return apiFilters;
  };

  // Context value
  const value = {
    filters,
    updateFilters,
    updateFilter,
    updateAmenity,
    resetFilters,
    hasActiveFilters,
    getApiFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

// Custom hook to use filter context
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
