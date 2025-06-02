import React from 'react';

// Simplest possible React component with bright background to be visible
function MinimalApp() {
  return (
    <div style={{
      backgroundColor: 'salmon',
      color: 'white',
      padding: '2rem',
      margin: '0',
      minHeight: '100vh',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        PG Flat Finder Minimal Test
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
        If you can see this, React is rendering correctly!
      </p>
      <div style={{ 
        backgroundColor: 'white', 
        color: 'black', 
        padding: '1rem', 
        borderRadius: '0.5rem',
        margin: '1rem auto',
        maxWidth: '500px'
      }}>
        <p>This is a minimal test component without any dependencies.</p>
      </div>
    </div>
  );
}

export default MinimalApp;
