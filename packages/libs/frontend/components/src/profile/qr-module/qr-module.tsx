import classes from "./qr-module.module.css";
import { AuthReq, vrequired } from "@ft-transcendence/libs-frontend-services";
import { GenerateQr } from "@ft-transcendence/libs-frontend-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const QrModule = (props: any) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleTwoFa = (data) => {
    setMessage("");
    console.log("test");
    try {
      AuthReq.ActivateTwoFa(data.twoFaCode).then( () => {
        AuthReq.logout();
        navigate("/");
        window.location.reload();
      })
    } catch (err) {
      const resMessage =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString();
      setMessage(resMessage);
    }
  };

  return (
    <form className={classes['qr_module_form']} onSubmit={handleSubmit(handleTwoFa)}>
      <h5 className={classes['qr_module_label']}>Two-Factor Authentication</h5>
      <GenerateQr />

      <input placeholder="code" type="text"
        className={errors.twofa_code ? classes.qr_module_input_red : classes.qr_module_input}
        {...register("twofa_code", {
          required: true
        })}
      />

      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}

      <input type="submit" className={classes.qr_module_btn} />
    </form>
  );
};

export { QrModule };
