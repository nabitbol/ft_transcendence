import {
  AuthReq,
} from "@ft-transcendence/libs-frontend-services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./two-fa.module.css";
import { useForm } from "react-hook-form";

const TwoFa: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const handleTwoFa = (data: any) => {
    setMessage("");
    AuthReq.ValidateTwoFa(data.twoFaCode).then(
      () => {
        navigate("/home");
        window.location.reload();
      },
      (error: any) => {
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
    <form className={classes["twofa"]} onSubmit={handleSubmit(handleTwoFa)}>
      <h5 className={classes["twofa_label"]}>Two-Factor Authentication</h5>
      <input placeholder="Code" type="text"
        className={errors['twofa_code'] ? classes['twofa_input_red'] : classes['twofa_input']}
        {...register("twofa_code", {
          required: true
        })}
      />

      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}

      <input type="submit" className={classes['twofa_btn']} >Send code</input>
    </form>
  );
};
export { TwoFa };
