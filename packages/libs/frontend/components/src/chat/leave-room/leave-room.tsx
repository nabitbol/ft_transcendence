import {
  SocketContext,
  vnumber,
  vpassword_length,
  vregex,
  vusername_length,
} from "@ft-transcendence/libs-frontend-services";
import { useCallback, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Socket } from "socket.io-client";
import styles from "./leave-room.module.css";

/* eslint-disable-next-line */
export interface LeaveRoomProps {}

export function LeaveRoom(props: LeaveRoomProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const socket: Socket = useContext(SocketContext);

  const handleRegister = (data: any) => {
    setMessage("");
    setSuccessful(false);
    const test = { name: data.room_name, password: data.room_password };
    console.log(test);
    socket.emit("client:createRoom", test);
  };

  return (
    <div className={styles["register_form"]}>
      <span className={styles["register_span"]}>Leave room</span>
      <form onSubmit={handleSubmit(handleRegister)}>
        <input
          placeholder="RoomName"
          type="text"
          className={
            errors["room_name"]
              ? styles["register_input_red"]
              : styles["register_input"]
          }
          {...register("room_name", {
            required: true,
            validate: {
              length: vusername_length,
              regex: vregex,
            },
          })}
        />

        {errors["room_name"] && errors["room_name"].type === "length" && (
          <div className="alert alert-danger" role="alert">
            The username must be between 4 and 25 characters.
          </div>
        )}
        {errors["room_name"] && errors["room_name"].type === "regex" && (
          <div className="alert alert-danger" role="alert">
            This field must only contain alphanumeric characters.
          </div>
        )}

        <input
          placeholder="Password"
          type="password"
          className={
            errors["room_password"]
              ? styles["register_input_red"]
              : styles["register_input"]
          }
          {...register("room_password", {
            required: true,
            validate: {
              length: vpassword_length,
              regex: vregex,
              number: vnumber,
            },
          })}
        />
        {errors["room_password"] && errors["room_password"].type === "length" && (
          <div className="alert alert-danger" role="alert">
            The password must be between 8 and 40 characters.
          </div>
        )}
        {errors["room_password"] && errors["room_password"].type === "regex" && (
          <div className="alert alert-danger" role="alert">
            This field must only contain alphanumeric characters.
          </div>
        )}
        {errors["room_password"] && errors["room_password"].type === "number" && (
          <div className="alert alert-danger" role="alert">
            This field must container at least 1 number.
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

        <input type="submit" className={styles["register_btn"]} />
      </form>
    </div>
  );
}

export default LeaveRoom;
