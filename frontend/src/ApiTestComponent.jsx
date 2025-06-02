import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApiTestComponent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define test coordinates (Bangalore city center)
    const latitude = 12.9715987;
    const longitude = 77.5945627;
    const radius_km = 5;

    // Log that we're making the API call
    console.log('Making API call to fetch nearby properties...');
    
    // Fetch properties from the backend
    axios.get(`/api/v1/properties/nearby?latitude=${latitude}&longitude=${longitude}&radius_km=${radius_km}`)
      .then(response => {
        console.log('API Response:', response.data);
        setProperties(response.data.properties || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setError(err.message || 'Failed to fetch properties');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    }}>
      <h1>API Test: Nearby Properties</h1>
      
      {loading && (
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem' }}>
          Loading properties...
        </div>
      )}
      
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '0.5rem' }}>
          Error: {error}
        </div>
      )}
      
      {!loading && !error && (
        <div>
          <h2>Found {properties.length} properties</h2>
          
          {properties.length === 0 ? (
            <div>
              <p>No properties found within 5km of test coordinates. This could be because:</p>
              <ul>
                <li>The database has no properties in this area</li>
                <li>The database connection might not be fully set up</li>
                <li>The mock data fallback isn't working properly</li>
              </ul>
            </div>
          ) : (
            <div>
              {properties.map(property => (
                <div key={property.id} style={{ 
                  padding: '1rem', 
                  backgroundColor: '#e3f2fd', 
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <h3>{property.title}</h3>
                  <p>{property.description}</p>
                  <p><strong>Distance:</strong> {property.distance_km} km</p>
                  <p><strong>Price:</strong> ₹{property.price}</p>
                  <p><strong>Address:</strong> {property.address}, {property.city}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '0.5rem' }}>
        <h3>Debug Info</h3>
        <p><strong>API Endpoint:</strong> /api/v1/properties/nearby</p>
        <p><strong>Test Coordinates:</strong> 12.9715987, 77.5945627 (Bangalore)</p>
        <p><strong>Search Radius:</strong> 5km</p>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '0.5rem', overflowX: 'auto' }}>
          {JSON.stringify(properties, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default ApiTestComponent;
