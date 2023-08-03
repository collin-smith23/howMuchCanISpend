import React, { useEffect, useState, useRef} from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as financeActions from "../../store/finance";
import OpenModalButton from "../OpenModalButton";
import "./finance.css";

function Finances() {
    const dispatch = useDispatch();

    return (
        <h1>Finances</h1>
    )
}

export default Finances