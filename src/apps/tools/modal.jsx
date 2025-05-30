// src/components/Modal.js
import React from 'react';
import '../../style/modal/Modal.scss'; // Создадим соответствующий файл стилей

export const Modal = ({ isOpen, onClose, title, message, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h3>{title}</h3>}
        {message && <p>{message}</p>}
        {children}
        <button 
          className="modal-close-button"
          onClick={onClose}
        >
          Понятно
        </button>
      </div>
    </div>
  );
};