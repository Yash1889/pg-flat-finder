import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AddProperty = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  // For amenities checkboxes
  const [amenities, setAmenities] = useState({
    wifi: false,
    ac: false,
    parking: false,
    tv: false,
    kitchen: false,
    washingMachine: false,
    gym: false,
    furnished: false
  });

  // Redirect if not logged in
  React.useEffect(() => {
    if (!authLoading && !user) {
      toast.error('You must be logged in to add a property');
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleAmenityChange = (name) => {
    setAmenities(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }

    // Create preview URLs for the images
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setUploadedImages(newImages);
  };

  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image of the property');
      return;
    }

    setLoading(true);
    try {
      // Combine form data with amenities
      const propertyData = {
        ...data,
        amenities,
        // In a real app, you would upload images to a server and get URLs back
        images: uploadedImages.map(img => img.preview)
      };

      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Property added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8">Add New Property</h1>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Title*
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="E.g., Modern PG Near Tech Park"
                      {...register('title', { 
                        required: 'Property title is required',
                        minLength: {
                          value: 10,
                          message: 'Title must be at least 10 characters'
                        }
                      })}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type*
                    </label>
                    <select
                      className={`w-full p-2 border rounded-md ${errors.propertyType ? 'border-red-500' : 'border-gray-300'}`}
                      {...register('propertyType', { required: 'Property type is required' })}
                    >
                      <option value="">Select Property Type</option>
                      <option value="PG">PG</option>
                      <option value="Flat">Flat</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                    </select>
                    {errors.propertyType && (
                      <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Rent (₹)*
                    </label>
                    <input
                      type="number"
                      className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="E.g., 10000"
                      {...register('price', { 
                        required: 'Rent amount is required',
                        min: {
                          value: 1000,
                          message: 'Minimum rent is ₹1,000'
                        }
                      })}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms*
                    </label>
                    <select
                      className={`w-full p-2 border rounded-md ${errors.bedrooms ? 'border-red-500' : 'border-gray-300'}`}
                      {...register('bedrooms', { required: 'Number of bedrooms is required' })}
                    >
                      <option value="">Select Bedrooms</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                    {errors.bedrooms && (
                      <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms*
                    </label>
                    <select
                      className={`w-full p-2 border rounded-md ${errors.bathrooms ? 'border-red-500' : 'border-gray-300'}`}
                      {...register('bathrooms', { required: 'Number of bathrooms is required' })}
                    >
                      <option value="">Select Bathrooms</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                    {errors.bathrooms && (
                      <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sq. ft.)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="E.g., 850"
                      {...register('area')}
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line*
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="E.g., 123 Main Street"
                      {...register('address', { required: 'Address is required' })}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area/Locality*
                      </label>
                      <input
                        type="text"
                        className={`w-full p-2 border rounded-md ${errors.locality ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="E.g., Koramangala"
                        {...register('locality', { required: 'Locality is required' })}
                      />
                      {errors.locality && (
                        <p className="mt-1 text-sm text-red-600">{errors.locality.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City*
                      </label>
                      <input
                        type="text"
                        className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="E.g., Bangalore"
                        {...register('city', { required: 'City is required' })}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode*
                      </label>
                      <input
                        type="text"
                        className={`w-full p-2 border rounded-md ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="E.g., 560034"
                        {...register('pincode', { 
                          required: 'Pincode is required',
                          pattern: {
                            value: /^[0-9]{6}$/,
                            message: 'Please enter a valid 6-digit pincode'
                          }
                        })}
                      />
                      {errors.pincode && (
                        <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude (optional)
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="E.g., 12.9716"
                        {...register('latitude')}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        You can get this from Google Maps
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude (optional)
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="E.g., 77.5946"
                        {...register('longitude')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Description */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Description*
                  </label>
                  <textarea
                    rows="4"
                    className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Describe your property in detail. Include special features, nearby amenities, etc."
                    {...register('description', { 
                      required: 'Description is required',
                      minLength: {
                        value: 50,
                        message: 'Description must be at least 50 characters'
                      }
                    })}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Min 50 characters. Include details about the property, surroundings, and rules.
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      id="wifi"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={amenities.wifi}
                      onChange={() => handleAmenityChange('wifi')}
                    />
                    <label htmlFor="wifi" className="ml-2 block text-sm text-gray-700">
                      WiFi
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="ac"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={amenities.ac}
                      onChange={() => handleAmenityChange('ac')}
                    />
                    <label htmlFor="ac" className="ml-2 block text-sm text-gray-700">
                      Air Conditioning
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="parking"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={amenities.parking}
                      onChange={() => handleAmenityChange('parking')}
                    />
                    <label htmlFor="parking" className="ml-2 block text-sm text-gray-700">
                      Parking
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="tv"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={amenities.tv}
                      onChange={() => handleAmenityChange('tv')}
                    />
                    <label htmlFor="tv" className="ml-2 block text-sm text-gray-700">
                      TV
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="kitchen"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={amenities.kitchen}
                      onChange={() => handleAmenityChange('kitchen')}
                    />
                    <label htmlFor="kitchen" className="ml-2 block text-sm text-gray-700">
                      Kitchen
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="washingMachine"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={amenities.washingMachine}
                      onChange={() => handleAmenityChange('washingMachine')}
                    />
                    <label htmlFor="washingMachine" className="ml-2 block text-sm text-gray-700">
                      Washing Machine
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="gym"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={amenities.gym}
                      onChange={() => handleAmenityChange('gym')}
                    />
                    <label htmlFor="gym" className="ml-2 block text-sm text-gray-700">
                      Gym
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="furnished"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={amenities.furnished}
                      onChange={() => handleAmenityChange('furnished')}
                    />
                    <label htmlFor="furnished" className="ml-2 block text-sm text-gray-700">
                      Furnished
                    </label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Property Images</h2>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        Click to upload images (max 5)
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG up to 5MB each
                      </p>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img.preview} 
                            alt={`Preview ${index}`} 
                            className="h-24 w-full object-cover rounded-md" 
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name*
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${errors.contactName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your name"
                      defaultValue={user?.full_name || ''}
                      {...register('contactName', { required: 'Contact name is required' })}
                    />
                    {errors.contactName && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone*
                    </label>
                    <input
                      type="tel"
                      className={`w-full p-2 border rounded-md ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your phone number"
                      defaultValue={user?.phone || ''}
                      {...register('contactPhone', { 
                        required: 'Contact phone is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit phone number'
                        }
                      })}
                    />
                    {errors.contactPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email*
                    </label>
                    <input
                      type="email"
                      className={`w-full p-2 border rounded-md ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your email address"
                      defaultValue={user?.email || ''}
                      {...register('contactEmail', { 
                        required: 'Contact email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.contactEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full md:w-auto btn-primary flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Property...
                    </>
                  ) : (
                    'Add Property'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProperty;
