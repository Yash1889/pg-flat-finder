import React from 'react';

const DebugComponent = () => {
  return (
    <div style={{
      padding: '2rem',
      margin: '2rem auto',
      maxWidth: '800px',
      backgroundColor: '#e2e8f0',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#4f46e5', marginBottom: '1rem', fontSize: '2rem' }}>Debug Component</h1>
      <p style={{ marginBottom: '1rem' }}>If you can see this, React is rendering correctly!</p>
      <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.25rem' }}>
        <p>Next step: Check if MainLayout and its children are rendering.</p>
      </div>
    </div>
  );
};

export default DebugComponent;
