import { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../services/authReq.service";
import CheckButton from "react-validation/build/button";
import { vrequired, validEmail, vusername_length, vpassword_length, vregex, vnumber, vmaj } from "../services/formValidation.service";
import classes from './Register.component.module.css'

const Register = () => {

  const form = useRef<any>();
  const checkBtn = useRef<any>();
  const [user_pseudo, setUserPseudo] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  
  const onChangeUserPseudo = (event: any) => {
    const user_pseudo = event.target.value;
    setUserPseudo(user_pseudo);
  };
  
  const onChangeUserEmail = (event: any) => {
    const user_email = event.target.value;
    setUserEmail(user_email);
  };
  
  const onChangeUserPassword = (event: any) => {
    const user_password = event.target.value;
    setUserPassword(user_password);
  };
  
  const handleRegister = (event: any) => {
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
        <Form className={classes.form} onSubmit={handleRegister} ref={form}>
        <div>
              <div className="form-group">
                <label htmlFor="user_pseudo">Username</label>
                <Input
                  type="text"
                  className="form-control"
                  name="user_pseudo"
                  value={user_pseudo}
                  onChange={onChangeUserPseudo}
                  validations={[vrequired, vusername_length, vregex]}
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
                  validations={[vrequired, validEmail]}
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
                  validations={[vrequired, vpassword_length, vnumber, vmaj]}
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