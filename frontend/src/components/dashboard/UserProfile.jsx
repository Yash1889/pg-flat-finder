import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const UserProfile = ({ user }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Here you would make an API call to update the user profile
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image Section */}
        <div className="md:w-1/3">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
              {user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-4xl font-bold">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            
            <button 
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => toast.success('This feature will be implemented soon!')}
            >
              Change Photo
            </button>
            
            <div className="mt-6 text-center w-full">
              <h3 className="text-lg font-semibold">{user?.full_name}</h3>
              <p className="text-gray-500 text-sm">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        {/* Profile Form Section */}
        <div className="md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your full name"
                      disabled={!isEditing || loading}
                      {...register('fullName', { required: 'Full name is required' })}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900">{user?.full_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      placeholder="Your email address"
                      disabled={true}
                      {...register('email')}
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                ) : (
                  <p className="text-gray-900">{user?.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your phone number"
                      disabled={!isEditing || loading}
                      {...register('phone', {
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit phone number'
                        }
                      })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <div>
                    <textarea
                      rows="4"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Tell us a bit about yourself"
                      disabled={!isEditing || loading}
                      {...register('bio')}
                    ></textarea>
                  </div>
                ) : (
                  <p className="text-gray-900">{user?.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="space-y-4">
              <button 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => toast.success('This feature will be implemented soon!')}
              >
                Change Password
              </button>
              <button 
                className="block text-sm text-red-600 hover:text-red-700 font-medium"
                onClick={() => toast.error('This feature will be implemented soon!')}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
