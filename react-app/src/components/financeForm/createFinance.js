import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as financeActions from '../../store/finance'
import { useModal } from "../../context/Modal";
import './createFinance.css'

function FinanceForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state.session.user);
    const [amount, setAmount] = useState(0.00);
    const [transaction_type, setTransactionType] = useState("Expense");
    const [transaction_details, setTransactionDetails] = useState("");
    const [transaction_date, setTransactionDate] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

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
            const formattedTransaction = {
                amount,
                transaction_type,
                transaction_date,
                transaction_details
            }
            try {

                const data = await dispatch(financeActions.addFinanceRecord(formattedTransaction))
                if (Array.isArray(data) && data.length > 0) {
                    setErrors(data)
                } else {
                    history.push('/');
                }
            } catch (error) {
                setErrors([error.message]);
            }
        }
    }

    return (
        <div className="form-container finance">
            <h1>Create Finance Record</h1>
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
                    Create Record
                </button>
                <button onClick={(e) => history.push('/')} className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    )

}

export default FinanceForm