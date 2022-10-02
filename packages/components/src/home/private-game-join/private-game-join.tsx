import classes from "./private-game-join.module.css";
import { vonly_number, vrequired } from "@ft-transcendence/frontend-services";
import { useState, useRef } from "react";
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";

const PrivateGameJoin = () => {
  const form = useRef<any>();
  const checkBtn = useRef<any>();
  const [errorMessage, setErrorMessage] = useState("");
  const [Code, setCode] = useState("");
  const [successful, setSuccessful] = useState(false);

  const handleTwoFa = (event: any) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessful(false);
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      /*AuthService.ActivateTwoFa(Code).then(
          () => {
            setErrorMessage('2FA is now activated !');
            setSuccessful(true);
            navigate("/");
            window.location.reload();
          },
          (error) => {
          const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            setErrorMessage(resMessage);
          setSuccessful(false);
          }
        );*/
    }
  };

  const onChangeCode = (event: any) => {
    const Code = event.target.value;
    setCode(Code);
  };

  return (
    <Form className={classes.pg_join_form} onSubmit={handleTwoFa} ref={form}>
      <h5 className={classes.pg_join_label}>Enter game id</h5>
      <Input
        type="text"
        className={classes.pg_join_input}
        name="Code"
        value={Code}
        onChange={onChangeCode}
        validations={[vrequired, vonly_number]}
      />
      <button className={classes.pg_join_btn}>Activate</button>
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

export {PrivateGameJoin};
