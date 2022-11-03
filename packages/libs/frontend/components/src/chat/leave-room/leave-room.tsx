import {
  SocketChatContext,
  vregex,
  vusername_length,
} from "@ft-transcendence/libs-frontend-services";
import { useCallback, useContext, useEffect, useState } from "react";
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
  const socket: Socket = useContext(SocketChatContext);

  const listenerUpdateErrorMessage = useCallback((err) => {
    setMessage(err.message);
  }, []);

  const listenerSuccessful = () => {
    setSuccessful(true);
    setMessage("leaved room successfully");
  };

  useEffect(() => {
    socket.on("server:leaveroom", listenerSuccessful);
    return () => {
      socket.off("server:leaveroom", listenerSuccessful);
    };
  }, [socket]);

  const handleRegister = (data: any) => {
    setMessage("");
    setSuccessful(false);
    socket.on("exception", listenerUpdateErrorMessage);
    const roomData = {
      name: data.room_name,
    };
    socket.emit("client:leaveroom", roomData);
  };

  return (
    <div className={styles["register_form"]}>
      <span className={styles["register_span"]}>leave a room</span>
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
