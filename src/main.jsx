import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Swal from 'sweetalert2';

import { ThemeProvider } from './context/ThemeContext';

// --- GLOBAL 401 INTERCEPTOR ---
// This ensures that ANY 401 error from ANYWHERE in the app triggers a forced logout
// This is the "Nuclear Option" to solve the session not closing issue
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);

    if (response.status === 401) {
      console.error('🔒 GLOBAL INTERCEPTOR: 401 Detected - Forcing Logout');

      // Prevent infinite loop if the 401 comes from the login page itself
      if (!window.location.pathname.includes('/login')) {
        await Swal.fire({
          icon: 'warning',
          title: 'Sesión Expirada',
          text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
          confirmButtonColor: '#E2007A',
          background: '#171717',
          color: '#ffffff',
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: 3000
        });

        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
