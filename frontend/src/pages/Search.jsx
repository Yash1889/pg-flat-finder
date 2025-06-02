import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

import PropertyCard from '../components/property/PropertyCard';
import PropertyFilters from '../components/property/PropertyFilters';
import PropertyMap, { searchLocation } from '../components/map/PropertyMap';
import { useFilter } from '../context/FilterContext';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, updateFilters, getApiFilters } = useFilter();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [properties, setProperties] = useState([]);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);

  // Get type from URL if available
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl) {
      updateFilters({ propertyType: typeFromUrl });
    }
  }, [searchParams]);

  // Geocode the address if location is provided but no coordinates
  useEffect(() => {
    const geocodeAddress = async () => {
      if (filters.location && !filters.latitude && !filters.longitude && !isGeocodingAddress) {
        setIsGeocodingAddress(true);
        try {
          // Use OpenStreetMap geocoding via the searchLocation function
          const result = await searchLocation(filters.location);
          
          if (result) {
            // OpenStreetMap returns [longitude, latitude] in center
            const [longitude, latitude] = result.center;
            
            // Update filters with coordinates
            updateFilters({
              latitude: latitude,
              longitude: longitude
            });
            
            toast.success('Location found');
          } else {
            toast.error('Could not find this location. Please try another search.');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          toast.error('Could not find this location. Please try another search.');
        } finally {
          setIsGeocodingAddress(false);
        }
      }
    };
    
    geocodeAddress();
  }, [filters.location]);

  // Fetch properties based on filters
  const { isLoading, refetch } = useQuery(
    ['properties', filters],
    async () => {
      try {
        // Build API params based on current filters
        const apiFilters = getApiFilters();
        
        // In a real application, this would call your backend API
        // For demo purposes, we're simulating the API response
        
        // Simulated delay to mimic API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated response (in a real app, this would be your backend API)
        const response = {
          data: [
            {
              id: 1,
              title: "Modern PG near Tech Park",
              description: "Fully furnished PG accommodation with all amenities",
              property_type: "pg",
              address: "123 Main St, Electronic City",
              city: "Bangalore",
              state: "Karnataka",
              zipcode: "560100",
              latitude: 12.9716,
              longitude: 77.5946,
              price: 8500,
              area_sqft: 250,
              bedrooms: 1,
              bathrooms: 1,
              furnishing: "fully_furnished",
              has_wifi: true,
              has_ac: true,
              has_parking: false,
              has_tv: true,
              has_kitchen: true,
              has_washing_machine: true,
              has_gym: false,
              contact_name: "John Doe",
              contact_phone: "9876543210",
              main_image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
              distance_km: 1.2
            },
            {
              id: 2,
              title: "Spacious 2BHK Apartment",
              description: "Beautiful apartment in a gated community",
              property_type: "apartment",
              address: "456 Park Ave, Whitefield",
              city: "Bangalore",
              state: "Karnataka",
              zipcode: "560066",
              latitude: 12.9698,
              longitude: 77.7499,
              price: 25000,
              area_sqft: 1200,
              bedrooms: 2,
              bathrooms: 2,
              furnishing: "semi_furnished",
              has_wifi: false,
              has_ac: true,
              has_parking: true,
              has_tv: false,
              has_kitchen: true,
              has_washing_machine: false,
              has_gym: true,
              contact_name: "Jane Smith",
              contact_phone: "9876543211",
              main_image_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
              distance_km: 2.5
            },
            {
              id: 3,
              title: "Cozy Single Room",
              description: "Perfect for students or working professionals",
              property_type: "room",
              address: "789 College Rd, Koramangala",
              city: "Bangalore",
              state: "Karnataka",
              zipcode: "560034",
              latitude: 12.9352,
              longitude: 77.6245,
              price: 6000,
              area_sqft: 120,
              bedrooms: 1,
              bathrooms: 1,
              furnishing: "fully_furnished",
              has_wifi: true,
              has_ac: false,
              has_parking: false,
              has_tv: true,
              has_kitchen: false,
              has_washing_machine: true,
              has_gym: false,
              contact_name: "Mike Johnson",
              contact_phone: "9876543212",
              main_image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
              distance_km: 3.7
            },
            {
              id: 4,
              title: "Luxury 3BHK Flat",
              description: "Premium flat with modern amenities",
              property_type: "flat",
              address: "101 High St, Indiranagar",
              city: "Bangalore",
              state: "Karnataka",
              zipcode: "560038",
              latitude: 12.9784,
              longitude: 77.6408,
              price: 45000,
              area_sqft: 1800,
              bedrooms: 3,
              bathrooms: 3,
              furnishing: "fully_furnished",
              has_wifi: true,
              has_ac: true,
              has_parking: true,
              has_tv: true,
              has_kitchen: true,
              has_washing_machine: true,
              has_gym: true,
              contact_name: "Sarah Williams",
              contact_phone: "9876543213",
              main_image_url: "https://images.unsplash.com/photo-1515263487990-61b07816b324?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
              distance_km: 4.2
            }
          ]
        };
        
        return response.data;
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to fetch properties');
        throw error;
      }
    },
    {
      onSuccess: (data) => {
        setProperties(data);
      },
      enabled: !!(filters.location || (filters.latitude && filters.longitude)),
    }
  );

  // Filter the properties based on amenities
  const filteredProperties = properties.filter(property => {
    // Check if any amenity filter is active
    const hasAmenityFilters = Object.values(filters.amenities).some(value => value);
    
    if (!hasAmenityFilters) {
      return true;
    }
    
    // Check each active amenity filter
    if (filters.amenities.wifi && !property.has_wifi) return false;
    if (filters.amenities.ac && !property.has_ac) return false;
    if (filters.amenities.parking && !property.has_parking) return false;
    if (filters.amenities.tv && !property.has_tv) return false;
    if (filters.amenities.kitchen && !property.has_kitchen) return false;
    if (filters.amenities.washingMachine && !property.has_washing_machine) return false;
    if (filters.amenities.gym && !property.has_gym) return false;
    
    return true;
  });

  const handleLocationSearch = (e) => {
    e.preventDefault();
    // This will trigger a new search with the updated location
    refetch();
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'map' : 'grid');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Perfect Place</h1>
          <form onSubmit={handleLocationSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Enter location, city, or area"
                className="input w-full"
                value={filters.location}
                onChange={(e) => updateFilters({ location: e.target.value })}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary sm:w-auto"
              disabled={isLoading || isGeocodingAddress}
            >
              {isLoading || isGeocodingAddress ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : 'Search'}
            </button>
            <button 
              type="button" 
              className="btn-secondary sm:w-auto"
              onClick={toggleViewMode}
            >
              {viewMode === 'grid' ? 'View Map' : 'View List'}
            </button>
          </form>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <PropertyFilters />
          </div>

          {/* Properties Section */}
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                {viewMode === 'map' ? (
                  <div className="bg-white rounded-lg shadow-md p-4 h-[600px]">
                    <PropertyMap 
                      properties={filteredProperties} 
                      center={
                        filters.latitude && filters.longitude 
                          ? [filters.longitude, filters.latitude] 
                          : undefined
                      }
                    />
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex justify-between items-center">
                      <p className="text-gray-600">
                        {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Sort by:</span>
                        <select className="text-sm border rounded p-1">
                          <option>Price: Low to High</option>
                          <option>Price: High to Low</option>
                          <option>Distance: Nearest</option>
                          <option>Newest First</option>
                        </select>
                      </div>
                    </div>
                    
                    {filteredProperties.length === 0 ? (
                      <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your filters or search in a different location
                        </p>
                        <button 
                          onClick={() => updateFilters({ location: '' })}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProperties.map((property) => (
                          <PropertyCard key={property.id} property={property} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
