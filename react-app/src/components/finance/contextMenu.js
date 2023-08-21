import React, { useState } from "react";

function ContextMenu({ x, y, onClose, onDelete, onEdit }) {
    const [hoveredOption, setHoveredOption] = useState(null);

    const handleMouseEnter = (option) => {
        setHoveredOption(option);
    };

    const handleMouseLeave = () => {
        setHoveredOption(null);
    };

    const handleClick = (action) => {
        if (action === "delete") {
            onDelete();
        } else if (action === "cancel") {
            onClose();
        } else if (action === "edit") {
            onEdit();
        }
    };

    return (
        <div className="context-menu" style={{ top: y, left: x }}>
            <div
                className={`context-menu-item ${hoveredOption === "delete" ? "hovered" : ""}`}
                onClick={() => handleClick("delete")}
                onMouseEnter={() => handleMouseEnter("delete")}
                onMouseLeave={handleMouseLeave}
            >
                Delete
            </div>
            <div
                className={`context-menu-item ${hoveredOption === "cancel" ? "hovered" : ""}`}
                onClick={() => handleClick("cancel")}
                onMouseEnter={() => handleMouseEnter("cancel")}
                onMouseLeave={handleMouseLeave}
            >
                Cancel
            </div>
            {onEdit && (
                <div
                    className={`context-menu-item ${hoveredOption === "edit" ? "hovered" : ""}`}
                    onClick={() => handleClick("edit")}
                    onMouseEnter={() => handleMouseEnter("edit")}
                    onMouseLeave={handleMouseLeave}
                >
                    Edit
                </div>
            )}
        </div>
    );
}

export default ContextMenu;