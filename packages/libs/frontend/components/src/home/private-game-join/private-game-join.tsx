import classes from "./private-game-join.module.css";
import { vonly_number } from "@ft-transcendence/libs-frontend-services";
import { useState } from "react";
import { useForm } from "react-hook-form";

const PrivateGameJoin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");

  const handleTwoFa = (data) => {
    console.log(data);
  };

  return (
    <form className={classes.pg_join_form} onSubmit={handleSubmit(handleTwoFa)}>
      <span className={classes.pg_span}>Enter game id</span>
      <input placeholder="Password" type="text"
        className={errors.room_code ? classes.input_red : classes.input}
        {...register("room_code", {
          required: true,
          validate: { num: vonly_number }
        })}
      />
      {errors.room_code && errors.room_code.type === "num" && (
          <div className="alert alert-danger" role="alert">
              This field must contain only number.
          </div>
      )}

      {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
      )}

    <input type="submit" className={classes.pg_join_btn} />

    </form>
  );
};

export { PrivateGameJoin };
