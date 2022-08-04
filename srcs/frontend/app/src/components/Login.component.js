import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../services/authReq.service";
import CheckButton from "react-validation/build/button";
import { required } from "../services/formValidation.service";
import classes from './Login.component.module.css'

export default function Login(props) {

  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();
  const [user_pseudo, setUserPseudo] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [message, setMessage] = useState("");

	const onChangeUserPseudo = event => {
		const user_pseudo = event.target.value;
    setUserPseudo(user_pseudo);
	}
	
	const onChangeUserPassword = event => {
		const password = event.target.value;
    setUserPassword(password);
	}

	const handleLogin = event => {
		event.preventDefault();
    setMessage("");
		form.current.validateAll();
		if (checkBtn.current.context._errors.length === 0) {
		  AuthService.login(user_pseudo, user_password).then(
			() => {
          navigate("/home");
          window.location.reload();
			},
      (error) => {
        const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
          setMessage(resMessage);
        })
		  }
	  }

    return (
      <Form className={classes.form} onSubmit={handleLogin} ref={form}>
        <div className="form-group">
            <label htmlFor="user_pseudo">Username</label>
            <Input
              type="text"
              className="form-control"
              name="user_pseudo"
              value={user_pseudo}
              onChange={onChangeUserPseudo}
              validations={[required]}
              />
        </div>

        <div className="form-group">
          <label htmlFor="user_password">Password</label>
          <Input
            type="password"
            className="form-control"
            name="user_password"
            value={user_password}
            onChange={onChangeUserPassword}
            validations={[required]}
            />
        </div>

        <div className="form-group">
            <button className="btn btn-primary btn-block">
              <span>Login</span>
            </button>
        </div>

        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}

			  <CheckButton style={{ display: "none" }} ref={checkBtn}/>
      </Form>
    );
}