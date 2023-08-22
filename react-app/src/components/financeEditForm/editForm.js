import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as financeActions from '../../store/finance'
import { useModal } from "../../context/Modal";
import './editForm.css'

function FinanceEditForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { financeId } = useParams();
    const user = useSelector((state) => state.session.user);
    const finance = useSelector((state) => state.finance.finances);
    const [amount, setAmount] = useState(0.00);
    const [transaction_type, setTransactionType] = useState("Expense");
    const [transaction_details, setTransactionDetails] = useState("");
    const [transaction_date, setTransactionDate] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();


    useEffect(() => {
        dispatch(financeActions.getFinanceRecord(financeId));
    }, [dispatch, financeId, user])

    useEffect(() => {
        setAmount(finance.amount);
        setTransactionType(finance.transaction_type);
        //adjusting format for date to be viewed
        const serverDate = new Date(finance.transaction_date);
        const month = (serverDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-indexed
        const day = serverDate.getDate().toString().padStart(2, '0');
        const year = serverDate.getFullYear();
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate)
        setTransactionDate(formattedDate);
        setTransactionDetails(finance.transaction_details)
    }, [dispatch, finance])

    console.log('this is finance', finance)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFormValid = (amount, transaction_date, transaction_details) => {
            if (amount.trim() !== "" && transaction_date.trim() !== "" && transaction_details.trim() !== "") return true
            else return false
        }

        if (amount <= 0) {
            setErrors(["Must enter a valid amount. Do not include a '-' sign."]);
        };
        if (transaction_date.trim() === "") setErrors(["Must enter a valid date"]);
        if (transaction_details.trim() === "") {
            setErrors(["Please enter a short description"]);
        }

        if (isFormValid(amount, transaction_date, transaction_details)) {
            const dateObj = new Date(transaction_date);
            const formattedTransactionDate = transaction_date.slice(0, 10);

            const formattedTransaction = {
                amount,
                transaction_type,
                transaction_date: formattedTransactionDate,
                transaction_details
            }
            try {
                console.log('--------------formatted transaction --------', formattedTransaction)
                const data = await dispatch(financeActions.editTransaction(financeId, formattedTransaction))
                if (Array.isArray(data) && data.length > 0) {
                    setErrors(data)
                    return (
                        <>
                        <div>{errors}</div>
                        </>
                    )
                } else {
                    history.push('/')
                }
            } catch (error) {
                setErrors([error.message]);
            }
        }
    }

    if (!finance) {
        return (
            <>
                <div>Loading data, if not automatically loaded please try refreshing page.</div>
                <div>Thanks,</div>
                <div>Dev Team</div>
            </>

        )
    }

    if (finance.error) {
        return (
            <>
                <h1>{finance.error}</h1>
            </>
        )
    }

    return (
        <div className="form-container finance">
            <h1>Edit Finance Record</h1>
            <form onSubmit={handleSubmit}>
                {errors.length > 0 && (
                    <ul className="error-list">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
                <div className="form-group">
                    <input
                        type="text"
                        name="amount"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        name="transaction_date"
                        value={transaction_date}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="transaction_details"
                        placeholder="Transaction Details"
                        value={transaction_details}
                        onChange={(e) => setTransactionDetails(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-group">
                    <select
                        name="type"
                        value={transaction_type}
                        onChange={(e) => setTransactionType(e.target.value)}
                    >
                        <option value={'Expense'}>Expense</option>
                        <option value={'Income'}>Income</option>
                    </select>
                </div>
                <div className="button-box">
                    <button type="submit" className="submit-button" >
                        Confirm Edit Record
                    </button>
                    <button onClick={(e) => history.push('/')} className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    )

}

export default FinanceEditForm