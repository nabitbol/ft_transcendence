import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../services/authReq.service";
import CheckButton from "react-validation/build/button";
import { required, validEmail, vusername, vpassword } from "../services/formValidation.service";

const Register = () => {

  const form = useRef();
  const checkBtn = useRef();
  const [user_pseudo, setUserPseudo] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  
  const onChangeUserPseudo = event => {
    const user_pseudo = event.target.value;
    setUserPseudo(user_pseudo);
  };
  
  const onChangeUserEmail = event => {
    const user_email = event.target.value;
    setUserEmail(user_email);
  };
  
  const onChangeUserPassword = event => {
    const user_password = event.target.value;
    setUserPassword(user_password);
  };
  
  const handleRegister = event => {
    event.preventDefault();
    setMessage("");
	setSuccessful(false);
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(user_pseudo, user_email, user_password).then(
        (response) => {
          setMessage('User creation was successful !');
		  setSuccessful(true);
        },
        (error) => {
			const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setMessage(resMessage);
		  setSuccessful(false);
        }
      );
    }
  };

  return (
        <Form onSubmit={handleRegister} ref={form}>
        <div>
              <div className="form-group">
                <label htmlFor="user_pseudo">Username</label>
                <Input
                  type="text"
                  className="form-control"
                  name="user_pseudo"
                  value={user_pseudo}
                  onChange={onChangeUserPseudo}
                  validations={[required, vusername]}
                />
            </div>

            <div className="form-group">
                <label htmlFor="user_email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="user_email"
                  value={user_email}
                  onChange={onChangeUserEmail}
                  validations={[required, validEmail]}
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
                  validations={[required, vpassword]}
                />
            </div>

            <div className="form-group">
                <button className="btn btn-primary btn-block">Sign Up</button>
        	</div>

			{message && (
            <div className="form-group">
              <div
                className={ successful ? "alert alert-success" : "alert alert-danger" }
                role="alert"
              >
                {message}
              </div>
            </div>
          	)}

         	 <CheckButton style={{ display: "none" }} ref={checkBtn} />
    	</div>
	</Form>

  );
};

export default Register;