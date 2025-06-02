import React from 'react';
import RealDataSearch from './RealDataSearch';

function HomePage() {
  return (
    <div className="home-page">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">Find Your Perfect Accommodation</h1>
        <p className="text-gray-600 mb-6">
          Search for PGs, hostels, apartments and more near any location. 
          Get real-time results powered by OpenStreetMap data.
        </p>
      </div>
      
      <RealDataSearch />
    </div>
  );
}

export default HomePage;
