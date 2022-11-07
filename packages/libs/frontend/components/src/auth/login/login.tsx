import classes from "./login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthReq } from "@ft-transcendence/libs-frontend-services";


type LoginProps = {
  activateTwoFaForm: () => void;
};

const Login: React.FC<LoginProps> = (props: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogin = (data: any) => {
    setMessage("");
    AuthReq.login(data.user_name, data.user_password).then(
      () => {
        const user_data = localStorage.getItem("userdata");
        const user = JSON.parse(user_data);
        if (user && user.doubleAuth)
          props.activateTwoFaForm();
        else {
          navigate("/home");
          const user = AuthReq.getCurrentUser();
          if (user.first_log === false) {
            window.location.reload();
          }
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
  };

  return (
    <div className={classes["login_form"]}>
      <span className={classes["login_span"]}>Login</span>
      <form onSubmit={handleSubmit(handleLogin)}>
        <input
          placeholder="Username"
          type="text"
          className={
            errors["user_name"]
              ? classes["login_input_red"]
              : classes["login_input"]
          }
          {...register("user_name", {
            required: true,
          })}
        />

        <input
          placeholder="Password"
          type="password"
          className={
            errors["user_password"]
              ? classes["login_input_red"]
              : classes["login_input"]
          }
          {...register("user_password", {
            required: true,
          })}
        />

        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}

        <input type="submit" className={classes["login_btn"]} />
      </form>
    </div>
  );
};

export { Login };
