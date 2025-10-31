import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Root Element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker Registration - nur in Production
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('✓ SW registered:', registration.scope);
      })
      .catch(error => {
        console.log('✗ SW registration failed:', error);
      });
  });
}
