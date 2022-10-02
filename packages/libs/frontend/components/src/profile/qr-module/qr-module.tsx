import classes from "./qr-module.module.css";
import { AuthReq, vrequired } from "@ft-transcendence/libs-frontend-services";
import {GenerateQr} from "@ft-transcendence/libs-frontend-components";
import { useState, useRef } from "react";
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { useNavigate } from "react-router-dom";

const QrModule = (props: any) => {
  const navigate = useNavigate();
  const form = useRef<any>();
  const checkBtn = useRef<any>();
  const [errorMessage, setErrorMessage] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [successful, setSuccessful] = useState(false);

  const handleTwoFa = (event: any) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessful(false);
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      AuthReq.ActivateTwoFa(twoFaCode).then(
        () => {
          setErrorMessage("2FA is now activated !");
          setSuccessful(true);
          AuthReq.logout();
          navigate("/");
          window.location.reload();
        },
        (error: any) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setErrorMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  const onChangetwoFaCode = (event: any) => {
    const twoFaCode = event.target.value;
    setTwoFaCode(twoFaCode);
  };

  return (
    <Form className={classes['qr_module_form']} onSubmit={handleTwoFa} ref={form}>
      <h5 className={classes['qr_module_label']}>Two-Factor Authentication</h5>
      <GenerateQr/>
      <Input
        type="text"
        className={classes['qr_module_input']}
        name="twoFaCode"
        value={twoFaCode}
        onChange={onChangetwoFaCode}
        validations={[vrequired]}
      />
      <button className={classes['qr_module_btn']}>Activate</button>
      {errorMessage && (
        <div className="form-group">
          <div
            className={
              successful ? "alert alert-success" : "alert alert-danger"
            }
            role="alert"
          >
            {errorMessage}
          </div>
        </div>
      )}
      <CheckButton style={{ display: "none" }} ref={checkBtn} />
    </Form>
  );
};

export {QrModule};
