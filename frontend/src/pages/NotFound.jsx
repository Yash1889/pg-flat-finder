import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-9xl font-extrabold text-primary-600">404</h2>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">Page not found</h3>
          <p className="mt-4 text-base text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go back home
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <div className="border-t border-gray-200 pt-8">
            <div className="flex justify-center space-x-6">
              <Link to="/search" className="text-gray-600 hover:text-primary-600">
                Search Properties
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-primary-600">
                Sign In
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-primary-600">
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
