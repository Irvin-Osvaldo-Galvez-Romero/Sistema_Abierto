import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { suppressWebSocketErrors } from './utils/suppressWebSocketErrors';

// Suprimir errores de WebSocket del dev server en la consola
suppressWebSocketErrors();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


