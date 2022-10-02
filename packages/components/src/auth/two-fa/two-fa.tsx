import {
  vrequired,
  AuthReq,
} from "@ft-transcendence/frontend-services";
import { useState, useRef } from "react";
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { useNavigate } from "react-router-dom";
import classes from "./two-fa.module.css";

const TwoFa: React.FC = () => {
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
      AuthReq.ValidateTwoFa(twoFaCode).then(
        () => {
          console.log("CODE =" + twoFaCode);
          setErrorMessage("Correct 2FA code");
          setSuccessful(true);
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
    <Form className={classes["twofa"]} onSubmit={handleTwoFa} ref={form}>
      <h5 className={classes["twofa_label"]}>Two-Factor Authentication</h5>
      <Input
        type="text"
        className={classes["twofa_input"]}
        name="twoFaCode"
        value={twoFaCode}
        onChange={onChangetwoFaCode}
        validations={[vrequired]}
      />
      <button className={classes["twofa_btn"]}>Send code</button>
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
export { TwoFa };
