/**
 * @fileoverview Application entry point — mounts the React root with Redux Provider.
 *
 * Preloads premium self-hosted web fonts (Cormorant Garamond + Plus Jakarta Sans)
 * for maximum performance and zero layout shifts. Wraps the app in StrictMode
 * for development-time checks.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Preload premium self-hosted web fonts for maximum performance and 0 layout shifts
import '@fontsource/cormorant-garamond/600-italic.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';

import '../index.css';
import App from './App.jsx';

import { Provider } from 'react-redux';
import { store } from '../store/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
