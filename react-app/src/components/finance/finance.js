import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as financeActions from "../../store/finance";
import OpenModalButton from "../OpenModalButton";
import FinanceForm from "../financeForm/createFinance";
import ContextMenu from "./contextMenu";
import "./finance.css";

function Finances() {
    const dispatch = useDispatch();
    const history = useHistory();
    const finances = useSelector((state) => state.finance.finances.finances)
    const user = useSelector((state) => state.session.user)
    const [selectedFinanceId, setSelectedFinanceId] = useState(null)
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });



    useEffect(() => {
        if (user) {
            dispatch(financeActions.getUserFinances());
        } else {
            return (
                <div>Must be logged in to view</div>
            )
        }
    }, [dispatch, user]);

    const handleContextMenu = (e, financeId) => {
        e.preventDefault();
        setContextMenuPos({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
        setSelectedFinanceId(financeId);
    };

    const handleCloseContextMenu = () => {
        setShowContextMenu(false);
    };

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this record?");
        if (confirmed) {
            dispatch(financeActions.deleteTransaction(selectedFinanceId));
        }
        setShowContextMenu(false);
    };

    const handleEdit = (selectedFinanceId) => {
        history.push(`/finance/${selectedFinanceId}/edit`)
    }

    return finances ? (
        <div className="finance-contain">
            <h2 className="title finance">Finances</h2>
            <div className="finance-box">
                <div className="category-title-box">
                    <div className="category-title">Transaction Details</div>
                    <div className="category-title">Transaction Date</div>
                    <div className="category-title">Amount</div>
                </div>

                {Object.values(finances).map((finance, index) => {
                    const { amount, transaction_type } = finance;
                    const result = transaction_type === "Expense" ? `-$${amount}` : `+$${amount}`;

                    return (
                        <div key={index} className="finance-item" onContextMenu={(e) => handleContextMenu(e, finance.id)}>
                            <div className="category">{finance.transaction_details}</div>
                            <div className="category">{finance.transaction_date}</div>
                            <div className="category">{result}</div>
                        </div>
                    );
                })}

                <div className="create-finance-button">
                    <button onClick={(e) => history.push('/finance/new')}> Create a new record </button>
                </div>
            </div>
            {showContextMenu && (
                <ContextMenu
                    x={contextMenuPos.x}
                    y={contextMenuPos.y}
                    onClose={handleCloseContextMenu}
                    onDelete={handleDelete}
                />
            )}
        </div>
    ) : (
        <div className="no-finance-box">
            <div className="no-finance">No Finances to track</div>
            <div className="create-finance-button">
                <button onClick={(e) => history.push('/finance/new')}> Create a new record </button>
            </div>
        </div>
    );
};

export default Finances;