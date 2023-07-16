import React from 'react';


function ConfirmDelete({onConfirm, onCancel}) {
    return (
        <>
        <div>Are you sure you want to delete this event?</div>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
        </>
    )
};

export default ConfirmDelete;