import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { router } from './router.jsx';
import { AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';

function App() {
  // Use router configuration from router.js
  const routes = useRoutes(router);

  // ErrorFallback component for Suspense
  const ErrorFallback = () => (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>We're sorry, but there was an error loading this page.</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  // Loading spinner for Suspense
  const LoadingSpinner = () => (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="app-container">
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<LoadingSpinner />}>
          <AuthProvider>
            <FilterProvider>
              {routes}
            </FilterProvider>
          </AuthProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('React error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>Error: {this.state.error?.toString()}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;
