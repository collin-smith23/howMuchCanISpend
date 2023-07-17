import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(identifier, password));
    if (data) {
      setErrors(data);
    } else {
        closeModal()
    }
  };

  const demoLogin = async (e) => {
    e.preventDefault();

    const data = await dispatch(login('Demo', 'password'));
    if (data) {
      setErrors(data);
    } else {
      closeModal()
    }
  };

  return (
    <div className="login-back">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li className="error" key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email or Username
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
        <button className="demo-btn" type="button" onClick={demoLogin}>Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
