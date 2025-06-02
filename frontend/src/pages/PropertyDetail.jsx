import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PropertyGallery from '../components/property/PropertyGallery';
import PropertyAmenities from '../components/property/PropertyAmenities';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showContactInfo, setShowContactInfo] = useState(false);
  
  // Fetch property details
  const { data: property, isLoading, error } = useQuery(
    ['property', id],
    async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we're returning mock data
        
        // Simulated API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated property data
        return {
          id: parseInt(id),
          title: "Modern PG near Tech Park",
          description: "This is a fully furnished PG accommodation with all modern amenities. Located in a peaceful area, it's just a 5-minute walk from the tech park and close to shopping centers and restaurants. The room is spacious, well-ventilated and gets plenty of natural light. The property offers 24/7 security, power backup, and clean drinking water. Perfect for working professionals looking for a comfortable stay near their workplace.",
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
          contact_email: "john.doe@example.com",
          created_at: "2023-05-15T10:30:00Z",
          updated_at: "2023-06-20T15:45:00Z",
          owner_id: 2,
          images: [
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          ],
          reviews: [
            {
              id: 1,
              user_name: "Alice Smith",
              rating: 4.5,
              comment: "Great place, very clean and well-maintained. The owner is responsive and helpful.",
              created_at: "2023-06-10T08:15:00Z"
            },
            {
              id: 2,
              user_name: "Bob Johnson",
              rating: 5,
              comment: "Excellent accommodation, very close to all amenities. Highly recommended!",
              created_at: "2023-06-15T14:30:00Z"
            }
          ],
          average_rating: 4.8
        };
      } catch (error) {
        console.error('Error fetching property details:', error);
        toast.error('Failed to load property details');
        throw error;
      }
    },
    {
      enabled: !!id
    }
  );
  
  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A";
  };
  
  // Format property type for display
  const formatPropertyType = (type) => {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Handle contact visibility
  const toggleContactInfo = () => {
    if (!user && !showContactInfo) {
      toast.error('Please login to view contact information');
      return;
    }
    setShowContactInfo(!showContactInfo);
  };
  
  // Handle copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  
  if (isLoading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="container-custom py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Property</h2>
          <p className="text-gray-700 mb-4">We couldn't load the property details. Please try again.</p>
          <Link to="/search" className="btn-primary">
            Go Back to Search
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="text-sm mb-6 flex items-center text-gray-600">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/search" className="hover:text-primary-600">Search</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{property.title}</span>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Property Gallery */}
          <PropertyGallery images={property.images} />
          
          {/* Property Details */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded">
                    {formatPropertyType(property.property_type)}
                  </span>
                  {property.average_rating && (
                    <div className="flex items-center ml-2 bg-yellow-100 px-2 py-1 rounded text-xs">
                      <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium text-gray-800">{property.average_rating}</span>
                    </div>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
                <p className="text-gray-600 mb-1">{property.address}</p>
                <p className="text-gray-600">{property.city}, {property.state} {property.zipcode}</p>
              </div>
              
              <div className="mt-4 md:mt-0 md:text-right">
                <p className="text-3xl font-bold text-primary-700">₹{formatPrice(property.price)}<span className="text-sm font-normal text-gray-600">/month</span></p>
                <p className="text-gray-600 text-sm mt-1">Listed on {formatDate(property.created_at)}</p>
              </div>
            </div>
            
            {/* Property Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200 my-4">
              {property.bedrooms && (
                <div className="flex flex-col items-center">
                  <div className="text-primary-600 mb-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zM13 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1z" />
                      <path d="M3 8a1 1 0 00-1 1v6a1 1 0 002 0V9a1 1 0 00-1-1zM17 8a1 1 0 00-1 1v6a1 1 0 102 0V9a1 1 0 00-1-1z" />
                    </svg>
                  </div>
                  <div className="text-gray-800 font-semibold">{property.bedrooms}</div>
                  <div className="text-gray-600 text-sm">{property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</div>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex flex-col items-center">
                  <div className="text-primary-600 mb-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-gray-800 font-semibold">{property.bathrooms}</div>
                  <div className="text-gray-600 text-sm">{property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</div>
                </div>
              )}
              
              {property.area_sqft && (
                <div className="flex flex-col items-center">
                  <div className="text-primary-600 mb-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM3.5 4.25a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v11.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75V4.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-gray-800 font-semibold">{property.area_sqft}</div>
                  <div className="text-gray-600 text-sm">sq.ft</div>
                </div>
              )}
              
              {property.furnishing && (
                <div className="flex flex-col items-center">
                  <div className="text-primary-600 mb-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-gray-800 font-semibold capitalize">
                    {property.furnishing.replace('_', ' ')}
                  </div>
                  <div className="text-gray-600 text-sm">Furnishing</div>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {property.description}
              </p>
            </div>
            
            {/* Amenities */}
            <PropertyAmenities property={property} />
            
            {/* Contact Info Card */}
            <div className="mt-8 bg-primary-50 rounded-lg p-6 border border-primary-100">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              {showContactInfo ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-primary-600 mr-3">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-800 font-medium">{property.contact_name}</div>
                      <div className="text-gray-600 text-sm">Property Owner</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-primary-600 mr-3">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="flex items-center">
                      <div className="text-gray-800 font-medium">{property.contact_phone}</div>
                      <button
                        onClick={() => copyToClipboard(property.contact_phone)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                        aria-label="Copy phone number"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {property.contact_email && (
                    <div className="flex items-start">
                      <div className="text-primary-600 mr-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div className="flex items-center">
                        <div className="text-gray-800 font-medium">{property.contact_email}</div>
                        <button
                          onClick={() => copyToClipboard(property.contact_email)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                          aria-label="Copy email"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    {user ? 'View contact details to get in touch with the owner' : 'Login to view contact information'}
                  </p>
                  <button
                    onClick={toggleContactInfo}
                    className="btn-primary"
                  >
                    {user ? 'Show Contact Details' : 'Login to View'}
                  </button>
                </div>
              )}
            </div>
            
            {/* Reviews Section */}
            {property.reviews && property.reviews.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                
                <div className="space-y-4">
                  {property.reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="bg-primary-100 text-primary-800 font-bold rounded-full w-10 h-10 flex items-center justify-center mr-3">
                            {review.user_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{review.user_name}</div>
                            <div className="text-gray-500 text-sm">{formatDate(review.created_at)}</div>
                          </div>
                        </div>
                        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-sm">
                          <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium text-gray-800">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Location Map (Placeholder) */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-600">Map loading...</p>
                {/* In a real app, this would be a Mapbox map component */}
              </div>
              <p className="text-gray-500 mt-2 text-sm">
                Note: Exact location will be shared after booking confirmation.
              </p>
            </div>
          </div>
        </div>
        
        {/* Similar Properties (Placeholder) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Similar properties will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
