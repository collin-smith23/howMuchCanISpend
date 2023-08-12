import React, {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as financeActions from '../../store/finance'
import { useModal } from "../../context/Modal";
import './editFinance.css'

function FinanceEditForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {financeId} = useParams();
    const selectedRecord = useSelector((state) => state.finance)
    const user = useSelector((state) => state.session.user);
    const [amount, setAmount] = useState(0.00);
    const [transaction_type, setTransactionType] = useState("Expense");
    const [transaction_details, setTransactionDetails] = useState("");
    const [transaction_date, setTransactionDate] = useState("");
    const [errors, setErrors] = useState([]);

    function formatDate(date) {
        const [year, month, day] = date.split('-');
        return `${day}-${padZero(year)}-${padZero(month)}`;
    }
    function padZero(value) {
        return value.length === 1 ? `${value}` : value;
    }
    
    useEffect(() => {
        console.log('this is finance id', financeId)
        dispatch(financeActions.getFinanceRecord(financeId));
        console.log('this is selected record', selectedRecord)
    }, [dispatch, financeId]);

    useEffect(() => {
        setAmount(selectedRecord.amount || 0.00);
        setTransactionType(selectedRecord.transaction_type || "Expense");
        setTransactionDetails(selectedRecord.transaction_details || "");
        if (selectedRecord.transaction_date) {
            const dateParts = selectedRecord.transaction_date.split('-');
            const formattedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
            setTransactionDate(formattedDate);
        } else {
            setTransactionDate("");
        }
    }, [selectedRecord]);
    

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
                transaction_date: formatDate(transaction_date),
                transaction_details
            }
            try {

                const data = await dispatch(financeActions.editTransaction(financeId, formattedTransaction))
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
                    Edit Record
                </button>
                <button onClick={(e) => history.push('/')} className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    )

}

export default FinanceEditForm