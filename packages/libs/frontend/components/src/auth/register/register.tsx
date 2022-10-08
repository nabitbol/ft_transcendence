import classes from "./register.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AuthReq,
  validEmail,
  vusername_length,
  vpassword_length,
  vregex,
  vnumber,
  vmaj,
} from "@ft-transcendence/libs-frontend-services";

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const handleRegister = (data) => {
    setMessage("");
    setSuccessful(false);
    AuthReq.register(data.user_name, data.user_email, data.user_password).then(
      () => {
        setMessage("User creation was successfull !");
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
  };

  return (
    <div className={classes.register_form}>
      <span className={classes.register_span}>Register</span>
      <form onSubmit={handleSubmit(handleRegister)}>
          <input placeholder="Username" type="text"
            className={errors.user_name ? classes.register_input_red : classes.register_input}
            {...register("user_name", {
              required: true,
              validate: {
                length: vusername_length,
                regex: vregex,
              }
            })}
          />

          {errors.user_name && errors.user_name.type === "length" && (
            <div className="alert alert-danger" role="alert">
              The username must be between 4 and 25 characters.
            </div>
          )}
          {errors.user_name && errors.user_name.type === "regex" && (
            <div className="alert alert-danger" role="alert">
              This field must only contain alphanumeric characters.
            </div>
          )}

          <input placeholder="Email" type="text"
            className={errors.user_email ? classes.register_input_red : classes.register_input}
            {...register("user_email", {
              required: true,
              validate: { email: validEmail }
            })}
          />
          {errors.user_email && errors.user_email.type === "email" && (
            <div className="alert alert-danger" role="alert">
              This is not a valid email.
            </div>
          )}
          <input placeholder="Password" type="password"
            className={errors.user_password ? classes.register_input_red : classes.register_input}
            {...register("user_password", {
              required: true,
              validate: {
                length: vpassword_length,
                regex: vregex,
                number: vnumber,
                maj: vmaj,
              }
            })}
          />
          {errors.user_password && errors.user_password.type === "length" && (
            <div className="alert alert-danger" role="alert">
              The password must be between 8 and 40 characters.
            </div>
          )}
          {errors.user_password && errors.user_password.type === "regex" && (
            <div className="alert alert-danger" role="alert">
              This field must only contain alphanumeric characters.
            </div>
          )}
          {errors.user_password && errors.user_password.type === "number" && (
            <div className="alert alert-danger" role="alert">
              This field must container at least 1 number.
            </div>
          )}
          {errors.user_password && errors.user_password.type === "maj" && (
            <div className="alert alert-danger" role="alert">
              This field must container at least 1 maj character.
            </div>
          )}

          {message && (
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
          )}

          <input type="submit" className={classes.register_btn} />
      </form>
    </div>
  );
};

export { Register };
