import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProperties = async () => {
      setLoading(true);
      try {
        // This would be an API call in a real application
        // For now, let's simulate loading some dummy data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for demonstration
        const mockProperties = [
          {
            id: 1,
            title: 'Modern PG Near Tech Park',
            property_type: 'PG',
            address: '123 Main Street, Koramangala, Bangalore',
            price: 8500,
            bedrooms: 1,
            bathrooms: 1,
            is_available: true,
            created_at: '2023-10-15T10:30:00',
            views: 145,
            inquiries: 12,
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: 2,
            title: 'Spacious 2BHK Apartment',
            property_type: 'Apartment',
            address: '456 Park Avenue, Indiranagar, Bangalore',
            price: 22000,
            bedrooms: 2,
            bathrooms: 2,
            is_available: true,
            created_at: '2023-11-05T15:45:00',
            views: 89,
            inquiries: 5,
            image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: 3,
            title: 'Cozy 1BHK Flat for Rent',
            property_type: 'Flat',
            address: '789 Garden Road, HSR Layout, Bangalore',
            price: 15000,
            bedrooms: 1,
            bathrooms: 1,
            is_available: false,
            created_at: '2023-09-20T09:15:00',
            views: 210,
            inquiries: 18,
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }
        ];
        
        setProperties(mockProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load your properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, []);

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        // This would be an API call in a real application
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter out the deleted property from the state
        setProperties(properties.filter(property => property.id !== id));
        toast.success('Property deleted successfully');
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property. Please try again.');
      }
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the property status in the local state
      setProperties(properties.map(property => 
        property.id === id ? { ...property, is_available: !currentStatus } : property
      ));
      
      toast.success(`Property marked as ${!currentStatus ? 'available' : 'unavailable'}`);
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">No Properties Listed</h3>
        <p className="text-gray-600 mb-6">
          You haven't listed any properties yet. Start by creating your first listing.
        </p>
        <Link to="/add-property" className="btn-primary inline-block">
          Add New Property
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Properties</h2>
        <Link to="/add-property" className="btn-primary text-sm py-2">
          Add New Property
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inquiries
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posted Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property, index) => (
              <motion.tr
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                      <img className="h-full w-full object-cover" src={property.image} alt={property.title} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{property.title}</div>
                      <div className="text-sm text-gray-500">
                        {property.property_type} | ₹{property.price}/month
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {property.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    property.is_available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {property.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {property.inquiries}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(property.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <Link to={`/property/${property.id}`} className="text-primary-600 hover:text-primary-900">
                      View
                    </Link>
                    <Link to={`/edit-property/${property.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleAvailability(property.id, property.is_available)}
                      className={`${property.is_available ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                    >
                      {property.is_available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyList;
