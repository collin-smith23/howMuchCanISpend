import React, { useEffect, useState, useRef } from "react";
import * as financeActions from "../../store/finance";
import { useHistory, useParams, NavLink} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function FinanceDetails() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {financeId} = useParams();
    const selectedRecord = useSelector((state) => state.finance);
    const user = useSelector((state) => state.session.user);


    useEffect(() => {
        console.log('this is finance id', financeId)
        dispatch(financeActions.getFinanceRecord(financeId));
        console.log('this is selected record', selectedRecord)
    }, [dispatch, financeId]);

    const handleClick = async (e) => {
        e.preventDefault();

        dispatch(financeActions.getUserFinances());
        history.push('/');
    }

    return (
        <div className="finance-confirm">
            <div>You Successfully created a new finance record!</div>
            <div>Record Details: {selectedRecord.transaction_details}</div>
            <button onClick={handleClick}>
                <NavLink exact to="/">
                Return Home
                </NavLink>
                </button>
        </div>
    )
}

export default FinanceDetails;