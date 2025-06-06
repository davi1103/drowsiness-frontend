import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // ⚠️ Comentamos StrictMode para evitar dobles ejecuciones en dev
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
