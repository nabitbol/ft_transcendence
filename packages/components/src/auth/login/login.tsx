import classes from "./login.module.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import * as Service from "@ft-transcendence/frontend-services";

type LoginProps = {
  activateTwoFaForm: () => void;
};

const Login: React.FC<LoginProps> = (props: LoginProps) => {
  const navigate = useNavigate();
  const form = useRef<any>();
  const checkBtn = useRef<any>();
  const [user_pseudo, setUserPseudo] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [message, setMessage] = useState("");
  const onChangeUserPseudo = (event: React.FormEvent<HTMLFormElement>) => {
    const user_pseudo = event.currentTarget["value"];
    setUserPseudo(user_pseudo);
  };

  const onChangeUserPassword = (event: React.FormEvent<HTMLFormElement>) => {
    const password = event.currentTarget["value"];
    setUserPassword(password);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      Service.Auth.login(user_pseudo, user_password).then(
        () => {
          const user_data = localStorage.getItem("userdata");
          if (user_data) {
            const user = JSON.parse(user_data);
            if (user && user.user_TwoFa_on) props.activateTwoFaForm();
          } else {
            navigate("/home");
            window.location.reload();
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setMessage(resMessage);
        }
      );
    }
  };

  return (
    <Form className={classes["login_form"]} onSubmit={handleLogin} ref={form}>
      <div className="form-group">
        <label className={classes["login_label"]} htmlFor="user_pseudo">
          Username
        </label>
        <Input
          type="text"
          className={classes["login_input"]}
          name="user_pseudo"
          value={user_pseudo}
          onChange={onChangeUserPseudo}
          validations={[Service.vrequired]}
        />
      </div>

      <div className="form-group">
        <label className={classes["login_label"]} htmlFor="user_password">
          Password
        </label>
        <Input
          type="password"
          className={classes["login_input"]}
          name="user_password"
          value={user_password}
          onChange={onChangeUserPassword}
          validations={[Service.vrequired]}
        />
      </div>

      <div className="form-group">
        <button className={classes["login_btn"]}>
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

      <CheckButton style={{ display: "none" }} ref={checkBtn} />
    </Form>
  );
};

export { Login };
