// This script runs before React and will help identify silent errors
(function() {
  console.log('Debug script loaded');
  
  // Override console.error to make errors more visible
  const originalConsoleError = console.error;
  console.error = function() {
    // Call the original console.error
    originalConsoleError.apply(console, arguments);
    
    // Get the error message
    const errorMsg = Array.from(arguments).join(' ');
    
    // Create or update error display element
    let errorDisplay = document.getElementById('js-error-display');
    if (!errorDisplay) {
      errorDisplay = document.createElement('div');
      errorDisplay.id = 'js-error-display';
      errorDisplay.style.position = 'fixed';
      errorDisplay.style.top = '0';
      errorDisplay.style.left = '0';
      errorDisplay.style.right = '0';
      errorDisplay.style.padding = '15px';
      errorDisplay.style.backgroundColor = '#fee2e2';
      errorDisplay.style.color = '#b91c1c';
      errorDisplay.style.zIndex = '9999';
      errorDisplay.style.maxHeight = '50vh';
      errorDisplay.style.overflow = 'auto';
      errorDisplay.style.fontFamily = 'monospace';
      errorDisplay.style.fontSize = '14px';
      errorDisplay.style.whiteSpace = 'pre-wrap';
      document.body.appendChild(errorDisplay);
    }
    
    // Add the error to the display
    const errorElement = document.createElement('div');
    errorElement.style.marginBottom = '10px';
    errorElement.style.borderBottom = '1px solid #b91c1c';
    errorElement.style.paddingBottom = '10px';
    errorElement.textContent = `ERROR: ${errorMsg}`;
    errorDisplay.appendChild(errorElement);
  };
  
  // Catch unhandled Promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
  });
  
  // Report React DOM root status
  setTimeout(function() {
    const rootElement = document.getElementById('root');
    console.log('Root element:', rootElement);
    console.log('Root children count:', rootElement.childNodes.length);
    console.log('Root innerHTML length:', rootElement.innerHTML.length);
    
    if (rootElement.childNodes.length === 0) {
      console.error('Root element has no children - React may not be rendering properly');
    }
    
    // Check if any React-related globals exist
    console.log('React loaded:', typeof React !== 'undefined');
    console.log('ReactDOM loaded:', typeof ReactDOM !== 'undefined');
  }, 1000);
})();
