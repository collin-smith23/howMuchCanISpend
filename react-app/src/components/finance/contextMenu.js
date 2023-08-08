import React from "react";

function ContextMenu({ x, y, onClose, onDelete }) {
    const handleClick = (action) => {
        if (action === "delete") {
            onDelete();
        } else if (action === "cancel") {
            onClose();
        }
    };

    return (
        <div className="context-menu" style={{ top: y, left: x }}>
            <div onClick={() => handleClick("delete")}>Delete</div>
            <div onClick={() => handleClick("cancel")}>Cancel</div>
        </div>
    );
}

export default ContextMenu;