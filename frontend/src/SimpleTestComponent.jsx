import React from 'react';

function SimpleTestComponent() {
  return (
    <div className="test-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#4f46e5', marginBottom: '1rem' }}>PG/Flat Finder Test</h1>
      <p>This is a simple test component to verify React rendering is working correctly.</p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Search for accommodations</h2>
        <button 
          style={{ 
            backgroundColor: '#4f46e5', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            border: 'none', 
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          onClick={() => alert('Search functionality will be implemented here')}
        >
          Try Search
        </button>
      </div>
    </div>
  );
}

export default SimpleTestComponent;
