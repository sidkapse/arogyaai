import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import { initSW } from './pwa/registerSW';

initSW();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/aliments-info">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
