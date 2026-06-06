import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Preload premium self-hosted web fonts for maximum performance and 0 layout shifts
import '@fontsource/cormorant-garamond/600-italic.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';

import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
