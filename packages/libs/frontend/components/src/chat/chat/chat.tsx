import classes from "./chat.module.css";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { useEffect, useRef, useCallback } from "react";

const Chat: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();

  const socketRef = useRef(io("ws://localhost:8080"));

  const sendMessage = useCallback(
    (data) => {
      socketRef.current.emit("chat:message", data.message);
      reset();
    },
    [reset]
  );

  useEffect(() => {
    const socket = socketRef.current;
    socketRef.current.emit("hello from client", 5, "6", {
      7: Uint8Array.from([8]),
    });

    socket.on("chat:message", (msg: string) => {
      console.log("Someone sent:" + msg);
    });
  }, [sendMessage]);

  return (
    <div className={classes["chat_form"]}>
      <span className={classes["chat_span"]}>Register</span>
      <form onSubmit={handleSubmit(sendMessage)}>
        <div className={classes["chat_bar"]}>
          <input
            placeholder="Message"
            type="text"
            className={classes["chat_input"]}
            {...register("message", {
              required: true,
            })}
          />

          <input type="submit" className={classes["chat_btn"]} />
        </div>
      </form>
    </div>
  );
};

export { Chat };
