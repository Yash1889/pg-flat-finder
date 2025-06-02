import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import UserProfile from '../components/dashboard/UserProfile';
import PropertyList from '../components/dashboard/PropertyList';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (loading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-custom py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Not Authenticated</h2>
          <p className="text-gray-700 mb-4">You need to login to access the dashboard.</p>
          <Link to="/login" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          {/* Dashboard Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <div className="flex flex-wrap -mb-px">
              <button
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'properties'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('properties')}
              >
                My Properties
              </button>
              <button
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'favorites'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites
              </button>
              <button
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inquiries'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('inquiries')}
              >
                Inquiries
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'profile' && <UserProfile user={user} />}
            {activeTab === 'properties' && <PropertyList />}
            {activeTab === 'favorites' && (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Favorites</h3>
                <p className="text-gray-600">
                  You haven't saved any properties to your favorites yet.
                </p>
                <Link to="/search" className="btn-primary mt-4 inline-block">
                  Browse Properties
                </Link>
              </div>
            )}
            {activeTab === 'inquiries' && (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Inquiries</h3>
                <p className="text-gray-600">
                  You don't have any active inquiries.
                </p>
                <Link to="/search" className="btn-primary mt-4 inline-block">
                  Browse Properties
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
