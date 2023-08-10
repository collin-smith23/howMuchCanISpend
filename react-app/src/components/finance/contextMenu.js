import React, { useState } from "react";

function ContextMenu({ x, y, onClose, onDelete }) {
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
        </div>
    );
}

export default ContextMenu;