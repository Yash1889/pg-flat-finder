import React from 'react';

function AboutPage() {
  return (
    <div className="about-page max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">About PG & Flat Finder</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-4">
          PG & Flat Finder helps students, professionals, and families find the perfect accommodation
          near their preferred locations. We provide real-time data from OpenStreetMap to ensure you 
          get accurate and up-to-date information about available properties.
        </p>
        <p>
          Whether you're looking for a PG, hostel, apartment, or flat, our platform makes it easy to 
          search, filter, and find the perfect place to call home.
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>Enter your desired location</strong> - Search for any city, neighborhood, or landmark.
          </li>
          <li>
            <strong>Set your preferences</strong> - Adjust the search radius and select accommodation types.
          </li>
          <li>
            <strong>Explore results</strong> - View properties on the map and in the list view.
          </li>
          <li>
            <strong>Get details</strong> - See contact information, amenities, and other property details.
          </li>
        </ol>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Data Sources</h2>
        <p className="mb-3">
          Our application uses the following OpenStreetMap services:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Nominatim</strong> - For geocoding (converting location names to coordinates)
          </li>
          <li>
            <strong>Overpass API</strong> - For finding accommodation data near locations
          </li>
          <li>
            <strong>Leaflet</strong> - For interactive map visualization
          </li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">
          © OpenStreetMap contributors. The data is available under the Open Database License.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
