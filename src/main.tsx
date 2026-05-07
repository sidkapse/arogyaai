import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import './i18n';
import { initSW } from './pwa/registerSW';

initSW();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/arogyaai">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
