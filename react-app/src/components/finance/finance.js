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
        // Store the selected financeId in state or a ref to use in the delete function
        // For example, you can use a ref like this:
        setSelectedFinanceId(financeId);
    };

    const handleCloseContextMenu = () => {
        setShowContextMenu(false);
    };

    const handleDelete = () => {
        // Use the stored financeId to delete the finance record
        // For example, if you use the ref selectedFinanceId:
        dispatch(financeActions.deleteTransaction(selectedFinanceId));
        setShowContextMenu(false);
    };

    return finances ? (
        <div className="finance-contain">
            <h1>Finances</h1>
            <div className="finance-box" >

                {Object.values(finances).map((finance, index) => {
                    const { amount, transaction_type } = finance;
                    let result = null;

                    if (transaction_type === "Expense") {
                        result = `-$${amount}`;
                    } else if (transaction_type === "Income") {
                        result = `+$${amount}`;
                    }

                    return (
                        <>
                            <div key={index} className="finance-item" onContextMenu={(e) => handleContextMenu(e, finance.id)}>
                                <div>{finance.transaction_details}</div>
                                <div>{finance.transaction_date}</div>
                                <div>{result}</div>
                            </div>
                        </>
                    );
                })}
                <div className="create-finance-button">
                    <button
                        onClick={(e) => history.push('/finance/new')}
                    > Create a new record </button>
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
                <button
                    onClick={(e) => history.push('/finance/new')}
                > Create a new record </button>
            </div>
        </div>
    );
};

export default Finances;