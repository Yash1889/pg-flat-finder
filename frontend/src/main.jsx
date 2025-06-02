import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import our components
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import SimpleTestComponent from './SimpleTestComponent';

// Import CSS in correct order - critical CSS last to override everything
import './styles/reset.css';
import './styles/main.css';
import './styles/critical-fix.css'; // Critical fix to prevent white screen

// Global error handler to catch any JS errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'test',
        element: <SimpleTestComponent />
      }
    ]
  }
]);

// Render app with proper error handling
try {
  console.log('Rendering React app...');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  // Render the app with RouterProvider
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
  
  console.log('React rendering complete');
} catch (error) {
  // Fallback in case React fails to render
  console.error('Fatal React error:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 2rem; background-color: #ffeeee; color: #cc0000;">
      <h1>Critical Error</h1>
      <p>${error.toString()}</p>
      <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background-color: #4f46e5; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
}
