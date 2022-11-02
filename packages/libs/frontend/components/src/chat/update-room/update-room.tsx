import {
  SocketChatContext,
  vnumber,
  vpassword_length,
  vregex,
} from "@ft-transcendence/libs-frontend-services";
import { RoomDto } from "@ft-transcendence/libs-shared-types";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Socket } from "socket.io-client";
import styles from "./update-room.module.css";

/* eslint-disable-next-line */
export interface UpdateRoomProps {
  room: RoomDto;
}

export function UpdateRoom(props: UpdateRoomProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const [isHideInput, setIsHideInput] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const socket: Socket = useContext(SocketChatContext);

  const listenerUpdateErrorMessage = useCallback((err) => {
    setMessage(err.message);
  }, []);

  const listenerSuccessful = () => {
    setSuccessful(true);
    setMessage("Room updated successfully");
  };

  useEffect(() => {
    socket.on("server:updateroom", listenerSuccessful);
    return () => {
      socket.off("server:updateroom", listenerSuccessful);
    };
  }, [socket]);

  const handleRegister = (data: any) => {
    setMessage("");
    setSuccessful(false);
    socket.on("exception", listenerUpdateErrorMessage);
    const roomData = {
      name: props.room.name,
      password: data.room_password || undefined,
      status: data.status,
    };
    socket.emit("client:updateroom", roomData);
  };

  return (
    <div className={styles["register_form"]}>
      <span className={styles["register_span"]}>Update a room</span>
      <form onSubmit={handleSubmit(handleRegister)}>
        <span className={styles["roomname_span"]}>{props.room.name}</span>
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
                regex: vregex,
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

export default UpdateRoom;
