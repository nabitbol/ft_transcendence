import {
  SocketChatContext,
  vnumber,
  vpassword_length,
  vregex,
  vregex_password,
  vusername_length,
} from "@ft-transcendence/libs-frontend-services";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Socket } from "socket.io";
import styles from "./create-room.module.css";

/* eslint-disable-next-line */
export interface CreateRoomProps {}

export function CreateRoom(props: CreateRoomProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const [isHideInput, setIsHideInput] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const socket: Socket = useContext(SocketChatContext);

  const listenerUpdateErrorMessage = (err) => {
    setMessage(err.message);
  };

  const listenerSuccessful = () => {
    setSuccessful(true);
    setMessage("Room created successfully");
  };

  useEffect(() => {
    socket.on("server:createroom", listenerSuccessful);
    socket.on("exception", listenerUpdateErrorMessage);
    return () => {
      socket.off("exception", listenerUpdateErrorMessage);
      socket.off("server:createroom", listenerSuccessful);
    };
  }, [socket]);

  const handleRegister = (data: any) => {
    setMessage("");
    setSuccessful(false);
    const roomData = {
      name: data.room_name,
      password: data.room_password || undefined,
      status: data.status,
    };
    socket.emit("client:createroom", roomData);
  };

  return (
    <div className={styles["register_form"]}>
      <span className={styles["register_span"]}>Create a room</span>
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

        <div className={styles["create_room_input_div"]}>
          <label htmlFor="public">Public</label>
          <input
            {...register("status", { required: true })}
            type="radio"
            value="PUBLIC"
            className={styles["create_room_input"]}
            onChange={(e) => setIsHideInput(false)}
          />
          <label htmlFor="Private">Private</label>
          <input
            {...register("status", { required: true })}
            type="radio"
            value="PRIVATE"
            className={styles["create_room_input"]}
            onChange={(e) => setIsHideInput(false)}
          />
          <label htmlFor="protected">Protected</label>
          <input
            {...register("status", { required: true })}
            type="radio"
            value="PROTECTED"
            className={styles["create_room_input"]}
            onChange={(e) => setIsHideInput(true)}
          />
        </div>
        {errors["status"] && (
          <div className="alert alert-danger" role="alert">
            Please select a room status
          </div>
        )}

        {isHideInput && (
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
                regex: vregex_password,
                number: vnumber,
              },
            })}
          />
        )}
        {errors["room_password"] && errors["room_password"].type === "length" && (
          <div className="alert alert-danger" role="alert">
            The password must be between 8 and 40 characters.
          </div>
        )}
        {errors["room_password"] && errors["room_password"].type === "regex" && (
          <div className="alert alert-danger" role="alert">
            This field must only contain alphanumeric or special ascii characters.
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

export default CreateRoom;
