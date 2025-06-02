import React from 'react';
import ReactDOM from 'react-dom/client';

// Simplest possible React component with error boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React error caught:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#ffdddd',
          color: '#ff0000',
          borderRadius: '5px',
          margin: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Show Error Details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component Stack:</p>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// Minimal test component
function TestApp() {
  console.log("TestApp rendering");
  return (
    <div style={{
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        React is working!
      </h1>
      <p style={{ fontSize: '1.2rem' }}>
        This minimal React app is rendering correctly.
      </p>
      <div style={{
        backgroundColor: 'white',
        color: '#333',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '600px',
        margin: '20px auto',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#4f46e5' }}>Debugging Notes</h2>
        <p>If you see this, basic React is working.</p>
        <p>The issue with your main app could be:</p>
        <ul style={{ textAlign: 'left' }}>
          <li>A problem with one of your context providers</li>
          <li>React Router configuration issues</li>
          <li>CSS conflicts causing invisible elements</li>
          <li>Silent JS errors in component initialization</li>
        </ul>
      </div>
    </div>
  );
}

// Catch window errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  document.body.innerHTML += `
    <div style="padding: 20px; background: #ffeeee; color: #cc0000; position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;">
      <h3>JavaScript Error Detected:</h3>
      <pre>${event.error?.stack || event.message}</pre>
    </div>
  `;
});

// Render with error boundary
try {
  console.log("Starting React rendering");
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <ErrorBoundary>
      <TestApp />
    </ErrorBoundary>
  );
  console.log("React rendering complete");
} catch (error) {
  console.error("Fatal error during React initialization:", error);
  document.body.innerHTML = `
    <div style="padding: 40px; background: #ffdddd; color: #cc0000;">
      <h1>React Initialization Failed</h1>
      <p>There was a critical error starting React:</p>
      <pre>${error.stack || error.message || error}</pre>
    </div>
  `;
}
