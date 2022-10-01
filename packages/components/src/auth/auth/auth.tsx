import { useState } from "react";
import { Backdrop, TwoFa, Register, Login } from "@ft-transcendence/components";
import classes from "./auth.module.css";

function Auth() {
  const [LoginForm, setLoginForm] = useState(false);
  const [RegisterForm, setRegisterForm] = useState(false);
  const [TwoFaForm, setTwoFaForm] = useState(false);

  const desactivateForm = () => {
    setRegisterForm(false);
    setLoginForm(false);
    setTwoFaForm(false);
  };

  const activateLoginForm = () => {
    desactivateForm();
    setLoginForm(true);
  };

  const activateRegisterForm = () => {
    desactivateForm();
    setRegisterForm(true);
  };

  const activateTwoFaForm = () => {
    desactivateForm();
    setTwoFaForm(true);
  };

  return (
    <div className={classes["auth_box"]}>
      <h1 className={classes["welcome_title"]}>Pong universe</h1>
      <button className={classes["auth_btn"]} onClick={activateRegisterForm}>
        Create a new account
      </button>
      <br />
      <a href={"http://localhost:3333/auth/login/42"}>
        <button className={classes["auth_btn"]}>Connect with 42 intra</button>
      </a>
      <br />
      <span className={classes["auth_span"]}>
        {" "}
        You already have an account ?{" "}
      </span>
      <button className={classes["auth_btn"]} onClick={activateLoginForm}>
        Login here
      </button>
      {LoginForm && <Login activateTwoFaForm={activateTwoFaForm} />}
      {TwoFaForm && <TwoFa />}
      {RegisterForm && <Register />}
      {(LoginForm || RegisterForm) && (
        <Backdrop closeBackdrop={desactivateForm} />
      )}
    </div>
  );
}

export { Auth };
