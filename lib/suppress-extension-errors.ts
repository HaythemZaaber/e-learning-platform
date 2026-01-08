// Suppress browser extension errors
if (typeof window !== 'undefined') {
    // Suppress runtime.lastError from browser extensions
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        (message.includes('runtime.lastError') ||
         message.includes('Could not establish connection') ||
         message.includes('Receiving end does not exist'))
      ) {
        // Suppress browser extension errors
        return;
      }
      originalConsoleError.apply(console, args);
    };
  
    // Suppress unhandled promise rejections from extensions
    window.addEventListener('unhandledrejection', (event) => {
      if (
        event.reason &&
        typeof event.reason === 'string' &&
        (event.reason.includes('runtime.lastError') ||
         event.reason.includes('Could not establish connection'))
      ) {
        event.preventDefault();
      }
    });
  }