// Componente de loading
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Carregando...</p>
    </div>
  );
};

export default LoadingSpinner;
