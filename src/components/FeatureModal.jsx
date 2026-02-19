// src/components/FeatureModal.jsx:1

import React from 'react';
import { X, Info } from 'lucide-react';
import './FeatureModal.css';

const FeatureModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    // Close if user clicks the backdrop
    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-backdrop') {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-container">
                <button className="modal-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="modal-icon-wrapper">
                    <Info size={32} color="#10a37f" />
                </div>

                <h3 className="modal-title">{title || "Coming Soon"}</h3>
                <p className="modal-message">{message}</p>

                <button className="modal-action-btn" onClick={onClose}>
                    Got it
                </button>
            </div>
        </div>
    );
};

export default FeatureModal;