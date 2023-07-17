import React from 'react';
import './confirmDelete.css';

function ConfirmDelete({ onConfirm, onCancel }) {
    return (
        <div className="confirmation-container">
            <div className="confirmation-text">Are you sure you want to delete this event?</div>
            <div className="confirmation-buttons">
                <button className="confirm-button" onClick={onConfirm}>
                    Confirm
                </button>
                <button className="cancel-button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmDelete;